<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Datos básicos (Solo lo necesario)
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,

            'roles' => $this->roles->pluck('slug'),

            // OPCIONAL: Si el frontend necesita el nombre bonito para mostrar
            'role_names' => $this->roles->pluck('name'),
        ];
    }
}
