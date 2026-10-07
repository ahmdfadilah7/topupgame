<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DigiflazzController extends Controller
{
    private function applyMarkupToItem($item, $statuses, $margins, $globalMarkupType, $globalMarkupValue) {
        $brandActive = $statuses[$item['brand']] ?? true;
        $skuActive = $statuses[$item['buyer_sku_code']] ?? true;
        $item['is_active'] = $brandActive && $skuActive;

        $modal = (float) $item['price'];
        $item['modal_price'] = $modal;

        $margin = $margins[$item['buyer_sku_code']] ?? null;
        if ($margin && $margin->custom_price !== null) {
            $sellPrice = max((float)$margin->custom_price, $modal);
        } else {
            $mType = $margin->markup_type ?? $globalMarkupType;
            $mValue = (float) ($margin->markup_value ?? $globalMarkupValue);

            if ($mType === 'percent') {
                $sellPrice = $modal + ($modal * ($mValue / 100));
            } else {
                $sellPrice = $modal + $mValue;
            }
            $sellPrice = max($sellPrice, $modal); 
        }

        $item['price'] = round($sellPrice);
        return $item;
    }

    public function getGames()
    {
        $data = cache()->remember('digiflazz_games', 300, function () {
            $username = env('DIGIFLAZZ_USERNAME', 'demo');
            $apiKey = env('DIGIFLAZZ_KEY', 'demo');
            $sign = md5($username . $apiKey . "depo");

            try {
                $response = Http::post('https://api.digiflazz.com/v1/price-list', [
                    'cmd' => 'prepaid',
                    'username' => $username,
                    'sign' => $sign
                ]);

                if ($response->successful()) {
                    $json = $response->json();
                    if (isset($json['data']) && is_array($json['data']) && !isset($json['data']['rc'])) {
                        return $json;
                    }
                }
                return null;
            } catch (\Exception $e) {
                return null;
            }
        });

        $statuses = \App\Models\ItemStatus::pluck('is_active', 'code')->toArray();
        $margins = \App\Models\ProductMargin::all()->keyBy('buyer_sku_code');
        $globalMarkupType = \App\Models\Setting::where('key', 'global_markup_type')->value('value') ?? 'percent';
        $globalMarkupValue = (float) (\App\Models\Setting::where('key', 'global_markup_value')->value('value') ?? 0);

        if ($data && isset($data['data'])) {
            $data['data'] = array_map(function($item) use ($statuses, $margins, $globalMarkupType, $globalMarkupValue) {
                return $this->applyMarkupToItem($item, $statuses, $margins, $globalMarkupType, $globalMarkupValue);
            }, $data['data']);
            return response()->json($data);
        }

        // Fallback dummy data if Digiflazz rate limit is active so development is not blocked
        $fallback = [
            'data' => [
                [
                    "product_name" => "86 Diamonds",
                    "category" => "Games",
                    "brand" => "Mobile Legends",
                    "price" => 20000,
                    "buyer_sku_code" => "ml86",
                    "seller_product_status" => true
                ],
                [
                    "product_name" => "172 Diamonds",
                    "category" => "Games",
                    "brand" => "Mobile Legends",
                    "price" => 40000,
                    "buyer_sku_code" => "ml172",
                    "seller_product_status" => true
                ],
                [
                    "product_name" => "60 UC",
                    "category" => "Games",
                    "brand" => "PUBG Mobile",
                    "price" => 15000,
                    "buyer_sku_code" => "pubg60",
                    "seller_product_status" => true
                ],
                [
                    "product_name" => "420 VP",
                    "category" => "Games",
                    "brand" => "Valorant",
                    "price" => 50000,
                    "buyer_sku_code" => "val420",
                    "seller_product_status" => true
                ]
            ],
            'mocked' => true,
            'message' => 'Rate limit exceeded. Using fallback mock data.'
        ];

        $fallback['data'] = array_map(function($item) use ($statuses, $margins, $globalMarkupType, $globalMarkupValue) {
            return $this->applyMarkupToItem($item, $statuses, $margins, $globalMarkupType, $globalMarkupValue);
        }, $fallback['data']);
        return response()->json($fallback);
    }
    public function topup(Request $request)
    {
        $request->validate([
            'buyer_sku_code' => 'required|string',
            'customer_no' => 'required|string',
        ]);

        $sku = $request->input('buyer_sku_code');
        $customerNo = $request->input('customer_no');
        $refId = $request->input('ref_id', 'TRX-' . time() . rand(100, 999));
        
        // Find product details from Digiflazz cached price list so we can save product_name and brand
        $productName = 'Unknown Product';
        $brand = 'Unknown Brand';
        $price = 0;
        
        try {
            // Re-fetch games from local cache to get product details
            $cachedGames = cache('digiflazz_games');
            if ($cachedGames && isset($cachedGames['data'])) {
                $product = collect($cachedGames['data'])->firstWhere('buyer_sku_code', $sku);
                if ($product) {
                    $statuses = \App\Models\ItemStatus::pluck('is_active', 'code')->toArray();
                    $margins = \App\Models\ProductMargin::all()->keyBy('buyer_sku_code');
                    $globalMarkupType = \App\Models\Setting::where('key', 'global_markup_type')->value('value') ?? 'percent';
                    $globalMarkupValue = (float) (\App\Models\Setting::where('key', 'global_markup_value')->value('value') ?? 0);
                    
                    $markedUpProduct = $this->applyMarkupToItem($product, $statuses, $margins, $globalMarkupType, $globalMarkupValue);

                    $productName = $markedUpProduct['product_name'] ?? 'Unknown Product';
                    $brand = $markedUpProduct['brand'] ?? 'Unknown Brand';
                    $price = $markedUpProduct['price'] ?? 0;
                }
            }

            // Save to database
            $transaction = \App\Models\Transaction::create([
                'ref_id' => $refId,
                'customer_no' => $customerNo,
                'buyer_sku_code' => $sku,
                'product_name' => $productName,
                'brand' => $brand,
                'price' => $price,
                'payment_method' => $request->input('payment_method', 'Balance'),
                'status' => 'Pending'
            ]);

            return response()->json([
                'data' => [
                    'ref_id' => $refId,
                    'customer_no' => $customerNo,
                    'buyer_sku_code' => $sku,
                    'message' => 'Transaksi sedang diproses',
                    'status' => 'Pending',
                    'rc' => '00',
                    'sn' => ''
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function toggleStatus(Request $request)
    {
        $request->validate([
            'type' => 'required|in:brand,sku',
            'code' => 'required|string',
            'is_active' => 'required|boolean'
        ]);

        \App\Models\ItemStatus::updateOrCreate(
            ['type' => $request->type, 'code' => $request->code],
            ['is_active' => $request->is_active]
        );

        return response()->json(['success' => true]);
    }

    public function getTransactions()
    {
        $transactions = \App\Models\Transaction::orderBy('created_at', 'desc')->get();
        return response()->json($transactions);
    }

    public function updateTransactionStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Success,Failed'
        ]);

        $transaction = \App\Models\Transaction::findOrFail($id);
        $transaction->status = $request->status;
        $transaction->save();

        return response()->json(['success' => true]);
    }

    public function getSettings()
    {
        $settings = \App\Models\Setting::pluck('value', 'key');
        return response()->json($settings);
    }

    public function saveSettings(Request $request)
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            \App\Models\Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return response()->json(['success' => true]);
    }

    public function saveProductMargin(Request $request)
    {
        $request->validate([
            'buyer_sku_code' => 'required|string',
            'custom_price' => 'nullable|numeric',
            'markup_type' => 'nullable|string|in:percent,fixed',
            'markup_value' => 'nullable|numeric'
        ]);

        \App\Models\ProductMargin::updateOrCreate(
            ['buyer_sku_code' => $request->buyer_sku_code],
            [
                'custom_price' => $request->custom_price,
                'markup_type' => $request->markup_type,
                'markup_value' => $request->markup_value
            ]
        );

        return response()->json(['success' => true]);
    }

    public function processTopupAfterPayment($transaction)
    {
        $username = env('DIGIFLAZZ_USERNAME', 'demo');
        $apiKey = env('DIGIFLAZZ_KEY', 'demo');
        $sign = md5($username . $apiKey . $transaction->ref_id);

        try {
            $response = Http::post('https://api.digiflazz.com/v1/transaction', [
                'username' => $username,
                'buyer_sku_code' => $transaction->buyer_sku_code,
                'customer_no' => $transaction->customer_no,
                'ref_id' => $transaction->ref_id,
                'sign' => $sign,
                'msg' => ''
            ]);

            $json = $response->json();
            
            if (isset($json['data']) && in_array($json['data']['status'], ['Sukses', 'Pending'])) {
                $transaction->update([
                    'status' => $json['data']['status']
                ]);
            } else {
                $transaction->update([
                    'status' => 'Failed'
                ]);
            }
        } catch (\Exception $e) {
            $transaction->update(['status' => 'Failed']);
        }
    }
}
