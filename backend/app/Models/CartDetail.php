<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartDetail extends Model
{
    protected $fillable = [
        'cart_id',
        'variation_id',
        'quantity',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function variation()
    {
        return $this->belongsTo(Variation::class);
    }
}
