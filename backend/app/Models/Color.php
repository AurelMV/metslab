<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $fillable = [
        'name',
        'hex_value',
    ];

    public function variations()
    {
        return $this->hasMany(Variation::class);
    }
}
