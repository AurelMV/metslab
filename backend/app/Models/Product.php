<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'object_category_id',
        'style_category_id',
    ];

    public function variations()
    {
        return $this->hasMany(Variation::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function objectCategory()
    {
        return $this->belongsTo(ObjectCategory::class);
    }

    public function styleCategory()
    {
        return $this->belongsTo(StyleCategory::class);
    }
}
