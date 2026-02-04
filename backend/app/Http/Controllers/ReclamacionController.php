<?php

namespace App\Http\Controllers;

use App\Http\Requests\Reclamacion\StoreReclamacionRequest;
use App\Http\Requests\Reclamacion\UpdateReclamacionRequest;
use App\Http\Resources\ReclamacionResource;
use App\Models\Order;
use App\Models\Reclamacion;
use Illuminate\Http\Request;

class ReclamacionController extends Controller
{
    /**
     * Listar reclamaciones.
     * Admin: ve todas | Cliente: solo las suyas.
     * Soporta filtros: ?estado=, ?order_id=
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Si es admin, puede ver todas las reclamaciones
        if ($user->hasRole('admin')) {
            $query = Reclamacion::with(['user', 'order']);
        } else {
            // Clientes solo ven sus propias reclamaciones
            $query = Reclamacion::where('user_id', $user->id)->with('order');
        }

        // Filtro por estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        // Filtro por order_id
        if ($request->filled('order_id')) {
            $query->where('order_id', $request->order_id);
        }

        // Filtro por user_id (solo para admins)
        if ($user->hasRole('admin') && $request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $reclamaciones = $query->orderBy('created_at', 'desc')->get();

        return ReclamacionResource::collection($reclamaciones);
    }

    /**
     * Guardar nueva reclamación.
     * Verifica que el order_id pertenezca al usuario autenticado.
     */
    public function store(StoreReclamacionRequest $request)
    {
        $user = $request->user();
        $orderId = $request->validated()['order_id'];

        // Verificar que el pedido pertenece al usuario
        $order = Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'El pedido especificado no existe o no te pertenece'
            ], 403);
        }

        // Crear la reclamación
        $reclamacion = Reclamacion::create([
            'user_id'  => $user->id,
            'order_id' => $orderId,
            'telefono' => $request->validated()['telefono'],
            'detalle'  => $request->validated()['detalle'],
            'estado'   => 'pendiente',
        ]);

        $reclamacion->load('order');

        return response()->json([
            'message'     => 'Reclamación registrada con éxito',
            'reclamacion' => new ReclamacionResource($reclamacion)
        ], 201);
    }

    /**
     * Mostrar una reclamación específica.
     * Admin: puede ver cualquiera | Cliente: solo las suyas.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $reclamacion = Reclamacion::with(['user', 'order'])->findOrFail($id);
        } else {
            $reclamacion = Reclamacion::where('user_id', $user->id)
                ->with('order')
                ->findOrFail($id);
        }

        return new ReclamacionResource($reclamacion);
    }

    /**
     * Actualizar reclamación.
     * Solo permitido dentro de las primeras 3 horas.
     * Admin puede actualizar cualquier reclamación sin límite de tiempo.
     */
    public function update(UpdateReclamacionRequest $request, $id)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $reclamacion = Reclamacion::findOrFail($id);
        } else {
            $reclamacion = Reclamacion::where('user_id', $user->id)->findOrFail($id);

            // Verificar si aún está dentro del período de edición
            if (!$reclamacion->isEditable()) {
                return response()->json([
                    'message' => 'El período de edición ha expirado. Las reclamaciones solo pueden editarse dentro de las primeras 3 horas.',
                    'tiempo_transcurrido_horas' => $reclamacion->created_at->diffInHours(now())
                ], 403);
            }
        }

        // Filtrar solo los campos que el cliente puede actualizar
        $dataToUpdate = $request->validated();
        
        // Si no es admin, eliminar el campo estado para evitar modificaciones no autorizadas
        if (!$user->hasRole('admin')) {
            unset($dataToUpdate['estado']);
        }

        $reclamacion->update($dataToUpdate);

        return response()->json([
            'message'     => 'Reclamación actualizada con éxito',
            'reclamacion' => new ReclamacionResource($reclamacion)
        ]);
    }

    /**
     * Eliminar reclamación.
     * Solo el dueño puede eliminar (o admin).
     * Solo permitido si la reclamación está en estado 'pendiente'.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $reclamacion = Reclamacion::findOrFail($id);
        } else {
            $reclamacion = Reclamacion::where('user_id', $user->id)->findOrFail($id);

            // Los clientes solo pueden eliminar reclamaciones pendientes
            if ($reclamacion->estado !== 'pendiente') {
                return response()->json([
                    'message' => 'Solo se pueden eliminar reclamaciones en estado pendiente'
                ], 403);
            }
        }

        $reclamacion->delete();

        return response()->json([
            'message' => 'Reclamación eliminada con éxito'
        ]);
    }
}
