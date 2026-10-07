<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$key = env('XENDIT_SECRET_KEY');
$response = Illuminate\Support\Facades\Http::withBasicAuth($key, '')->get('https://api.xendit.co/available_virtual_account_banks');
echo "VA: " . $response->body() . "\n";

$response2 = Illuminate\Support\Facades\Http::withBasicAuth($key, '')->get('https://api.xendit.co/ewallets/channels');
echo "Ewallets: " . $response2->body() . "\n";
