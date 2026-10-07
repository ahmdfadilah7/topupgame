<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Voucher;

class FrontendVoucherController extends Controller
{
    public function validateVoucher(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'transaction_amount' => 'required|numeric'
        ]);

        $voucher = Voucher::where('code', strtoupper($request->code))
            ->where('is_active', true)
            ->first();

        if (!$voucher) {
            return response()->json(['message' => 'Voucher code is invalid or inactive.'], 404);
        }

        if ($voucher->usage_limit !== null && $voucher->used_count >= $voucher->usage_limit) {
            return response()->json(['message' => 'Voucher usage limit reached.'], 400);
        }

        if ($voucher->valid_until !== null && now()->isAfter($voucher->valid_until)) {
            return response()->json(['message' => 'Voucher has expired.'], 400);
        }

        $discountValue = 0;
        if ($voucher->discount_type === 'percent') {
            $discountValue = ($request->transaction_amount * $voucher->discount_value) / 100;
        } else {
            $discountValue = $voucher->discount_value;
        }

        // Limit discount to max_discount if set
        if ($voucher->max_discount !== null && $discountValue > $voucher->max_discount) {
            $discountValue = $voucher->max_discount;
        }

        return response()->json([
            'message' => 'Voucher applied successfully!',
            'voucher' => [
                'code' => $voucher->code,
                'discount_amount' => $discountValue
            ]
        ]);
    }
}
