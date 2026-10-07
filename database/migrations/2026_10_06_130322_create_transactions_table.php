<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('ref_id')->unique();
            $table->string('customer_no');
            $table->string('buyer_sku_code');
            $table->string('product_name')->nullable();
            $table->string('brand')->nullable();
            $table->decimal('price', 15, 2)->default(0);
            $table->decimal('fee', 15, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->string('status')->default('Pending'); // Pending, Success, Failed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
