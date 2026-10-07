<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DigiflazzController;

Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [\App\Http\Controllers\AuthController::class, 'me']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
});

Route::get('/games', [DigiflazzController::class, 'getGames']);
Route::post('/topup', [DigiflazzController::class, 'topup']);
Route::post('/checkout', [\App\Http\Controllers\XenditController::class, 'createPayment']);
Route::post('/xendit/webhook', [\App\Http\Controllers\XenditController::class, 'webhook']);
Route::post('/xendit/simulate-webhook', [\App\Http\Controllers\XenditController::class, 'simulateWebhook']);
Route::get('/payment-methods', [\App\Http\Controllers\XenditController::class, 'getPaymentMethods']);
Route::post('/admin/toggle-status', [DigiflazzController::class, 'toggleStatus']);
Route::get('/admin/transactions', [DigiflazzController::class, 'getTransactions']);
Route::post('/admin/transactions/{id}/status', [DigiflazzController::class, 'updateTransactionStatus']);
Route::get('/admin/settings', [DigiflazzController::class, 'getSettings']);
Route::post('/admin/settings', [DigiflazzController::class, 'saveSettings']);
Route::post('/admin/product-margins', [DigiflazzController::class, 'saveProductMargin']);
Route::apiResource('/admin/vouchers', \App\Http\Controllers\VoucherController::class);
