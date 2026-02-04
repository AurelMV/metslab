<?php

namespace Database\Seeders;

use App\Models\ObjectCategory;
use Illuminate\Database\Seeder;

class ObjectCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Personajes',
            'Vehículos',
            'Edificios',
            'Muebles',
            'Armas',
            'Naturaleza',
            'Animales',
            'Props',
            'Arquitectura',
            'Sci-Fi',
            'Fantasy',
            'Decoración',
        ];

        foreach ($categories as $category) {
            ObjectCategory::create(['name' => $category]);
        }
    }
}
