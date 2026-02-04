<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Reclamacion extends Model
{
    protected $table = 'reclamaciones';

    protected $fillable = [
        'user_id',
        'order_id',
        'telefono',
        'detalle',
        'estado',
    ];

    /**
     * Estados válidos para una reclamación
     */
    public const ESTADOS = [
        'pendiente',
        'en_proceso',
        'resuelto',
        'rechazado',
    ];

    /**
     * Horas permitidas para edición después de la creación
     */
    public const HORAS_EDICION = 3;

    /**
     * Verifica si la reclamación aún puede ser editada (dentro de 3 horas)
     */
    public function isEditable(): bool
    {
        return $this->created_at->diffInHours(Carbon::now()) < self::HORAS_EDICION;
    }

    /**
     * Obtiene el tiempo restante para editar en minutos
     */
    public function tiempoRestanteEdicion(): int
    {
        $horasTranscurridas = $this->created_at->diffInMinutes(Carbon::now());
        $minutosLimite = self::HORAS_EDICION * 60;
        
        return max(0, $minutosLimite - $horasTranscurridas);
    }

    /**
     * Relación con el usuario
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con el pedido
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
