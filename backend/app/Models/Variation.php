<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variation extends Model
{
    protected $fillable = [
        'product_id',
        'color_id',
        'lenght',
        'width',
        'height',
        'price',
        'stock',
        'status',
    ];

    protected $casts = [
        'lenght' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function cartDetails()
    {
        return $this->hasMany(CartDetail::class);
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}
