<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proker;

class ProkerSeeder extends Seeder
{
    public function run()
    {
        $prokers = [
            ['nama'=>'Program A', 'deskripsi'=>'Deskripsi A', 'tanggal'=>'2023-09-01', 'featured_image'=>null, 'status'=>'pending'],
            ['nama'=>'Program B', 'deskripsi'=>'Deskripsi B', 'tanggal'=>'2023-09-10', 'featured_image'=>null, 'status'=>'berjalan'],
            ['nama'=>'Program C', 'deskripsi'=>'Deskripsi C', 'tanggal'=>'2023-10-01', 'featured_image'=>null, 'status'=>'selesai'],
            ['nama'=>'Program D', 'deskripsi'=>'Deskripsi D', 'tanggal'=>'2023-10-15', 'featured_image'=>null, 'status'=>'pending'],
            ['nama'=>'Program E', 'deskripsi'=>'Deskripsi E', 'tanggal'=>'2023-11-01', 'featured_image'=>null, 'status'=>'berjalan'],
        ];

        foreach ($prokers as $p) {
            Proker::create($p);
        }
    }
}
