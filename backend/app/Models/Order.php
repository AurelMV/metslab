<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'address_id',
        'status',
        'total_amount',
        'delivery_date',
        'order_type',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'delivery_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class)->withTrashed();
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function reclamaciones()
    {
        return $this->hasMany(Reclamacion::class);
    }
}
