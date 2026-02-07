# API Documentation - Catálogo (MetsLab Backend)

## Base URL
```
http://localhost:8000/api
```

## Descripción General

El módulo de **Catálogo** proporciona endpoints públicos optimizados para el frontend de la tienda. Permite:

- **Obtener filtros dinámicos** con conteo de productos por categoría, color y rango de precios
- **Listado paginado** con múltiples filtros combinables
- **Búsqueda** por nombre y descripción
- **Productos destacados** para la página principal
- **Filtros rápidos** por color o categoría

> **Nota:** Todos los endpoints del catálogo son **públicos** y no requieren autenticación.

---

## Arquitectura y Tablas Relacionadas

### Diagrama de Relaciones

```
┌─────────────────┐     ┌──────────────────┐
│ ObjectCategory  │     │  StyleCategory   │
│  (Categorías    │     │   (Estilos:      │
│   de objeto:    │     │   Moderno,       │
│   Sillas,       │     │   Clásico, etc.) │
│   Mesas, etc.)  │     │                  │
└────────┬────────┘     └────────┬─────────┘
         │                       │
         │    ┌──────────────────┘
         │    │
         ▼    ▼
    ┌─────────────────┐
    │    Product      │
    │ (Modelo 3D)     │
    │  - id           │
    │  - name         │
    │  - description  │
    │  - object_cat_id│
    │  - style_cat_id │
    └────────┬────────┘
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
┌──────────┐   ┌─────────────┐
│ProductImg│   │  Variation  │
│ - path   │   │  - price    │
│ - order  │   │  - stock    │
└──────────┘   │  - color_id │
               │  - lenght   │
               │  - width    │
               │  - height   │
               └──────┬──────┘
                      │
                      ▼
               ┌─────────────┐
               │    Color    │
               │  - name     │
               │  - hex_value│
               └─────────────┘
```

### Descripción de Tablas

| Tabla | Descripción | Campos Principales |
|-------|-------------|-------------------|
| `products` | Modelos 3D principales | `id`, `name`, `description`, `object_category_id`, `style_category_id` |
| `variations` | Variaciones de cada producto (diferentes colores/tamaños) | `id`, `product_id`, `color_id`, `price`, `stock`, `lenght`, `width`, `height` |
| `product_images` | Imágenes de preview del producto | `id`, `product_id`, `path`, `order` |
| `colors` | Colores disponibles | `id`, `name`, `hex_value` |
| `object_categories` | Categorías por tipo de objeto (Silla, Mesa, Lámpara) | `id`, `name` |
| `style_categories` | Categorías por estilo (Moderno, Clásico, Industrial) | `id`, `name` |

---

## Endpoints

### GET `/catalog/filters`

Obtiene todas las opciones de filtro disponibles para el menú del frontend.

**Autenticación requerida:** No

**Ejemplo Request:**
```
GET /api/catalog/filters
```

**Respuesta Exitosa (200):**
```json
{
    "object_categories": [
        {
            "id": 1,
            "name": "Sillas",
            "product_count": 15
        },
        {
            "id": 2,
            "name": "Mesas",
            "product_count": 8
        }
    ],
    "style_categories": [
        {
            "id": 1,
            "name": "Moderno",
            "product_count": 20
        },
        {
            "id": 2,
            "name": "Clásico",
            "product_count": 12
        }
    ],
    "colors": [
        {
            "id": 1,
            "name": "Negro",
            "hex_value": "#000000",
            "product_count": 10
        },
        {
            "id": 2,
            "name": "Blanco",
            "hex_value": "#FFFFFF",
            "product_count": 8
        }
    ],
    "price_range": {
        "min": 49.99,
        "max": 599.99
    }
}
```

**Uso en Frontend:**
```javascript
// Cargar filtros para el sidebar del catálogo
const response = await fetch('/api/catalog/filters');
const filters = await response.json();

// Renderizar checkboxes de categorías
filters.object_categories.forEach(cat => {
    console.log(`${cat.name} (${cat.product_count})`);
});

// Configurar slider de precios
const priceSlider = {
    min: filters.price_range.min,
    max: filters.price_range.max
};
```

---

### GET `/catalog/products`

Lista productos paginados con múltiples filtros combinables.

**Autenticación requerida:** No

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `object_category_id` | integer | No | Filtrar por categoría de objeto |
| `style_category_id` | integer | No | Filtrar por categoría de estilo |
| `color_id` | integer | No | Filtrar por color (busca en variaciones) |
| `min_price` | float | No | Precio mínimo |
| `max_price` | float | No | Precio máximo |
| `in_stock` | boolean | No | Solo productos con stock disponible |
| `search` | string | No | Búsqueda por nombre o descripción |
| `sort_by` | string | No | Ordenamiento (ver opciones abajo) |
| `per_page` | integer | No | Items por página (default: 12, max: 50) |
| `page` | integer | No | Número de página (default: 1) |

**Opciones de `sort_by`:**

| Valor | Descripción |
|-------|-------------|
| `newest` | Más recientes primero (default) |
| `oldest` | Más antiguos primero |
| `price_asc` | Precio menor a mayor |
| `price_desc` | Precio mayor a menor |
| `name` | Orden alfabético A-Z |
| `name_desc` | Orden alfabético Z-A |

**Ejemplo Request - Filtros Combinados:**
```
GET /api/catalog/products?object_category_id=1&color_id=2&min_price=100&max_price=300&sort_by=price_asc&per_page=12&page=1
```

**Respuesta Exitosa (200):**
```json
{
    "data": [
        {
            "id": 1,
            "name": "Silla Ejecutiva Premium",
            "slug": "silla-ejecutiva-premium",
            "primary_image": {
                "id": 1,
                "url": "/storage/products/silla-premium-1.jpg"
            },
            "price": {
                "min": 149.99,
                "max": 199.99,
                "has_range": true
            },
            "object_category": {
                "id": 1,
                "name": "Sillas"
            },
            "style_category": {
                "id": 1,
                "name": "Moderno"
            },
            "available_colors": [
                {
                    "id": 1,
                    "name": "Negro",
                    "hex_value": "#000000"
                },
                {
                    "id": 2,
                    "name": "Gris",
                    "hex_value": "#808080"
                }
            ],
            "in_stock": true
        }
    ],
    "links": {
        "first": "http://localhost:8000/api/catalog/products?page=1",
        "last": "http://localhost:8000/api/catalog/products?page=5",
        "prev": null,
        "next": "http://localhost:8000/api/catalog/products?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 5,
        "per_page": 12,
        "to": 12,
        "total": 60
    },
    "applied_filters": {
        "object_category_id": "1",
        "style_category_id": null,
        "color_id": "2",
        "min_price": "100",
        "max_price": "300",
        "in_stock": false,
        "search": null,
        "sort_by": "price_asc"
    }
}
```

**Uso en Frontend - Paginación y Filtros:**
```javascript
// Estado de filtros
const filters = {
    object_category_id: 1,
    color_id: 2,
    min_price: 100,
    max_price: 300,
    sort_by: 'price_asc',
    per_page: 12,
    page: 1
};

// Construir URL con parámetros
const params = new URLSearchParams();
Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
        params.append(key, value);
    }
});

const response = await fetch(`/api/catalog/products?${params}`);
const { data, meta, applied_filters } = await response.json();

// Renderizar productos
data.forEach(product => {
    console.log(`${product.name} - Desde $${product.price.min}`);
});

// Renderizar paginación
console.log(`Página ${meta.current_page} de ${meta.last_page}`);
console.log(`Total: ${meta.total} productos`);
```

---

### GET `/catalog/products/{id}`

Obtiene el detalle completo de un producto específico con todas sus variaciones e imágenes.

**Autenticación requerida:** No

**Ejemplo Request:**
```
GET /api/catalog/products/1
```

**Respuesta Exitosa (200):**
```json
{
    "data": {
        "id": 1,
        "name": "Silla Ejecutiva Premium",
        "slug": "silla-ejecutiva-premium",
        "description": "Silla ergonómica de alta calidad con soporte lumbar ajustable y reposabrazos 4D.",
        "primary_image": {
            "id": 1,
            "url": "/storage/products/silla-premium-1.jpg"
        },
        "images": [
            {
                "id": 1,
                "url": "/storage/products/silla-premium-1.jpg",
                "order": 0
            },
            {
                "id": 2,
                "url": "/storage/products/silla-premium-2.jpg",
                "order": 1
            },
            {
                "id": 3,
                "url": "/storage/products/silla-premium-3.jpg",
                "order": 2
            }
        ],
        "price": {
            "min": 149.99,
            "max": 199.99,
            "has_range": true
        },
        "object_category": {
            "id": 1,
            "name": "Sillas"
        },
        "style_category": {
            "id": 1,
            "name": "Moderno"
        },
        "available_colors": [
            {
                "id": 1,
                "name": "Negro",
                "hex_value": "#000000"
            },
            {
                "id": 2,
                "name": "Gris",
                "hex_value": "#808080"
            }
        ],
        "variations": [
            {
                "id": 1,
                "color": {
                    "id": 1,
                    "name": "Negro",
                    "hex_value": "#000000"
                },
                "dimensions": {
                    "length": 65.00,
                    "width": 65.00,
                    "height": 120.00
                },
                "price": 149.99,
                "stock": 25,
                "status": "active"
            },
            {
                "id": 2,
                "color": {
                    "id": 2,
                    "name": "Gris",
                    "hex_value": "#808080"
                },
                "dimensions": {
                    "length": 65.00,
                    "width": 65.00,
                    "height": 120.00
                },
                "price": 199.99,
                "stock": 10,
                "status": "active"
            }
        ],
        "in_stock": true,
        "created_at": "2026-01-15T10:30:00.000000Z",
        "updated_at": "2026-02-01T14:20:00.000000Z"
    }
}
```

**Uso en Frontend - Página de Producto:**
```javascript
const productId = 1;
const response = await fetch(`/api/catalog/products/${productId}`);
const { data: product } = await response.json();

// Mostrar información básica
document.getElementById('title').textContent = product.name;
document.getElementById('description').textContent = product.description;

// Galería de imágenes
product.images.forEach(img => {
    const imgElement = document.createElement('img');
    imgElement.src = img.url;
    gallery.appendChild(imgElement);
});

// Selector de color
product.available_colors.forEach(color => {
    const colorBtn = document.createElement('button');
    colorBtn.style.backgroundColor = color.hex_value;
    colorBtn.title = color.name;
    colorSelector.appendChild(colorBtn);
});

// Al seleccionar un color, mostrar la variación correspondiente
function selectColor(colorId) {
    const variation = product.variations.find(v => v.color.id === colorId);
    document.getElementById('price').textContent = `$${variation.price}`;
    document.getElementById('stock').textContent = `${variation.stock} disponibles`;
}
```

---

### GET `/catalog/by-color/{color_id}`

Productos filtrados por un color específico. Útil para páginas de color dedicadas.

**Autenticación requerida:** No

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `per_page` | integer | No | Items por página (default: 12, max: 50) |
| `page` | integer | No | Número de página |

**Ejemplo Request:**
```
GET /api/catalog/by-color/1?per_page=6
```

**Respuesta Exitosa (200):**
```json
{
    "data": [...productos...],
    "filter": {
        "color": {
            "id": 1,
            "name": "Negro",
            "hex_value": "#000000"
        }
    },
    "meta": {
        "current_page": 1,
        "total": 15
    }
}
```

---

### GET `/catalog/by-category/{category_id}`

Productos filtrados por categoría de objeto. Útil para páginas de categoría dedicadas.

**Autenticación requerida:** No

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `per_page` | integer | No | Items por página (default: 12, max: 50) |
| `page` | integer | No | Número de página |

**Ejemplo Request:**
```
GET /api/catalog/by-category/1?per_page=6
```

**Respuesta Exitosa (200):**
```json
{
    "data": [...productos...],
    "filter": {
        "category": {
            "id": 1,
            "name": "Sillas"
        }
    },
    "meta": {
        "current_page": 1,
        "total": 20
    }
}
```

---

### GET `/catalog/featured`

Obtiene productos destacados (los más recientes con stock disponible). Ideal para la página principal.

**Autenticación requerida:** No

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `limit` | integer | No | Cantidad de productos (default: 8, max: 20) |

**Ejemplo Request:**
```
GET /api/catalog/featured?limit=4
```

**Respuesta Exitosa (200):**
```json
{
    "data": [
        {
            "id": 10,
            "name": "Mesa de Centro Minimalista",
            "slug": "mesa-de-centro-minimalista",
            "primary_image": {
                "id": 15,
                "url": "/storage/products/mesa-centro-1.jpg"
            },
            "price": {
                "min": 299.99,
                "max": 299.99,
                "has_range": false
            },
            "available_colors": [
                {"id": 1, "name": "Negro", "hex_value": "#000000"}
            ],
            "in_stock": true
        }
    ]
}
```

**Uso en Frontend - Homepage:**
```javascript
// Cargar productos destacados para el carrusel de la homepage
const response = await fetch('/api/catalog/featured?limit=8');
const { data: featuredProducts } = await response.json();

featuredProducts.forEach(product => {
    // Renderizar card de producto
    const card = createProductCard(product);
    featuredSection.appendChild(card);
});
```

---

### GET `/catalog/search`

Búsqueda de productos por texto en nombre y descripción.

**Autenticación requerida:** No

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `q` | string | **Sí** | Término de búsqueda (mín. 2, máx. 100 caracteres) |
| `per_page` | integer | No | Items por página (default: 12, max: 50) |
| `page` | integer | No | Número de página |

**Ejemplo Request:**
```
GET /api/catalog/search?q=silla+ejecutiva&per_page=10
```

**Respuesta Exitosa (200):**
```json
{
    "data": [...productos que coinciden...],
    "search_query": "silla ejecutiva",
    "results_count": 5,
    "meta": {
        "current_page": 1,
        "total": 5
    }
}
```

**Error - Término muy corto (422):**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "q": ["El campo q debe tener al menos 2 caracteres."]
    }
}
```

**Uso en Frontend - Barra de Búsqueda:**
```javascript
const searchInput = document.getElementById('search');
let debounceTimeout;

searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    const query = e.target.value.trim();
    
    if (query.length >= 2) {
        debounceTimeout = setTimeout(async () => {
            const response = await fetch(`/api/catalog/search?q=${encodeURIComponent(query)}`);
            const { data, results_count } = await response.json();
            
            // Mostrar resultados
            showSearchResults(data);
            document.getElementById('results-count').textContent = 
                `${results_count} resultados para "${query}"`;
        }, 300); // Debounce de 300ms
    }
});
```

---

## Estructura del Objeto Producto (Lista)

Estructura compacta para listados:

```json
{
    "id": "integer",
    "name": "string",
    "slug": "string",
    "primary_image": {
        "id": "integer",
        "url": "string"
    },
    "price": {
        "min": "float",
        "max": "float",
        "has_range": "boolean"
    },
    "object_category": {
        "id": "integer",
        "name": "string"
    },
    "style_category": {
        "id": "integer",
        "name": "string"
    },
    "available_colors": [
        {
            "id": "integer",
            "name": "string",
            "hex_value": "string"
        }
    ],
    "in_stock": "boolean"
}
```

---

## Estructura del Objeto Producto (Detalle)

Estructura completa para página de producto individual (incluye todo lo anterior más):

```json
{
    "description": "string",
    "images": [
        {
            "id": "integer",
            "url": "string",
            "order": "integer"
        }
    ],
    "variations": [
        {
            "id": "integer",
            "color": {
                "id": "integer",
                "name": "string",
                "hex_value": "string"
            },
            "dimensions": {
                "length": "float",
                "width": "float",
                "height": "float"
            },
            "price": "float",
            "stock": "integer",
            "status": "string"
        }
    ],
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)"
}
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 404 | Not Found - Producto, color o categoría no encontrado |
| 422 | Unprocessable Entity - Error de validación (en búsqueda) |

---

## Guía de Implementación en el Frontend

### 1. Cargar Filtros Iniciales

Al cargar la página del catálogo, primero obtén los filtros disponibles:

```javascript
async function initCatalog() {
    // Cargar filtros
    const filtersResponse = await fetch('/api/catalog/filters');
    const filters = await filtersResponse.json();
    
    // Renderizar sidebar con filtros
    renderCategoryFilters(filters.object_categories);
    renderStyleFilters(filters.style_categories);
    renderColorFilters(filters.colors);
    initPriceSlider(filters.price_range.min, filters.price_range.max);
    
    // Cargar productos iniciales
    loadProducts();
}
```

### 2. Cargar Productos con Filtros

```javascript
const currentFilters = {
    object_category_id: null,
    style_category_id: null,
    color_id: null,
    min_price: null,
    max_price: null,
    in_stock: false,
    sort_by: 'newest',
    per_page: 12,
    page: 1
};

async function loadProducts() {
    const params = new URLSearchParams();
    
    Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== null && value !== false && value !== undefined) {
            params.append(key, value);
        }
    });
    
    const response = await fetch(`/api/catalog/products?${params}`);
    const { data, meta, applied_filters } = await response.json();
    
    renderProducts(data);
    renderPagination(meta);
}

// Al cambiar un filtro
function onFilterChange(filterName, value) {
    currentFilters[filterName] = value;
    currentFilters.page = 1; // Resetear a página 1
    loadProducts();
}

// Al cambiar de página
function onPageChange(page) {
    currentFilters.page = page;
    loadProducts();
}
```

### 3. Implementar Búsqueda con Debounce

```javascript
let searchTimeout;

function onSearchInput(query) {
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        loadProducts(); // Volver a mostrar todos
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        const response = await fetch(
            `/api/catalog/search?q=${encodeURIComponent(query)}&per_page=12`
        );
        const { data, results_count } = await response.json();
        
        renderProducts(data);
        showSearchResultsCount(results_count, query);
    }, 300);
}
```

### 4. Página de Producto Individual

```javascript
async function loadProductDetail(productId) {
    const response = await fetch(`/api/catalog/products/${productId}`);
    const { data: product } = await response.json();
    
    // Renderizar detalles
    renderProductInfo(product);
    renderImageGallery(product.images);
    renderColorSelector(product.available_colors, product.variations);
    
    // Seleccionar primera variación por defecto
    if (product.variations.length > 0) {
        selectVariation(product.variations[0]);
    }
}

function selectVariation(variation) {
    document.getElementById('price').textContent = `$${variation.price.toFixed(2)}`;
    document.getElementById('stock').textContent = 
        variation.stock > 0 ? `${variation.stock} disponibles` : 'Agotado';
    document.getElementById('dimensions').textContent = 
        `${variation.dimensions.length} x ${variation.dimensions.width} x ${variation.dimensions.height} cm`;
}
```

---

## Notas Importantes

1. **Paginación Eficiente:** El máximo de `per_page` es 50 para evitar sobrecarga. Usa paginación para manejar grandes catálogos.

2. **Filtros Combinables:** Todos los filtros se pueden combinar. Por ejemplo: productos de categoría "Sillas" + color "Negro" + precio entre $100-$300.

3. **Conteo de Productos:** Los endpoints `/filters` retornan `product_count` para cada filtro, útil para mostrar "(15)" junto al nombre del filtro.

4. **Solo Productos Válidos:** El filtro `in_stock=true` solo muestra productos con al menos una variación con stock > 0.

5. **Ordenamiento por Precio:** Cuando se ordena por precio, se usa el precio mínimo de las variaciones del producto.

6. **Slug para URLs:** El campo `slug` se genera automáticamente del nombre y es útil para URLs amigables como `/productos/silla-ejecutiva-premium`.

7. **Imagen Principal:** `primary_image` siempre contiene la primera imagen (order = 0) para mostrar en las cards del catálogo.
