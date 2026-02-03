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
        $this->call(RoleSeeder::class);

        // Create admin and client users
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

        // Assign roles to users
        $admin->roles()->attach(Role::where('slug', 'admin')->first());
        $client->roles()->attach(Role::where('slug', 'client')->first());
    }
}
