<?php

namespace Database\Seeders;

use App\Models\StyleCategory;
use Illuminate\Database\Seeder;

class StyleCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Realista',
            'Low Poly',
            'Cartoon',
            'Stylized',
            'PBR',
            'Hand Painted',
            'Pixel Art',
            'Anime',
            'Minimalista',
            'Cyberpunk',
            'Medieval',
            'Moderno',
        ];

        foreach ($categories as $category) {
            StyleCategory::create(['name' => $category]);
        }
    }
}
