<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Merchandise;

class MerchandiseSeeder extends Seeder
{
    public function run()
    {
        $items = [
            [
                'category_id'=>1,
                'name'=>'Kaos A',
                'price'=>75000,
                'stock'=>50,
                'sold'=>0, // ✅ tambahkan
                'description'=>'Kaos keren',
                'sizes'=>['S','M','L'],
                'colors'=>['Merah','Biru'],
                'image'=>null
            ],
            [
                'category_id'=>2,
                'name'=>'Hoodie B',
                'price'=>150000,
                'stock'=>30,
                'sold'=>0,
                'description'=>'Hoodie nyaman',
                'sizes'=>['M','L'],
                'colors'=>['Hitam'],
                'image'=>null
            ],
            [
                'category_id'=>3,
                'name'=>'Topi C',
                'price'=>50000,
                'stock'=>20,
                'sold'=>0,
                'description'=>'Topi stylish',
                'sizes'=>[],
                'colors'=>['Putih'],
                'image'=>null
            ],
            [
                'category_id'=>4,
                'name'=>'Sticker D',
                'price'=>10000,
                'stock'=>100,
                'sold'=>0,
                'description'=>'Sticker lucu',
                'sizes'=>[],
                'colors'=>['Merah'],
                'image'=>null
            ],
            [
                'category_id'=>5,
                'name'=>'Mug E',
                'price'=>40000,
                'stock'=>25,
                'sold'=>0,
                'description'=>'Mug keramik',
                'sizes'=>[],
                'colors'=>['Biru'],
                'image'=>null
            ],
        ];

        foreach ($items as $item) {
            Merchandise::create($item);
        }
    }
}
