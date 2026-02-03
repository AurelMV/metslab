<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // REGISTER METHOD
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $clientRole = Role::where('slug', 'client')->first();
        if ($clientRole) {
            $user->roles()->attach($clientRole);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user->load('roles')),
        ], 201);
    }

    // LOGIN METHOD
    public function login(LoginRequest $request)
    {
        // Verificar credenciales
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // Eliminar tokens anteriores si quieres sesión única (Opcional)
        // $user->tokens()->delete();

        // Crear nuevo token
        // Usamos el 'device_name' si viene del front, sino 'web'
        $deviceName = $request->device_name ?? 'web';
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'message' => 'Bienvenido ' . $user->name,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user->load('roles')),
        ]);
    }

    // LOGOUT METHOD
    public function logout(Request $request)
    {
        // Revoca EL token que se usó para esta petición (no cierra sesión en otros dispositivos)
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    // ME METHOD
    public function me(Request $request)
    {
        return response()->json(new UserResource($request->user()->load('roles')));
    }
}
