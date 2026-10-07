<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Transaction;

class XenditController extends Controller
{
    private $secretKey;
    private $baseUrl = 'https://api.xendit.co';

    public function __construct()
    {
        $this->secretKey = env('XENDIT_SECRET_KEY');
    }

    /**
     * Create a payment request for Xendit (eWallet, QRIS, Virtual Account)
     */
    public function createPayment(Request $request)
    {
        $request->validate([
            'buyer_sku_code' => 'required|string',
            'customer_no' => 'required|string',
            'payment_method' => 'required|string', // e.g., 'QRIS', 'GoPay', 'BCA Virtual Account'
        ]);

        $sku = $request->input('buyer_sku_code');
        $customerNo = $request->input('customer_no');
        $paymentMethod = $request->input('payment_method');
        
        $refId = 'TRX-' . time() . rand(100, 999);

        // Fetch product details & calculate price by reusing DigiflazzController
        $productName = 'Unknown Product';
        $brand = 'Unknown Brand';
        $price = 0;

        try {
            $gamesResponse = app(DigiflazzController::class)->getGames();
            $gamesData = $gamesResponse->getData(true);
            
            if (isset($gamesData['data'])) {
                $product = collect($gamesData['data'])->firstWhere('buyer_sku_code', $sku);
                if ($product) {
                    $productName = $product['product_name'] ?? 'Unknown Product';
                    $brand = $product['brand'] ?? 'Unknown Brand';
                    $price = (float) $product['price']; // The price is already fully marked up by getGames()
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error fetching product in XenditController: ' . $e->getMessage());
        }

        if ($price <= 0) {
            return response()->json(['error' => 'Invalid product price.'], 400);
        }

        // Apply voucher discount if provided
        $voucherCode = $request->input('voucher_code');
        if ($voucherCode) {
            $voucher = \App\Models\Voucher::where('code', strtoupper($voucherCode))->where('is_active', true)->first();
            if ($voucher && ($voucher->usage_limit === null || $voucher->used_count < $voucher->usage_limit)) {
                if ($voucher->valid_until === null || now()->isBefore($voucher->valid_until)) {
                    $discount = ($voucher->discount_type === 'percent') ? ($price * $voucher->discount_value / 100) : $voucher->discount_value;
                    if ($voucher->max_discount && $discount > $voucher->max_discount) {
                        $discount = $voucher->max_discount;
                    }
                    $price -= $discount;
                    $voucher->increment('used_count'); // Increment usage
                }
            }
        }

        // Add payment fee based on method
        if ($paymentMethod === 'GoPay') {
            $price += 1000;
        } else if ($paymentMethod === 'BCA Virtual Account') {
            $price += 2500;
        }

        // Create transaction in Pending state
        $transaction = Transaction::create([
            'ref_id' => $refId,
            'customer_no' => $customerNo,
            'buyer_sku_code' => $sku,
            'product_name' => $productName,
            'brand' => $brand,
            'price' => $price,
            'payment_method' => $paymentMethod,
            'status' => 'Pending_Payment'
        ]);

        $xenditResponse = null;

        if ($paymentMethod === 'QRIS') {
            $xenditResponse = $this->createQris($refId, $price);
        } else if (in_array($paymentMethod, ['GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'])) {
            $channelCode = strtoupper(str_replace(' ', '_', $paymentMethod));
            if ($channelCode === 'GOPAY') $channelCode = 'ID_GOPAY';
            if ($channelCode === 'OVO') $channelCode = 'ID_OVO';
            if ($channelCode === 'DANA') $channelCode = 'ID_DANA';
            $xenditResponse = $this->createEwalletCharge($refId, $price, $channelCode, $productName);
        } else if (str_contains($paymentMethod, 'Virtual Account')) {
            if ($price < 10000) {
                return response()->json(['error' => 'Minimal pembayaran untuk Virtual Account adalah Rp 10.000. Silakan gunakan metode e-Wallet atau QRIS untuk nominal di bawah Rp 10.000.'], 400);
            }
            $bankCode = explode(' ', $paymentMethod)[0]; // e.g., "BCA"
            $xenditResponse = $this->createVirtualAccount($refId, $price, $bankCode, 'UpZone Topup');
        }

        if (!$xenditResponse || isset($xenditResponse['error_code'])) {
            $transaction->update(['status' => 'Failed']);
            \Log::error('Xendit Error: ' . json_encode($xenditResponse));
            return response()->json(['error' => 'Failed to generate payment from Xendit: ' . ($xenditResponse['message'] ?? json_encode($xenditResponse))], 500);
        }

        return response()->json([
            'message' => 'Payment created',
            'ref_id' => $refId,
            'amount' => $price,
            'payment_method' => $paymentMethod,
            'payment_details' => $xenditResponse
        ]);
    }

    private function createQris($refId, $amount)
    {
        $appUrl = url('/');
        $callbackUrl = (str_contains($appUrl, 'localhost') || str_contains($appUrl, '127.0.0.1')) 
            ? 'https://example.com/api/xendit/webhook' 
            : url('/api/xendit/webhook');

        $payload = [
            'external_id' => $refId,
            'type' => 'DYNAMIC',
            'amount' => $amount,
            'callback_url' => $callbackUrl
        ];

        $response = Http::withBasicAuth($this->secretKey, '')
            ->post($this->baseUrl . '/qr_codes', $payload);
            
        return $response->json();
    }

    private function createEwalletCharge($refId, $amount, $channelCode, $productName)
    {
        $appUrl = url('/');
        $successUrl = str_contains($appUrl, 'localhost') || str_contains($appUrl, '127.0.0.1') ? 'https://example.com/?status=success' : url('/?status=success');
        $failureUrl = str_contains($appUrl, 'localhost') || str_contains($appUrl, '127.0.0.1') ? 'https://example.com/?status=failed' : url('/?status=failed');

        $response = Http::withBasicAuth($this->secretKey, '')
            ->post($this->baseUrl . '/ewallets/charges', [
                'reference_id' => $refId,
                'currency' => 'IDR',
                'amount' => $amount,
                'checkout_method' => 'ONE_TIME_PAYMENT',
                'channel_code' => $channelCode,
                'channel_properties' => [
                    'success_redirect_url' => $successUrl,
                    'failure_redirect_url' => $failureUrl,
                ],
                'metadata' => [
                    'product_name' => $productName
                ]
            ]);
        return $response->json();
    }

    public function getPaymentMethods()
    {
        $methods = [
            ['name' => 'QRIS', 'type' => 'QR_CODE'],
            ['name' => 'GoPay', 'type' => 'EWALLET'],
            ['name' => 'OVO', 'type' => 'EWALLET'],
            ['name' => 'DANA', 'type' => 'EWALLET'],
            ['name' => 'ShopeePay', 'type' => 'EWALLET'],
        ];

        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->get($this->baseUrl . '/available_virtual_account_banks');

            if ($response->ok()) {
                $banks = $response->json();
                foreach ($banks as $bank) {
                    if (isset($bank['is_activated']) && $bank['is_activated'] && $bank['country'] === 'ID') {
                        $methods[] = [
                            'name' => $bank['code'] . ' Virtual Account',
                            'code' => $bank['code'],
                            'type' => 'VIRTUAL_ACCOUNT'
                        ];
                    }
                }
            }
        } catch (\Exception $e) {}

        return response()->json($methods);
    }

    private function createVirtualAccount($refId, $amount, $bankCode, $name)
    {
        $response = Http::withBasicAuth($this->secretKey, '')
            ->post($this->baseUrl . '/callback_virtual_accounts', [
                'external_id' => $refId,
                'bank_code' => strtoupper($bankCode),
                'name' => $name,
                'expected_amount' => $amount,
                'is_closed' => true,
                'expiration_date' => now()->addHours(24)->toIso8601String()
            ]);
        return $response->json();
    }

    /**
     * Handle webhook from Xendit
     */
    public function webhook(Request $request)
    {
        // Add basic security token check if configured
        $webhookToken = env('XENDIT_WEBHOOK_TOKEN');
        if ($webhookToken && $request->header('x-callback-token') !== $webhookToken) {
            return response()->json(['error' => 'Invalid token'], 403);
        }

        $event = $request->all();
        $refId = null;
        $status = null;

        // Determine event type
        if (isset($event['event']) && $event['event'] === 'qr.payment') {
            $refId = $event['data']['qr_code']['external_id'] ?? null;
            $status = 'PAID';
        } else if (isset($event['data']['status']) && in_array($event['data']['status'], ['SUCCEEDED'])) {
            $refId = $event['data']['reference_id'] ?? null; // E-wallet
            $status = 'PAID';
        } else if (isset($event['external_id']) && isset($event['payment_id'])) {
            $refId = $event['external_id']; // VA payment
            $status = 'PAID';
        }

        if ($refId && $status === 'PAID') {
            $transaction = Transaction::where('ref_id', $refId)->first();
            if ($transaction && $transaction->status === 'Pending_Payment') {
                $transaction->update(['status' => 'Paid']);
                
                // TODO: Here you would call Digiflazz to process the topup
                // For now, let's just mark it as processing or hit a helper method
                app(DigiflazzController::class)->processTopupAfterPayment($transaction);
            }
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Simulate Webhook for frontend testing
     */
    public function simulateWebhook(Request $request)
    {
        $refId = $request->input('ref_id');
        if (!$refId) return response()->json(['error' => 'Missing ref_id'], 400);

        $transaction = Transaction::where('ref_id', $refId)->first();
        if ($transaction && $transaction->status === 'Pending_Payment') {
            $transaction->update(['status' => 'Paid']);
            app(DigiflazzController::class)->processTopupAfterPayment($transaction);
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Transaction not found or already processed'], 404);
    }
}
