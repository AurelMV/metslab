<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            ['name' => 'Rojo', 'hex_value' => '#FF0000'],
            ['name' => 'Azul', 'hex_value' => '#0000FF'],
            ['name' => 'Verde', 'hex_value' => '#00FF00'],
            ['name' => 'Amarillo', 'hex_value' => '#FFFF00'],
            ['name' => 'Negro', 'hex_value' => '#000000'],
            ['name' => 'Blanco', 'hex_value' => '#FFFFFF'],
            ['name' => 'Gris', 'hex_value' => '#808080'],
            ['name' => 'Naranja', 'hex_value' => '#FFA500'],
            ['name' => 'Morado', 'hex_value' => '#800080'],
            ['name' => 'Rosa', 'hex_value' => '#FFC0CB'],
            ['name' => 'Café', 'hex_value' => '#8B4513'],
            ['name' => 'Dorado', 'hex_value' => '#FFD700'],
            ['name' => 'Plateado', 'hex_value' => '#C0C0C0'],
        ];

        foreach ($colors as $color) {
            Color::create($color);
        }
    }
}
