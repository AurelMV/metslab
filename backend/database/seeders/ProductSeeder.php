<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ObjectCategory;
use App\Models\StyleCategory;
use App\Models\Color;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Obtener IDs disponibles
        $objectCategories = ObjectCategory::pluck('id')->toArray();
        $styleCategories = StyleCategory::pluck('id')->toArray();
        $colors = Color::pluck('id')->toArray();

        // Si no hay categorías, no podemos crear productos
        if (empty($objectCategories) || empty($styleCategories) || empty($colors)) {
            $this->command->warn('⚠️ Faltan categorías o colores. Ejecuta primero ObjectCategorySeeder, StyleCategorySeeder y ColorSeeder.');
            return;
        }

        // Crear 20 Productos
        for ($i = 0; $i < 20; $i++) {
            $product = Product::create([
                'name' => $faker->words(3, true), // "Robot Warrior X"
                'description' => $faker->paragraph(2),
                'object_category_id' => $faker->randomElement($objectCategories),
                'style_category_id' => $faker->randomElement($styleCategories),
            ]);

            // Agregar 2-3 Imágenes por producto
            for ($img = 0; $img < rand(2, 3); $img++) {
                $product->images()->create([
                    'path' => "https://picsum.photos/seed/{$product->id}_{$img}/400/400", // URL Fake
                    'order' => $img
                ]);
            }

            // Agregar 1-3 Variaciones (Colores/Precios)
            $usedColors = []; // Para no repetir color en el mismo producto
            
            for ($var = 0; $var < rand(1, 3); $var++) {
                $colorId = $faker->randomElement($colors);
                
                // Evitar duplicar colores
                if (in_array($colorId, $usedColors)) continue;
                $usedColors[] = $colorId;

                $product->variations()->create([
                    'color_id' => $colorId,
                    'price' => $faker->randomFloat(2, 10, 500), // Precio entre 10.00 y 500.00
                    'stock' => $faker->numberBetween(0, 100),
                    'lenght' => $faker->randomFloat(1, 10, 100),
                    'width' => $faker->randomFloat(1, 10, 100),
                    'height' => $faker->randomFloat(1, 10, 100),
                    'status' => 'active'
                ]);
            }
        }
    }
}
