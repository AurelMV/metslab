<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class AdminUserController extends Controller
{
    /**
     * Listar todos los usuarios con sus direcciones y roles.
     * Incluye usuarios desactivados (soft deleted).
     */
    public function index(Request $request)
    {
        $query = User::with(['roles', 'addresses'])->withTrashed();

        // Filtro por búsqueda (Nombre o Email)
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por Rol
        if ($request->has('role')) {
            $role = $request->role;
            $query->whereHas('roles', function($q) use ($role) {
                $q->where('slug', $role);
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($users);
    }

    /**
     * Ver detalle completo de un usuario (incluyendo sus pedidos).
     */
    public function show($userId)
    {
        $user = User::withTrashed()
            ->with([
                'roles',
                'addresses' => function($q) {
                    $q->withTrashed(); // Ver direcciones incluso si fueron borradas
                },
                'orders' => function($q) {
                    $q->orderBy('created_at', 'desc')
                      ->with(['details.variation.product.images', 'payment']); // Detalles de items y pago
                }
            ])
            ->findOrFail($userId);

        return response()->json($user);
    }

    /**
     * ACCIÓN: Asignar Rol (Enfoque RPC)
     * Recibe user_id y role en el body.
     */
    public function assignRole(Request $request)
    {
        // 1. Validar inputs
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'role' => 'required|string|exists:roles,slug',
        ]);

        $userId = $validated['user_id'];
        $roleSlug = $validated['role'];

        Log::info("Acción assignRole solicitada para User ID: $userId con Rol: $roleSlug");

        // 2. Buscar Usuario manualmente
        $user = User::withTrashed()->find($userId);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // 3. Seguridad: No quitarse admin a uno mismo
        if ($user->id === auth()->id() && $user->hasRole('admin') && $roleSlug !== 'admin') {
            return response()->json(['message' => 'No puedes quitarte tu propio rol de administrador'], 403);
        }

        // 4. Buscar ID del rol
        $role = Role::where('slug', $roleSlug)->first();
        
        // 5. Asignar
        $user->roles()->sync([$role->id]);

        return response()->json([
            'message' => 'Rol actualizado exitosamente',
            'user' => $user->load('roles')
        ]);
    }

    /**
     * Activar / Desactivar usuario (Soft Delete).
     */
    public function toggleStatus($userId)
    {
        $user = User::withTrashed()->findOrFail($userId);

        // Seguridad: No desactivarse a sí mismo
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'No puedes desactivar tu propia cuenta'], 403);
        }

        if ($user->trashed()) {
            $user->restore(); // Reactivar
            $message = 'Usuario reactivado exitosamente';
        } else {
            $user->delete(); // Desactivar
            $message = 'Usuario desactivado exitosamente';
        }

        return response()->json([
            'message' => $message,
            'user' => $user->admin_status
        ]);
    }
}
