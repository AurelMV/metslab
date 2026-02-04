<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            
            // Categorías
            'object_category' => [
                'id' => $this->objectCategory->id ?? null,
                'name' => $this->objectCategory->name ?? null,
            ],
            'style_category' => [
                'id' => $this->styleCategory->id ?? null,
                'name' => $this->styleCategory->name ?? null,
            ],

            // Imágenes del modelo 3D (previews, renders, etc.)
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                        'order' => $image->order,
                    ];
                });
            }),

            // Variaciones (diferentes formatos, licencias, etc.)
            'variations' => $this->whenLoaded('variations', function () {
                return $this->variations->map(function ($variation) {
                    return [
                        'id' => $variation->id,
                        'color' => [
                            'id' => $variation->color->id ?? null,
                            'name' => $variation->color->name ?? null,
                            'hex' => $variation->color->hex ?? null,
                        ],
                        'dimensions' => [
                            'length' => (float) $variation->lenght,
                            'width' => (float) $variation->width,
                            'height' => (float) $variation->height,
                        ],
                        'price' => (float) $variation->price,
                        'stock' => $variation->stock,
                        'status' => $variation->status,
                    ];
                });
            }),

            // Precio mínimo (de todas las variaciones)
            'min_price' => $this->when($this->relationLoaded('variations'), function () {
                return $this->variations->min('price');
            }),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
