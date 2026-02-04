<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * Listar direcciones.
     * Admin: ve todas | Cliente: solo las suyas.
     * Soporta filtros: ?district=, ?province=, ?department=, ?search=
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Si es admin, puede ver todas las direcciones
        if ($user->hasRole('admin')) {
            $query = Address::query();
        } else {
            // Clientes solo ven sus propias direcciones
            $query = Address::where('user_id', $user->id);
        }

        // Filtros opcionales
        if ($request->filled('district')) {
            $query->where('district', 'like', '%' . $request->district . '%');
        }

        if ($request->filled('province')) {
            $query->where('province', 'like', '%' . $request->province . '%');
        }

        if ($request->filled('department')) {
            $query->where('department', 'like', '%' . $request->department . '%');
        }

        // Búsqueda general en nombre, apellido o calle
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                  ->orWhere('last_name', 'like', '%' . $search . '%')
                  ->orWhere('street_name', 'like', '%' . $search . '%');
            });
        }

        // Filtro por user_id (solo para admins)
        if ($user->hasRole('admin') && $request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $addresses = $query->orderBy('created_at', 'desc')->get();

        return AddressResource::collection($addresses);
    }

    /**
     * Guardar nueva dirección.
     * El user_id se asigna automáticamente del token.
     */
    public function store(StoreAddressRequest $request)
    {
        $address = $request->user()->addresses()->create($request->validated());

        return response()->json([
            'message' => 'Dirección guardada con éxito',
            'address' => new AddressResource($address)
        ], 201);
    }

    /**
     * Mostrar una dirección específica.
     * Admin: puede ver cualquiera | Cliente: solo las suyas.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $address = Address::findOrFail($id);
        } else {
            $address = Address::where('user_id', $user->id)->findOrFail($id);
        }

        return new AddressResource($address);
    }

    /**
     * Actualizar dirección.
     * Solo el dueño puede actualizar (o admin).
     */
    public function update(UpdateAddressRequest $request, $id)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $address = Address::findOrFail($id);
        } else {
            $address = Address::where('user_id', $user->id)->findOrFail($id);
        }

        $address->update($request->validated());

        return response()->json([
            'message' => 'Dirección actualizada con éxito',
            'address' => new AddressResource($address)
        ]);
    }

    /**
     * Eliminar dirección (soft delete).
     * Solo el dueño puede eliminar (o admin).
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $address = Address::findOrFail($id);
        } else {
            $address = Address::where('user_id', $user->id)->findOrFail($id);
        }

        $address->delete();

        return response()->json([
            'message' => 'Dirección eliminada con éxito'
        ]);
    }
}
