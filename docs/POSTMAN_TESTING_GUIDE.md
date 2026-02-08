# 🧪 Guía de Pruebas Paso a Paso (Postman)

Sigue estos pasos en orden para validar cada parte del sistema.

### 📋 Pre-requisitos
*   **Headers:** `Authorization: Bearer <TU_TOKEN>`
*   **Headers:** `Content-Type: application/json`

---

## 🟢 PASO 1: Crear los "Ingredientes" (Catálogos)

Primero necesitamos categorías y colores nuevos para nuestro producto de prueba.

### 1.1 Crear Categoría de Objeto
**POST** `http://localhost:8000/api/admin/object-categories`
```json
{
  "name": "Naves Espaciales"//13
}
```
> **Nota el ID que te devuelve** (Digamos que es ID: `15`)

### 1.2 Crear Categoría de Estilo
**POST** `http://localhost:8000/api/admin/style-categories`
```json
{
  "name": "Super Futurista"//13
}
```
> **Nota el ID que te devuelve** (Digamos que es ID: `15`)

### 1.3 Crear un Color Nuevo
**POST** `http://localhost:8000/api/admin/colors`
```json
{
  "name": "Plata Galáctico",//13
  "hex_value": "#C0C0C0"
}
```
> **Nota el ID que te devuelve** (Digamos que es ID: `15`)

---

## 🟡 PASO 2: Crear el Producto Base (Sin nada)

Vamos a crear solo la "cáscara" del producto.

**POST** `http://localhost:8000/api/admin/products`

*(Usa los IDs que obtuviste en el Paso 1)*
```json
{
  "name": "Nave Exploradora X-99",
  "description": "Nave de exploración intergaláctica con detalles en cromo.",
  "object_category_id": 15, 
  "style_category_id": 15
}
```
> **IMPORTANTE:** Guarda el **ID** del producto creado (Ej: `5`). Lo usaremos en los siguientes pasos.

---

## 🟠 PASO 3: Agregarle Imágenes (Una por una)

Ahora vestiremos el producto `5` con imágenes.

**POST** `http://localhost:8000/api/admin/products/5/images`

```json
{
  "url": "https://example.com/nave-frente.jpg",
  "order": 1
}
```

*Prueba enviar otra imagen:*
```json
{
  "url": "https://example.com/nave-trasera.jpg",
  "order": 2
}
```

---

## 🔴 PASO 4: Agregarle Variaciones (Venta)

Ahora definimos cuánto cuesta y en qué colores viene la nave `5`.

**POST** `http://localhost:8000/api/admin/products/5/variations`

*(Usa el ID del color que creaste en el paso 1.3)*
```json
{
  "color_id": 15,
  "price": 1500.00,
  "stock": 5,
  "lenght": 50.5,
  "width": 20.0,
  "height": 10.0,
  "status": "active"
}
```

✅ **¡Felicidades!** Has construido un producto pieza por pieza. Esto confirma que los endpoints individuales funcionan.

---

## 🟣 PASO 5: La "Prueba Maestra" (Todo junto)

Ahora probamos la potencia del controlador creando OTRO producto totalmente distinto en un solo disparo.

**POST** `http://localhost:8000/api/admin/products`

```json
{
  "name": "Robot de Combate MK-II",
  "description": "Unidad de defensa automatizada.",
  "object_category_id": 15,
  "style_category_id": 15,
  "images": [
    { "url": "https://example.com/robot-1.jpg", "order": 1 },
    { "url": "https://example.com/robot-2.jpg", "order": 2 }
  ],
  "variations": [
    {
      "color_id": 15,
      "price": 2999.99,
      "stock": 10,
      "lenght": 200.0,
      "width": 80.0,
      "height": 90.0
    }
  ]
}
```

Si recibes un `201 Created` aquí, **tu backend es indestructible**. 🚀
