<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Merchandise extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'price',
        'stock',
        'sold',
        'description',
        'sizes',
        'colors',
        'image'
    ];

    protected $casts = [
        'sizes' => 'array',
        'colors' => 'array',
        'price' => 'decimal:2',
        'stock' => 'integer',
        'sold' => 'integer' 

    ];

    public function category()
    {
        return $this->belongsTo(CategoryMerchandise::class, 'category_id');
    }

}
