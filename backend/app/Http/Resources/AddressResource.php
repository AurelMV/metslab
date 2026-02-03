<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'user_id'      => $this->user_id,
            'first_name'   => $this->first_name,
            'last_name'    => $this->last_name,
            'full_name'    => $this->first_name . ' ' . $this->last_name,
            'street_name'  => $this->street_name,
            'department'   => $this->department,
            'province'     => $this->province,
            'district'     => $this->district,
            'postal_code'  => $this->postal_code,
            'phone_number' => $this->phone_number,
            'latitude'     => $this->latitude,
            'longitude'    => $this->longitude,
            'created_at'   => $this->created_at?->toISOString(),
            'updated_at'   => $this->updated_at?->toISOString(),
        ];
    }
}
