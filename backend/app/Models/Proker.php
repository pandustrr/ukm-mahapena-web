<?php
// app/Models/Proker.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proker extends Model
{
    use HasFactory;
    protected $table = 'prokers'; 


    protected $fillable = [
        'nama',
        'deskripsi',
        'tanggal',
        'featured_image',
        'status',
    ];
}
