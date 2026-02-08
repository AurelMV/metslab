# 👥 Guía Definitiva de Gestión de Usuarios (Admin API)

Esta guía explica cómo probar y utilizar los endpoints de administración de usuarios.

> 💡 **NOTA IMPORTANTE SOBRE EL CAMBIO RECIENTE:**
> Hemos cambiado la forma de **asignar roles**. Antes usábamos una ruta `PUT /users/{id}/role` que a veces daba error de "No encontrado".
> Ahora usamos una **Acción Directa (POST)** en `/users/assign-role`. Es más segura y evita confusiones al servidor.

---

## 🛠️ 1. Preparación del Entorno (Seeders)

Antes de probar, asegúrate de tener datos falsos cargados. Si no lo has hecho, corre:

```bash
php artisan migrate:fresh --seed
```

Esto crea:
*   **Usuario Admin:** `admin@metslab.com` / `12345678`
*   **Usuario Cliente:** `cliente@metslab.com` / `12345678`
*   **~20 Usuarios Falsos** con direcciones y pedidos.

---

## � 2. Obtener Token de Admin
Todas las rutas de abajo requieren que seas Admin.

1.  **POST** `http://localhost:8000/api/login`
2.  **Body:**
    ```json
    {
        "email": "admin@metslab.com",
        "password": "12345678"
    }
    ```
3.  Copia el `token` de la respuesta.
4.  En todas las siguientes peticiones en Postman, ve a la pestaña **Authorization** -> **Bearer Token** y pégalo.

---

## � 3. Listar Usuarios
Ver la tabla general de usuarios.

*   **Método:** `GET`
*   **URL:** `http://localhost:8000/api/admin/users`
*   **Respuesta:** Una lista paginada de usuarios con sus roles. Puedes ver IDs como 3, 4, 5, etc. **Anota uno de estos IDs** (ej: ID 5) para probar los siguientes pasos.

---

## 🛒 4. Ver Detalle y Pedidos (El "Ojo")
Si quieres ver qué ha comprado un usuario específico.

*   **Método:** `GET`
*   **URL:** `http://localhost:8000/api/admin/users/5` (Reemplaza 5 por un ID real)
*   **Respuesta Esperada:**
    *   Datos del usuario.
    *   `addresses`: Sus direcciones guardadas.
    *   **`orders`**: Lista completa de sus pedidos falsos generados por el Seeder, incluyendo qué productos compró y las fotos.

---

## 👮‍♂️ 5. Asignar Rol (NUEVO MÉTODO)
Aquí está el cambio clave. En lugar de pasar el ID por la URL, se lo enviamos en solido.

*   **Método:** `POST`
*   **URL:** `http://localhost:8000/api/admin/users/assign-role`
*   **Body (JSON):**
    ```json
    {
        "user_id": 5,        // El ID del usuario al que quieres cambiar
        "role": "admin"      // O "client"
    }
    ```
*   **Resultado:** El usuario 5 ahora es Admin. Puedes verificarlo volviendo a llamar al endpoint de "Listar Usuarios".

---

## 🚫 6. Banear / Desbanear (Soft Delete)
Para desactivar una cuenta sin borrar su historial.

*   **Método:** `POST`
*   **URL:** `http://localhost:8000/api/admin/users/5/toggle-status` (Reemplaza 5 por el ID)
*   **Body:** (Vacío)
*   **Resultado:**
    *   1er click: "Usuario desactivado exitosamente".
    *   2do click: "Usuario reactivado exitosamente".

---

### 🧪 Resumen de Pruebas
Si sigues estos pasos en orden:
1.  Login como Admin.
2.  POST `assign-role` al ID 3.
3.  GET `users` -> Verás que el ID 3 ahora dice "Administrador".
4.  POST `toggle-status` al ID 3 -> Devuelve "Desactivado".
5.  GET `users` -> Seguirás viendo al ID 3 (porque los admin ven todo), pero su status internamente ha cambiado.

¡Con esto tienes control total de tus usuarios! 🚀
