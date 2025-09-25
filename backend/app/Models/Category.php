<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    
    protected $table = 'blog_categories';
    protected $fillable = ['name', 'slug'];

    // Relasi ke Blog (satu kategori punya banyak blog)
    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }
}
