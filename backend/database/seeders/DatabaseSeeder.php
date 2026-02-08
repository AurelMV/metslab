<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles y Permisos Base
        $this->call([
            RoleSeeder::class,
        ]);

        // 2. Catálogos Base (Categorías, Colores, etc.)
        $this->call([
            ObjectCategorySeeder::class,
            StyleCategorySeeder::class,
            ColorSeeder::class,
        ]);

        // 3. Usuarios de Prueba (Admin y Clientes)
        $this->call([
            TestUserSeeder::class,
        ]);

        // 4. Productos de Prueba (Catálogo)
        $this->call([
            ProductSeeder::class,
        ]);

        // 5. Pedidos de Prueba (Historial de compras)
        $this->call([
            OrderSeeder::class,
        ]);
    }
}
