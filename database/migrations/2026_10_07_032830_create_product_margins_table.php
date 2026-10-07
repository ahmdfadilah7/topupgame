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
        Schema::create('product_margins', function (Blueprint $table) {
            $table->id();
            $table->string('buyer_sku_code')->unique();
            $table->integer('custom_price')->nullable();
            $table->string('markup_type')->nullable(); // 'percent' or 'fixed'
            $table->decimal('markup_value', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_margins');
    }
};
