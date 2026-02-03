<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'external_id',
        'payment_token',
        'currency',
        'amount',
        'status',
        'payment_method',
        'gateway_response',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
