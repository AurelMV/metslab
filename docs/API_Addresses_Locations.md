# API Documentation - Direcciones y Ubicaciones

## Base URL
```
http://localhost:8000/api
```

---

# 📍 Direcciones (AddressController)

API para gestión de direcciones de usuario. Cada usuario solo puede ver y modificar sus propias direcciones. Los administradores pueden ver todas las direcciones.

## Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/Http/Controllers/AddressController.php` | Controlador principal |
| `app/Http/Requests/StoreAddressRequest.php` | Validación para crear |
| `app/Http/Requests/UpdateAddressRequest.php` | Validación para actualizar |
| `app/Http/Resources/AddressResource.php` | Formato de respuesta JSON |
| `app/Models/Address.php` | Modelo de datos |

---

## Endpoints de Direcciones

### GET `/addresses`
Lista las direcciones del usuario autenticado. Los administradores ven todas.

**Autenticación requerida:** Sí (Bearer Token)

**Query Parameters (opcionales):**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `district` | string | Filtra por distrito |
| `province` | string | Filtra por provincia |
| `department` | string | Filtra por departamento |
| `search` | string | Busca en nombre, apellido o calle |
| `user_id` | integer | Solo admins: filtra por usuario |

**Ejemplo Request:**
```
GET /api/addresses?district=Miraflores&search=Carlos
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
    "data": [
        {
            "id": 1,
            "user_id": 2,
            "first_name": "Carlos",
            "last_name": "Mendoza",
            "full_name": "Carlos Mendoza",
            "street_name": "Av. Arequipa 1234",
            "department": "Lima",
            "province": "Lima",
            "district": "Miraflores",
            "postal_code": "15047",
            "phone_number": "987654321",
            "latitude": null,
            "longitude": null,
            "created_at": "2026-02-03T15:30:00.000000Z",
            "updated_at": "2026-02-03T15:30:00.000000Z"
        }
    ]
}
```

---

### POST `/addresses`
Crea una nueva dirección para el usuario autenticado.

**Autenticación requerida:** Sí (Bearer Token)

**Request Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `first_name` | string | Sí | Nombre (máx. 100 caracteres) |
| `last_name` | string | Sí | Apellido (máx. 100 caracteres) |
| `street_name` | string | Sí | Dirección de calle (máx. 255 caracteres) |
| `department` | string | No | Departamento |
| `province` | string | Sí | Provincia |
| `district` | string | Sí | Distrito |
| `postal_code` | string | Sí | Código postal |
| `phone_number` | string | Sí | Teléfono de contacto |
| `latitude` | decimal | No | Latitud (-90 a 90) |
| `longitude` | decimal | No | Longitud (-180 a 180) |

**Ejemplo Request:**
```json
{
    "first_name": "Carlos",
    "last_name": "Mendoza",
    "street_name": "Av. Arequipa 1234",
    "department": "Lima",
    "province": "Lima",
    "district": "Miraflores",
    "postal_code": "15047",
    "phone_number": "987654321"
}
```

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 201 | Dirección creada exitosamente |
| 401 | No autenticado |
| 422 | Error de validación |

**Respuesta Exitosa (201):**
```json
{
    "message": "Dirección guardada con éxito",
    "address": {
        "id": 1,
        "user_id": 2,
        "first_name": "Carlos",
        "last_name": "Mendoza",
        "full_name": "Carlos Mendoza",
        ...
    }
}
```

**Error de Validación (422):**
```json
{
    "message": "El nombre es obligatorio (and 3 more errors)",
    "errors": {
        "first_name": ["El nombre es obligatorio"],
        "last_name": ["El apellido es obligatorio"],
        "district": ["El distrito es obligatorio"],
        "phone_number": ["El número de teléfono es obligatorio"]
    }
}
```

---

### GET `/addresses/{id}`
Obtiene una dirección específica.

**Autenticación requerida:** Sí (Bearer Token)

**Permisos:**
- **Cliente:** Solo sus propias direcciones
- **Admin:** Cualquier dirección

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 200 | Dirección encontrada |
| 401 | No autenticado |
| 404 | Dirección no encontrada o no pertenece al usuario |

---

### PUT `/addresses/{id}`
Actualiza una dirección existente.

**Autenticación requerida:** Sí (Bearer Token)

**Permisos:**
- **Cliente:** Solo sus propias direcciones
- **Admin:** Cualquier dirección

**Request Body:** Todos los campos son opcionales (actualización parcial)

**Ejemplo Request:**
```json
{
    "street_name": "Av. Larco 890",
    "phone_number": "999888777"
}
```

**Respuesta Exitosa (200):**
```json
{
    "message": "Dirección actualizada con éxito",
    "address": { ... }
}
```

---

### DELETE `/addresses/{id}`
Elimina una dirección (soft delete).

**Autenticación requerida:** Sí (Bearer Token)

**Respuesta Exitosa (200):**
```json
{
    "message": "Dirección eliminada con éxito"
}
```

---

# 🇵🇪 Ubicaciones de Perú (LocationController)

API pública que sirve todos los departamentos, provincias y distritos de Perú para autocompletar formularios.

## Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/Http/Controllers/LocationController.php` | Controlador |
| `storage/app/peru_locations.json` | Datos de ubicaciones (25 departamentos) |

---

## Endpoints de Ubicaciones

> **Nota:** Estos endpoints son **públicos** y NO requieren autenticación.

### GET `/locations`
Retorna el árbol completo de ubicaciones.

**Autenticación requerida:** No

**Respuesta:**
```json
{
    "pais": "Perú",
    "total_departamentos": 25,
    "datos": [
        {
            "departamento": "Amazonas",
            "provincias": [
                {
                    "nombre": "Chachapoyas",
                    "distritos": ["Chachapoyas", "Asunción", ...]
                }
            ]
        },
        ...
    ]
}
```

---

### GET `/locations/departments`
Lista todos los departamentos de Perú.

**Autenticación requerida:** No

**Respuesta Exitosa (200):**
```json
{
    "total": 25,
    "departamentos": [
        "Amazonas",
        "Áncash",
        "Apurímac",
        "Arequipa",
        "Ayacucho",
        "Cajamarca",
        "Callao",
        "Cusco",
        "Huancavelica",
        "Huánuco",
        "Ica",
        "Junín",
        "La Libertad",
        "Lambayeque",
        "Lima",
        "Loreto",
        "Madre de Dios",
        "Moquegua",
        "Pasco",
        "Piura",
        "Puno",
        "San Martín",
        "Tacna",
        "Tumbes",
        "Ucayali"
    ]
}
```

---

### GET `/locations/departments/{department}/provinces`
Lista las provincias de un departamento.

**Autenticación requerida:** No

**Parámetro de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `department` | string | Nombre del departamento (exacto, con tildes) |

**Ejemplo Request:**
```
GET /api/locations/departments/Lima/provinces
```

**Respuesta Exitosa (200):**
```json
{
    "departamento": "Lima",
    "total": 10,
    "provincias": [
        "Lima",
        "Barranca",
        "Cajatambo",
        "Canta",
        "Cañete",
        "Huaral",
        "Huarochirí",
        "Huaura",
        "Oyón",
        "Yauyos"
    ]
}
```

**Departamento no encontrado (404):**
```json
{
    "message": "Departamento no encontrado",
    "departamento": "NoExiste"
}
```

---

### GET `/locations/departments/{department}/provinces/{province}/districts`
Lista los distritos de una provincia.

**Autenticación requerida:** No

**Parámetros de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `department` | string | Nombre del departamento |
| `province` | string | Nombre de la provincia |

**Ejemplo Request:**
```
GET /api/locations/departments/Lima/provinces/Lima/districts
```

**Respuesta Exitosa (200):**
```json
{
    "departamento": "Lima",
    "provincia": "Lima",
    "total": 43,
    "distritos": [
        "Lima",
        "Ancón",
        "Ate",
        "Barranco",
        "Breña",
        "Carabayllo",
        ...
    ]
}
```

---

## Flujo de Uso en Frontend

Para un formulario de dirección con selects dependientes:

```
1. Al cargar: GET /api/locations/departments
   → Poblar el select de departamentos

2. Al seleccionar departamento: GET /api/locations/departments/{dept}/provinces
   → Poblar el select de provincias

3. Al seleccionar provincia: GET /api/locations/departments/{dept}/provinces/{prov}/districts
   → Poblar el select de distritos
```

---

## Estructura del Objeto Address

```json
{
    "id": "integer",
    "user_id": "integer",
    "first_name": "string",
    "last_name": "string",
    "full_name": "string (calculado)",
    "street_name": "string",
    "department": "string|null",
    "province": "string",
    "district": "string",
    "postal_code": "string",
    "phone_number": "string",
    "latitude": "decimal|null",
    "longitude": "decimal|null",
    "created_at": "ISO 8601 datetime",
    "updated_at": "ISO 8601 datetime"
}
```

---

## Notas Importantes

- El campo `user_id` se asigna automáticamente del token al crear direcciones
- Los administradores pueden ver y filtrar por `user_id` usando query params
- Las direcciones eliminadas usan soft delete (no se borran de la base de datos)
- Los nombres de departamentos deben coincidir exactamente (incluyendo tildes)
- El endpoint `/locations` es público para facilitar el autocompletado en formularios
