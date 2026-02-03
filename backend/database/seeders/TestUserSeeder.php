<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Asegurar que existan los roles
        $roleAdmin = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Administrador']);
        $roleClient = Role::firstOrCreate(['slug' => 'client'], ['name' => 'Cliente']);

        // 2. Crear Usuario ADMIN
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('12345678'), // Contraseña fácil
            ]
        );
        // Adjuntar rol en tabla pivote (si no lo tiene ya)
        if (!$admin->roles()->where('slug', 'admin')->exists()) {
            $admin->roles()->attach($roleAdmin);
        }

        // 3. Crear Usuario CLIENTE
        $client = User::firstOrCreate(
            ['email' => 'cliente@test.com'],
            [
                'name' => 'Usuario Cliente',
                'password' => Hash::make('12345678'),
            ]
        );
        if (!$client->roles()->where('slug', 'client')->exists()) {
            $client->roles()->attach($roleClient);
        }
    }
}
