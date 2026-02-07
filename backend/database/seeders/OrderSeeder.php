<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Variation;
use App\Models\Address;
use Faker\Factory as Faker;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('es_PE');

        // 1. Obtener usuarios
        $users = User::whereHas('roles', function($q) {
            $q->where('slug', '!=', 'admin');
        })->get();

        if ($users->isEmpty()) {
            return;
        }

        // 2. Obtener productos
        $variations = Variation::with('product', 'color')->get();

        if ($variations->isEmpty()) {
            return;
        }

        // 3. Crear pedidos
        foreach ($users as $user) {
            $orderCount = rand(1, 4);

            for ($i = 0; $i < $orderCount; $i++) {
                $address = $user->addresses()->first();

                if (!$address) {
                    $address = Address::create([
                        'user_id' => $user->id,
                        'first_name' => explode(' ', $user->name)[0],
                        'last_name' => 'Test',
                        'street_name' => 'Calle Falsa 123',
                        'department' => 'Lima',
                        'province' => 'Lima',
                        'district' => 'Miraflores',
                        'postal_code' => '15046',
                        'phone_number' => '999888777',
                        'latitude' => -12.12,
                        'longitude' => -77.03
                    ]);
                }
                
                $status = $faker->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
                $date = $faker->dateTimeBetween('-1 year', 'now');

                $order = Order::create([
                    'user_id' => $user->id,
                    'address_id' => $address->id,
                    'status' => $status,
                    'total_amount' => 0,
                    'delivery_date' => $status === 'delivered' ? (clone $date)->modify('+3 days') : null,
                    'order_type' => 'delivery',
                ]);
                
                $order->created_at = $date;
                $order->updated_at = $date;
                $order->save();

                $total_amount = 0;
                $itemCount = rand(1, 3);
                
                for ($j = 0; $j < $itemCount; $j++) {
                    $variation = $variations->random();
                    $qty = rand(1, 2);
                    $price = $variation->price;
                    $subtotal = $price * $qty;

                    OrderDetail::create([
                        'order_id' => $order->id,
                        'variation_id' => $variation->id,
                        'product_name' => $variation->product->name,
                        'variation_attribute' => "Color: " . $variation->color->name,
                        'quantity' => $qty,
                        'unit_price' => $price,
                        'total_price' => $subtotal,
                        'created_at' => $date,
                        'updated_at' => $date,
                    ]);

                    $total_amount += $subtotal;
                }

                $order->update(['total_amount' => $total_amount]);

                // Crear Pago Simulado con campos correctos de la tabla payments
                if ($status !== 'cancelled') {
                    Payment::create([
                        'order_id' => $order->id,
                        'external_id' => $faker->uuid, // Antes transaction_id
                        'payment_token' => $faker->md5,
                        'currency' => 'PEN',
                        'amount' => $total_amount,
                        'status' => 'completed',
                        'payment_method' => $faker->randomElement(['card', 'paypal']), // Antes credit_card, etc.
                        'created_at' => $date, // Usamos created_at en lugar de payment_date
                        'updated_at' => $date,
                    ]);
                }
            }
        }
    }
}
