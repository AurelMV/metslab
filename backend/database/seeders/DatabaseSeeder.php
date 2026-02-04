<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear roles primero
        $this->call(RoleSeeder::class);

        // 2. Crear categorías y colores
        $this->call([
            ObjectCategorySeeder::class,
            StyleCategorySeeder::class,
            ColorSeeder::class,
        ]);

        // 3. Crear usuarios de prueba
        $admin = User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@example.com',
            'password' => bcrypt('12345678'),
        ]);

        $client = User::factory()->create([
            'name' => 'Cliente',
            'email' => 'client@example.com',
            'password' => bcrypt('12345678'),
        ]);

        // 4. Asignar roles a usuarios
        $admin->roles()->attach(Role::where('slug', 'admin')->first());
        $client->roles()->attach(Role::where('slug', 'client')->first());
    }
}
