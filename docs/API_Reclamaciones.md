# API Documentation - Reclamaciones (MetsLab Backend)

## Base URL
```
http://localhost:8000/api
```

## Descripción General

El módulo de **Reclamaciones** permite a los usuarios registrar quejas o reclamos asociados a sus pedidos. Este sistema incluye las siguientes características:

- **Creación de reclamaciones** vinculadas a pedidos existentes
- **Edición limitada a 3 horas** después de la creación
- **Estados de seguimiento**: `pendiente`, `en_proceso`, `resuelto`, `rechazado`
- **Permisos diferenciados** para clientes y administradores

---

## Autenticación

Todos los endpoints de reclamaciones requieren autenticación mediante **Bearer Token**.

```
Authorization: Bearer {access_token}
```

---

## Endpoints

### GET `/reclamaciones`

Lista todas las reclamaciones del usuario autenticado.

**Autenticación requerida:** Sí (Bearer Token)

**Permisos:**
- **Cliente:** Ve solo sus propias reclamaciones
- **Admin:** Ve todas las reclamaciones del sistema

**Query Parameters (opcionales):**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `estado` | string | Filtrar por estado (`pendiente`, `en_proceso`, `resuelto`, `rechazado`) |
| `order_id` | integer | Filtrar por ID de pedido |
| `user_id` | integer | Filtrar por ID de usuario (solo admin) |

**Ejemplo Request:**
```
GET /api/reclamaciones?estado=pendiente
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
    "data": [
        {
            "id": 1,
            "user_id": 5,
            "order_id": 12,
            "telefono": "+51 999888777",
            "detalle": "El producto llegó dañado, solicito reembolso o cambio.",
            "estado": "pendiente",
            "is_editable": true,
            "tiempo_restante_minutos": 145,
            "created_at": "2026-02-04T10:30:00.000000Z",
            "updated_at": "2026-02-04T10:30:00.000000Z",
            "order": {
                "id": 12,
                "status": "delivered",
                "total_amount": "150.00",
                "order_type": "shipping",
                "created_at": "2026-02-01T14:00:00.000000Z"
            }
        }
    ]
}
```

---

### POST `/reclamaciones`

Crea una nueva reclamación asociada a un pedido.

**Autenticación requerida:** Sí (Bearer Token)

**Validaciones importantes:**
- El `order_id` debe pertenecer al usuario autenticado
- El `detalle` debe tener entre 10 y 2000 caracteres
- El `telefono` solo acepta números, espacios, `+` y `-`

**Request Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `order_id` | integer | Sí | ID del pedido a reclamar |
| `telefono` | string | Sí | Teléfono de contacto (máx. 20 caracteres) |
| `detalle` | string | Sí | Descripción del reclamo (10-2000 caracteres) |

**Ejemplo Request:**
```json
{
    "order_id": 12,
    "telefono": "+51 999888777",
    "detalle": "El producto llegó dañado, la caja estaba abierta y el artículo tiene rayones visibles."
}
```

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 201 | Reclamación creada exitosamente |
| 403 | El pedido no pertenece al usuario |
| 422 | Error de validación |

**Respuesta Exitosa (201):**
```json
{
    "message": "Reclamación registrada con éxito",
    "reclamacion": {
        "id": 1,
        "user_id": 5,
        "order_id": 12,
        "telefono": "+51 999888777",
        "detalle": "El producto llegó dañado, la caja estaba abierta y el artículo tiene rayones visibles.",
        "estado": "pendiente",
        "is_editable": true,
        "tiempo_restante_minutos": 180,
        "created_at": "2026-02-04T10:30:00.000000Z",
        "updated_at": "2026-02-04T10:30:00.000000Z"
    }
}
```

**Error - Pedido no pertenece al usuario (403):**
```json
{
    "message": "El pedido especificado no existe o no te pertenece"
}
```

**Error de Validación (422):**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "detalle": ["El detalle debe tener al menos 10 caracteres"],
        "telefono": ["El teléfono solo puede contener números, espacios, + y -"]
    }
}
```

---

### GET `/reclamaciones/{id}`

Obtiene los detalles de una reclamación específica.

**Autenticación requerida:** Sí (Bearer Token)

**Permisos:**
- **Cliente:** Solo puede ver sus propias reclamaciones
- **Admin:** Puede ver cualquier reclamación

**Respuesta Exitosa (200):**
```json
{
    "data": {
        "id": 1,
        "user_id": 5,
        "order_id": 12,
        "telefono": "+51 999888777",
        "detalle": "El producto llegó dañado, solicito reembolso o cambio.",
        "estado": "pendiente",
        "is_editable": true,
        "tiempo_restante_minutos": 145,
        "created_at": "2026-02-04T10:30:00.000000Z",
        "updated_at": "2026-02-04T10:30:00.000000Z",
        "user": {
            "id": 5,
            "name": "María García",
            "email": "maria@example.com"
        },
        "order": {
            "id": 12,
            "status": "delivered",
            "total_amount": "150.00",
            "order_type": "shipping",
            "created_at": "2026-02-01T14:00:00.000000Z"
        }
    }
}
```

**Error - No encontrado (404):**
```json
{
    "message": "No query results for model [App\\Models\\Reclamacion] 999"
}
```

---

### PUT `/reclamaciones/{id}`

Actualiza una reclamación existente.

**Autenticación requerida:** Sí (Bearer Token)

**⚠️ Restricción de Tiempo:**
Los **clientes** solo pueden editar sus reclamaciones durante las **primeras 3 horas** después de crearla. Pasado ese tiempo, la edición será bloqueada.

Los **administradores** pueden editar cualquier reclamación sin límite de tiempo.

**Permisos por campo:**
| Campo | Cliente | Admin |
|-------|---------|-------|
| `telefono` | ✅ | ✅ |
| `detalle` | ✅ | ✅ |
| `estado` | ❌ | ✅ |

**Request Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `telefono` | string | No | Nuevo teléfono de contacto |
| `detalle` | string | No | Nueva descripción del reclamo |
| `estado` | string | No | Nuevo estado (solo admin) |

**Ejemplo Request (Cliente):**
```json
{
    "telefono": "+51 999111222",
    "detalle": "Actualizo el reclamo: además del daño, faltaba un accesorio."
}
```

**Ejemplo Request (Admin):**
```json
{
    "estado": "en_proceso"
}
```

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 200 | Reclamación actualizada exitosamente |
| 403 | Período de edición expirado (más de 3 horas) |
| 404 | Reclamación no encontrada |
| 422 | Error de validación |

**Respuesta Exitosa (200):**
```json
{
    "message": "Reclamación actualizada con éxito",
    "reclamacion": {
        "id": 1,
        "user_id": 5,
        "order_id": 12,
        "telefono": "+51 999111222",
        "detalle": "Actualizo el reclamo: además del daño, faltaba un accesorio.",
        "estado": "pendiente",
        "is_editable": true,
        "tiempo_restante_minutos": 120,
        "created_at": "2026-02-04T10:30:00.000000Z",
        "updated_at": "2026-02-04T11:30:00.000000Z"
    }
}
```

**Error - Período de edición expirado (403):**
```json
{
    "message": "El período de edición ha expirado. Las reclamaciones solo pueden editarse dentro de las primeras 3 horas.",
    "tiempo_transcurrido_horas": 5
}
```

---

### DELETE `/reclamaciones/{id}`

Elimina una reclamación.

**Autenticación requerida:** Sí (Bearer Token)

**Restricciones:**
- **Cliente:** Solo puede eliminar reclamaciones en estado `pendiente`
- **Admin:** Puede eliminar cualquier reclamación

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 200 | Reclamación eliminada exitosamente |
| 403 | No se puede eliminar (estado no es pendiente) |
| 404 | Reclamación no encontrada |

**Respuesta Exitosa (200):**
```json
{
    "message": "Reclamación eliminada con éxito"
}
```

**Error - No se puede eliminar (403):**
```json
{
    "message": "Solo se pueden eliminar reclamaciones en estado pendiente"
}
```

---

## Estructura del Objeto Reclamacion

```json
{
    "id": "integer",
    "user_id": "integer",
    "order_id": "integer",
    "telefono": "string",
    "detalle": "string",
    "estado": "string",
    "is_editable": "boolean",
    "tiempo_restante_minutos": "integer",
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)",
    "user": "object (opcional)",
    "order": "object (opcional)"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID único de la reclamación |
| `user_id` | integer | ID del usuario que creó la reclamación |
| `order_id` | integer | ID del pedido reclamado |
| `telefono` | string | Teléfono de contacto |
| `detalle` | string | Descripción detallada del reclamo |
| `estado` | string | Estado actual del reclamo |
| `is_editable` | boolean | `true` si aún está dentro del período de 3 horas |
| `tiempo_restante_minutos` | integer | Minutos restantes para poder editar |
| `created_at` | string | Fecha de creación en formato ISO 8601 |
| `updated_at` | string | Fecha de última modificación |
| `user` | object | Información del usuario (incluido para admins) |
| `order` | object | Información básica del pedido asociado |

---

## Estados de Reclamación

| Estado | Descripción |
|--------|-------------|
| `pendiente` | Reclamación recién creada, esperando revisión |
| `en_proceso` | El equipo está investigando el reclamo |
| `resuelto` | El reclamo fue atendido y resuelto satisfactoriamente |
| `rechazado` | El reclamo fue rechazado (con justificación) |

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Reclamación creada exitosamente |
| 401 | Unauthorized - No autenticado o token inválido |
| 403 | Forbidden - Sin permisos o período de edición expirado |
| 404 | Not Found - Reclamación no encontrada |
| 422 | Unprocessable Entity - Error de validación |

---

## Notas Importantes

1. **Límite de edición de 3 horas:** Los clientes solo pueden modificar sus reclamaciones dentro de las primeras 3 horas desde la creación. Este límite NO aplica a administradores.

2. **Eliminación restringida:** Los clientes solo pueden eliminar reclamaciones que estén en estado `pendiente`. Una vez que la reclamación pasa a otro estado, solo un administrador puede eliminarla.

3. **Verificación de propiedad:** Al crear una reclamación, el sistema verifica automáticamente que el pedido (`order_id`) pertenezca al usuario autenticado.

4. **Campos calculados:** Los campos `is_editable` y `tiempo_restante_minutos` son calculados dinámicamente y ayudan al frontend a mostrar la interfaz apropiada.

5. **Validación de teléfono:** El campo teléfono acepta el formato: números (0-9), espacios, signo más (+) y guiones (-). Ejemplos válidos: `+51 999888777`, `999-888-777`.
