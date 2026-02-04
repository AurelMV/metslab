# API Documentation - MetsLab Backend

## Base URL
```
    http://localhost:8000/api
```

## Autenticación

La API utiliza **Laravel Sanctum** para autenticación mediante tokens Bearer.

Para endpoints protegidos, incluir el header:
```
Authorization: Bearer {access_token}
```

---

## Endpoints

### Autenticación

#### POST `/register`
Registra un nuevo usuario en el sistema.

**Autenticación requerida:** No

**Request Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Sí | Nombre del usuario (máx. 255 caracteres) |
| `email` | string | Sí | Email único del usuario (máx. 255 caracteres) |
| `password` | string | Sí | Contraseña del usuario |
| `password_confirmation` | string | Sí | Confirmación de la contraseña |

**Ejemplo Request:**
```json
{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!"
}
```

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 201 | Usuario registrado exitosamente |
| 422 | Error de validación |

**Respuesta Exitosa (201):**
```json
{
    "message": "Usuario registrado exitosamente",
    "access_token": "1|abc123xyz...",
    "token_type": "Bearer",
    "user": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "roles": ["client"],
        "role_names": ["Cliente"]
    }
}
```

**Error de Validación (422):**
```json
{
    "message": "The email has already been taken.",
    "errors": {
        "email": ["The email has already been taken."]
    }
}
```

---

#### POST `/login`
Inicia sesión y obtiene un token de acceso.

**Autenticación requerida:** No

**Request Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | string | Sí | Email del usuario |
| `password` | string | Sí | Contraseña del usuario |
| `device_name` | string | No | Nombre del dispositivo (por defecto: "web") |

**Ejemplo Request:**
```json
{
    "email": "juan@example.com",
    "password": "SecurePass123!",
    "device_name": "mobile-app"
}
```

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 200 | Login exitoso |
| 401 | Credenciales inválidas |
| 422 | Error de validación |

**Respuesta Exitosa (200):**
```json
{
    "message": "Bienvenido Juan Pérez",
    "access_token": "2|xyz789abc...",
    "token_type": "Bearer",
    "user": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "roles": ["client"],
        "role_names": ["Cliente"]
    }
}
```

**Credenciales Inválidas (401):**
```json
{
    "message": "Credenciales inválidas"
}
```

---

#### POST `/logout`
Cierra la sesión actual revocando el token usado.

**Autenticación requerida:** Sí (Bearer Token)

**Request Body:** Ninguno

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 200 | Sesión cerrada exitosamente |
| 401 | No autenticado |

**Respuesta Exitosa (200):**
```json
{
    "message": "Sesión cerrada exitosamente"
}
```

**No Autenticado (401):**
```json
{
    "message": "Unauthenticated."
}
```

---

#### GET `/me`
Obtiene la información del usuario autenticado.

**Autenticación requerida:** Sí (Bearer Token)

**Request Body:** Ninguno

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuestas:**

| Código | Descripción |
|--------|-------------|
| 200 | Datos del usuario |
| 401 | No autenticado |

**Respuesta Exitosa (200):**
```json
{
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "roles": ["client"],
    "role_names": ["Cliente"]
}
```

---

## Estructura del Objeto User

```json
{
    "id": "integer",
    "name": "string",
    "email": "string",
    "roles": ["string"],
    "role_names": ["string"]
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID único del usuario |
| `name` | string | Nombre del usuario |
| `email` | string | Email del usuario |
| `roles` | array | Array de slugs de roles (ej: ["client", "admin"]) |
| `role_names` | array | Array de nombres de roles (ej: ["Cliente", "Administrador"]) |

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 401 | Unauthorized - No autenticado o token inválido |
| 403 | Forbidden - Sin permisos para acceder al recurso |
| 404 | Not Found - Recurso no encontrado |
| 422 | Unprocessable Entity - Error de validación |
| 500 | Internal Server Error - Error del servidor |

---

## Notas

- Todos los endpoints devuelven respuestas en formato JSON
- Las fechas se devuelven en formato ISO 8601
- Los tokens no tienen expiración por defecto (configuración de Sanctum)
- Al registrarse, el usuario recibe automáticamente el rol `client`
