# 📘 Metslab API - Guía de Integración Frontend

Esta documentación detalla los endpoints, formatos de datos y flujos necesarios para construir el Panel de Administración de Metslab.

---

## � 1. Autenticación (Login)

El sistema utiliza **Laravel Sanctum**. Todas las peticiones al panel de administración requieren un token.

### **Paso A: Obtener Token**
`POST /api/login`

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "pass"
}
```

**Respuesta:**
Recibirás un `access_token`. **Guárdalo en LocalStorage**.

### **Paso B: Usar Token**
En todas las peticiones a rutas `/api/admin/*`, debes enviar estos Headers:

```http
Authorization: Bearer <TU_ACCESS_TOKEN>
Content-Type: application/json
Accept: application/json
```

---

## 🚀 2. CREACIÓN DE PRODUCTOS (Super Endpoint)

Este es el endpoint más importante. Permite crear el producto, sus imágenes y sus variaciones **en una sola petición**.

`POST /api/admin/products`

### **Payload JSON Completo (Ejemplo Real)**
Copia y pega esto para probar.

```json
{
  "name": "Guerrero Cyberpunk - Edición Elite",
  "description": "Modelo 3D de alta resolución con texturas 4K. Incluye rigging completo y animaciones de combate.",
  "object_category_id": 1, 
  "style_category_id": 2,

  "images": [
    {
      "url": "https://img.freepik.com/premium-photo/cyberpunk-warrior.jpg",
      "order": 1
    },
    {
      "url": "https://cdnb.artstation.com/p/assets/images/cyberpunk-back.jpg",
      "order": 2
    }
  ],

  "variations": [
    {
      "color_id": 1,
      "price": 49.99,
      "stock": 100,
      "lenght": 12.5,
      "width": 6.0,
      "height": 22.0,
      "status": "active"
    },
    {
      "color_id": 2,
      "price": 54.99,
      "stock": 50,
      "lenght": 12.5,
      "width": 6.0,
      "height": 22.0,
      "status": "active"
    }
  ]
}
```

### **Explicación de Campos:**
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `object_category_id` | ID | ID de la categoría (ej: "Personajes"). Ver sección 4. |
| `style_category_id` | ID | ID del estilo (ej: "Realista"). Ver sección 4. |
| `images` | Array | Lista de URLs. El `order` define cuál sale primero. |
| `variations` | Array | Aquí defines precios y stock por color. |
| `variations.*.color_id`| ID | ID del color (ej: "Rojo"). Ver sección 4. |
| `variations.*.lenght` | Decimal | Dimensiones (Largo, Ancho, Alto). |

---

## 🖼️ 3. Gestión de Imágenes (Upload & URLs)

Si necesitas agregar imágenes **después** de crear el producto, o si quieres **subir archivos locales**.

`POST /api/admin/products/{id}/images`

### **Opción A: Subir Archivo (Multipart)**
Usa esto si tienes un `<input type="file">`.

*   **Header:** `Content-Type: multipart/form-data`
*   **Body (FormData):**
    *   `image`: (Archivo binario .jpg, .png)
    *   `order`: 0

### **Opción B: URL Externa (JSON)**
Usa esto si tienes la URL de la imagen.

*   **Header:** `Content-Type: application/json`
*   **Body:**
    ```json
    {
      "url": "https://imgur.com/foto.jpg",
      "order": 0
    }
    ```

### **Reordenar Imágenes**
`POST /api/admin/products/{id}/images/reorder`

```json
{
  "images": [
    { "id": 10, "order": 0 }, // ID de la imagen, no del producto
    { "id": 12, "order": 1 }
  ]
}
```

---

## 🎨 4. Catálogos (Para llenar Selects)

Usa estos endpoints públicos para llenar los dropdowns en tu formulario de creación.

| Recurso | Endpoint (GET) | Ejemplo de Respuesta |
| :--- | :--- | :--- |
| **Categorías Objeto** | `/api/object-categories` | `[{id: 1, name: "Personajes"}, ...]` |
| **Categorías Estilo** | `/api/style-categories` | `[{id: 1, name: "Realista"}, ...]` |
| **Colores** | `/api/colors` | `[{id: 1, name: "Rojo", hex_value: "#FF0000"}, ...]` |

---

## 🛠️ 5. Gestión de Variaciones (Individual)

Si ya creaste el producto y quieres agregar **una nueva variación** (ej: llegó stock en color Verde).

`POST /api/admin/products/{id}/variations`

```json
{
  "color_id": 3,
  "price": 29.99,
  "stock": 100,
  "lenght": 10.5,
  "width": 5.0,
  "height": 20.0,
  "status": "active"
}
```

---

## ⚙️ 6. Gestión del Admin (Crear Colores/Categorías)

Si el admin necesita crear un nuevo Color o Categoría que no existe en los selects.

| Acción | Endpoint (POST) | Body JSON |
| :--- | :--- | :--- |
| **Crear Color** | `/api/admin/colors` | `{"name": "Neon", "hex_value": "#00FF00"}` |
| **Crear Cat. Objeto** | `/api/admin/object-categories` | `{"name": "Naves Espaciales"}` |
| **Crear Cat. Estilo** | `/api/admin/style-categories` | `{"name": "Cyberpunk"}` |

---

## ⚡ Códigos de Respuesta HTTP

*   **200 OK:** Todo salió bien.
*   **201 Created:** Se creó el recurso (producto, imagen, etc.).
*   **401 Unauthorized:** Token inválido. Redirigir a Login.
*   **403 Forbidden:** Usuario logueado pero no es Admin.
*   **422 Unprocessable Content:** **Error de Validación**. Revisa el JSON de respuesta para ver qué campo falló (ej: "El precio es obligatorio").
