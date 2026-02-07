<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CatalogProductResource extends JsonResource
{
    /**
     * Whether to show full details (for single product view)
     */
    protected bool $fullDetails;

    /**
     * Create a new resource instance.
     *
     * @param mixed $resource
     * @param bool $fullDetails
     */
    public function __construct($resource, bool $fullDetails = false)
    {
        parent::__construct($resource);
        $this->fullDetails = $fullDetails;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->generateSlug(),
            
            // Primary image for catalog listing
            'primary_image' => $this->getPrimaryImage(),
            
            // Price info
            'price' => $this->getPriceInfo(),
            
            // Categories (compact)
            'object_category' => $this->whenLoaded('objectCategory', fn() => [
                'id' => $this->objectCategory->id,
                'name' => $this->objectCategory->name,
            ]),
            'style_category' => $this->whenLoaded('styleCategory', fn() => [
                'id' => $this->styleCategory->id,
                'name' => $this->styleCategory->name,
            ]),

            // Available colors (compact list)
            'available_colors' => $this->getAvailableColors(),

            // Stock status
            'in_stock' => $this->hasStock(),
        ];

        // Add full details for single product view
        if ($this->fullDetails) {
            $data = array_merge($data, [
                'description' => $this->description,
                
                // All images
                'images' => $this->whenLoaded('images', fn() => 
                    $this->images->map(fn($img) => [
                        'id' => $img->id,
                        'url' => $img->path,
                        'order' => $img->order,
                    ])
                ),
                
                // Full variations with all details
                'variations' => $this->whenLoaded('variations', fn() => 
                    $this->variations->map(fn($v) => [
                        'id' => $v->id,
                        'color' => [
                            'id' => $v->color->id ?? null,
                            'name' => $v->color->name ?? null,
                            'hex_value' => $v->color->hex_value ?? null,
                        ],
                        'dimensions' => [
                            'length' => (float) $v->lenght,
                            'width' => (float) $v->width,
                            'height' => (float) $v->height,
                        ],
                        'price' => (float) $v->price,
                        'stock' => (int) $v->stock,
                        'status' => $v->status,
                    ])
                ),

                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ]);
        }

        return $data;
    }

    /**
     * Generate a URL-friendly slug from the product name.
     */
    private function generateSlug(): string
    {
        return strtolower(str_replace(' ', '-', $this->name));
    }

    /**
     * Get the primary image (first ordered image).
     */
    private function getPrimaryImage(): ?array
    {
        if (!$this->relationLoaded('images') || $this->images->isEmpty()) {
            return null;
        }

        $primaryImage = $this->images->first();
        return [
            'id' => $primaryImage->id,
            'url' => $primaryImage->path,
        ];
    }

    /**
     * Get price information from variations.
     */
    private function getPriceInfo(): array
    {
        if (!$this->relationLoaded('variations') || $this->variations->isEmpty()) {
            return [
                'min' => null,
                'max' => null,
                'has_range' => false,
            ];
        }

        $prices = $this->variations->pluck('price')->filter();
        $min = $prices->min();
        $max = $prices->max();

        return [
            'min' => (float) $min,
            'max' => (float) $max,
            'has_range' => $min !== $max,
        ];
    }

    /**
     * Get list of available colors.
     */
    private function getAvailableColors(): array
    {
        if (!$this->relationLoaded('variations')) {
            return [];
        }

        return $this->variations
            ->filter(fn($v) => $v->color !== null)
            ->unique('color_id')
            ->map(fn($v) => [
                'id' => $v->color->id,
                'name' => $v->color->name,
                'hex_value' => $v->color->hex_value,
            ])
            ->values()
            ->toArray();
    }

    /**
     * Check if product has any stock available.
     */
    private function hasStock(): bool
    {
        if (!$this->relationLoaded('variations')) {
            return false;
        }

        return $this->variations->sum('stock') > 0;
    }
}
