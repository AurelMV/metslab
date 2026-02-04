<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReclamacionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'user_id'                 => $this->user_id,
            'order_id'                => $this->order_id,
            'telefono'                => $this->telefono,
            'detalle'                 => $this->detalle,
            'estado'                  => $this->estado,
            'is_editable'             => $this->isEditable(),
            'tiempo_restante_minutos' => $this->tiempoRestanteEdicion(),
            'created_at'              => $this->created_at->toISOString(),
            'updated_at'              => $this->updated_at->toISOString(),
            
            // Relaciones (cargadas condicionalmente)
            'user'  => new UserResource($this->whenLoaded('user')),
            'order' => $this->whenLoaded('order', function () {
                return [
                    'id'           => $this->order->id,
                    'status'       => $this->order->status,
                    'total_amount' => $this->order->total_amount,
                    'order_type'   => $this->order->order_type,
                    'created_at'   => $this->order->created_at->toISOString(),
                ];
            }),
        ];
    }
}
