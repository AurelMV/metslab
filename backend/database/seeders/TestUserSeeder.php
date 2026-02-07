<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('es_PE');

        // 1. Roles
        $roleAdmin = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Administrador']);
        $roleClient = Role::firstOrCreate(['slug' => 'client'], ['name' => 'Cliente']);

        // 2. Admin Principal
        $this->createUser($roleAdmin, 'admin@metslab.com', 'Super Admin', '12345678');

        // 3. Cliente de Prueba
        $this->createUser($roleClient, 'cliente@metslab.com', 'Cliente Demo', '12345678');

        // 4. Crear 20 Usuarios "Random" con Direcciones
        for ($i = 0; $i < 20; $i++) {
            $fakeUser = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('12345678'), // Contraseña fácil para pruebas
                'email_verified_at' => now(),
            ]);
            
            // Asignar rol de cliente
            $fakeUser->roles()->attach($roleClient);

            // Crear 1 a 3 direcciones para este usuario
            $numAddresses = rand(1, 3);
            for ($j = 0; $j < $numAddresses; $j++) {
                Address::create([
                    'user_id' => $fakeUser->id,
                    'first_name' => explode(' ', $fakeUser->name)[0],
                    'last_name' => $faker->lastName,
                    'street_name' => $faker->streetAddress,
                    'department' => 'Lima',
                    'province' => 'Lima',
                    'district' => $faker->city,
                    'postal_code' => $faker->postcode,
                    'phone_number' => $faker->phoneNumber,
                    'latitude' => $faker->latitude,
                    'longitude' => $faker->longitude,
                ]);
            }
        }
    }

    private function createUser($role, $email, $name, $password)
    {
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]
        );

        if (!$user->roles()->where('slug', $role->slug)->exists()) {
            $user->roles()->attach($role);
        }
        
        return $user;
    }
}
