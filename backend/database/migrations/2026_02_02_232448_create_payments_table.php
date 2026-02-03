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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');

            $table->string('external_id')->nullable()->index();
            $table->string('payment_token')->nullable(); // Token temporal
            $table->string('currency', 3)->default('PEN');
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending');
            $table->string('payment_method')->default('card');

            $table->json('gateway_response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
