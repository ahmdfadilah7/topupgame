<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Voucher::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:vouchers,code',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $voucher = \App\Models\Voucher::create($validated);
        return response()->json($voucher, 201);
    }

    public function update(Request $request, $id)
    {
        $voucher = \App\Models\Voucher::findOrFail($id);
        
        $validated = $request->validate([
            'code' => 'required|string|unique:vouchers,code,' . $voucher->id,
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $voucher->update($validated);
        return response()->json($voucher);
    }

    public function destroy($id)
    {
        $voucher = \App\Models\Voucher::findOrFail($id);
        $voucher->delete();
        return response()->json(['message' => 'Voucher deleted successfully']);
    }
}
