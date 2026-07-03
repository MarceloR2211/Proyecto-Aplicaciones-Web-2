
```
backend_web2_proyecto
├─ package-lock.json
├─ package.json
└─ src
   ├─ app.js
   ├─ config
   │  ├─ .env
   │  └─ db.js
   ├─ controllers
   │  ├─ auth.controller.js
   │  ├─ comentarios.controller.js
   │  ├─ consultas.controller.js
   │  ├─ dashboard.controller.js
   │  ├─ facturacion.controller.js
   │  ├─ planes.controller.js
   │  ├─ ticket.controller.js
   │  ├─ upload.controller.js
   │  └─ usuarios.controller.js
   ├─ cron
   │  └─ billingCron.js
   ├─ middlewares
   │  ├─ auth.middleware.js
   │  └─ role.middleware.js
   ├─ models
   │  ├─ auth.models.js
   │  ├─ comentario.model.js
   │  ├─ consultas.model.js
   │  ├─ dashboard.model.js
   │  ├─ facturacion.model.js
   │  ├─ planes.model.js
   │  ├─ ticket.model.js
   │  └─ usuarios.model.js
   ├─ routes
   │  ├─ auth.routes.js
   │  ├─ comentarios.routes.js
   │  ├─ consultas.routes.js
   │  ├─ dashboard.routes.js
   │  ├─ facturacion.routes.js
   │  ├─ planes.routes.js
   │  ├─ ticket.routes.js
   │  ├─ upload.routes.js
   │  └─ usuarios.routes.js
   └─ utils
      └─ bcrypt.js

```
# Documentación del Enrutamiento de la API

Este documento contiene la estructura y centralización definitiva de las rutas del servidor Express (`app.js`), detallando los prefijos globales correspondientes, los métodos HTTP admitidos, el nivel de acceso (público o privado) y los roles autorizados.

---

## 1. Mapeo de Rutas por Módulo

### Autenticación (`/api/auth`)
*Gestiona el control de acceso de los usuarios al sistema.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Público | Iniciar sesión en el sistema (Genera JWT). |
| **POST** | `/api/auth/change-password` | `authMiddleware` | Cambiar la contraseña del usuario en sesión. |
| **POST** | `/api/auth/logout` | `authMiddleware` | Cerrar la sesión actual e invalidar el token. |

### Usuarios y Clientes (`/api/usuarios`)
*Módulo unificado que centraliza el CRUD y perfiles tanto de administradores como de clientes.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/usuarios` | Público / Libre | Registro de nuevos usuarios o creación manual. |
| **GET** | `/api/usuarios` | `authMiddleware`, `roleMiddleware(['admin'])` | Listar todos los usuarios con sus contratos. |
| **GET** | `/api/usuarios/rol/:rol` | `authMiddleware`, `roleMiddleware(['admin'])` | Filtrar y listar usuarios según su rol. |
| **GET** | `/api/usuarios/:id` | `authMiddleware` | Obtener el perfil específico de un usuario por ID. |
| **PUT** | `/api/usuarios/:id` | `authMiddleware`, `roleMiddleware(['admin'])` | Actualizar datos personales y contractuales de un usuario. |
| **DELETE** | `/api/usuarios/:id` | `authMiddleware`, `roleMiddleware(['admin'])` | Eliminar permanentemente un usuario de la base de datos. |
| **GET** | `/api/usuarios/:id/contratos` | `authMiddleware` | Consultar los contratos asociados a un usuario específico. |

### Dashboard (`/api`)
*Métricas e información estadística consolidada según el rol del usuario.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin` | `authMiddleware`, `roleMiddleware(['admin'])` | Panel de métricas e ingresos para administradores. |
| **GET** | `/api/client` | `authMiddleware`, `roleMiddleware(['usuario'])` | Panel de control del cliente (estado, facturas, tickets). |

### Consultas y Contacto (`/api`)
*Bandeja de entrada para el formulario de contacto de la Landing Page.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/` | Público | Enviar una nueva consulta desde el formulario web. |
| **GET** | `/api/` | `authMiddleware`, `roleMiddleware(['admin'])` | Listar todas las consultas recibidas (Bandeja administrativa). |
| **PUT** | `/api/:id` | `authMiddleware`, `roleMiddleware(['admin'])` | Actualizar el estado de una consulta (pendiente/revisada). |

### Catálogo de Planes (`/api/planes`)
*Administración de los planes de internet ofertados.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/planes` | Público | Listar todos los planes de internet activos del catálogo. |
| **GET** | `/api/planes/:id` | Público | Obtener los detalles de un plan específico por ID. |
| **POST** | `/api/planes` | `authMiddleware`, `roleMiddleware(['admin'])` | Crear un nuevo plan de internet. |
| **PUT** | `/api/planes/:id` | `authMiddleware`, `roleMiddleware(['admin'])` | Modificar los datos o el precio de un plan existente. |
| **DELETE** | `/api/planes/:id` | `authMiddleware`, `roleMiddleware(['admin'])` | Remover un plan del catálogo. |

### Reseñas y Comentarios (`/api/comentarios`)
*Sección de testimonios y feedback de la plataforma.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/comentarios` | Público | Obtener todos los comentarios aprobados para la Landing Page. |
| **GET** | `/api/comentarios/:id` | Público | Obtener un comentario específico por su ID. |
| **POST** | `/api/comentarios` | `authMiddleware`, `roleMiddleware(['usuario'])` | Registrar un nuevo comentario (Entra como pendiente). |
| **PUT** | `/api/comentarios/:id` | `authMiddleware`, `roleMiddleware(['admin'])` | Moderar o editar un comentario (Aprobar/Rechazar). |
| **DELETE** | `/api/comentarios/:id` | `authMiddleware`, `roleMiddleware(['admin'])` | Eliminar permanentemente un comentario. |

### Soporte Técnico - Tickets (`/api/tickets`)
*Sistema interactivo para el reporte e incidencias de los clientes.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/tickets` | `authMiddleware`, `roleMiddleware(['usuario'])` | Crear un nuevo ticket de soporte. |
| **GET** | `/api/tickets/cliente/mis-tickets`| `authMiddleware`, `roleMiddleware(['usuario'])` | Listar el historial de tickets del cliente autenticado. |
| **GET** | `/api/tickets/admin/todos` | `authMiddleware`, `roleMiddleware(['admin'])` | Listar la cola global de tickets de soporte. |
| **GET** | `/api/tickets/:ticketId` | `authMiddleware`, `roleMiddleware(['admin', 'usuario'])` | Ver el detalle de un ticket específico. |
| **PUT** | `/api/tickets/:ticketId/estado`| `authMiddleware`, `roleMiddleware(['admin'])` | Actualizar el estado del ticket (abierto, en proceso, cerrado). |
| **DELETE** | `/api/tickets/:ticketId` | `authMiddleware`, `roleMiddleware(['admin'])` | Eliminar de forma permanente un ticket. |
| **POST** | `/api/tickets/:ticketId/mensajes`| `authMiddleware`, `roleMiddleware(['admin', 'usuario'])` | Enviar una respuesta o mensaje dentro del chat del ticket. |
| **GET** | `/api/tickets/:ticketId/mensajes`| `authMiddleware`, `roleMiddleware(['admin', 'usuario'])` | Listar toda la conversación interna de un ticket. |

### Facturación y Finanzas (`/api/facturas`)
*Módulo financiero para el control de cobros, recibos y reportes.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/facturas/admin/todas` | `authMiddleware`, `roleMiddleware(['admin'])` | Listar el registro histórico de facturas del sistema. |
| **GET** | `/api/facturas/cliente/mis-facturas`| `authMiddleware`, `roleMiddleware(['usuario'])` | Listar los recibos emitidos al cliente autenticado. |
| **GET** | `/api/facturas/:facturaId` | `authMiddleware`, `roleMiddleware(['admin', 'usuario'])` | Obtener el detalle de una factura por ID. |
| **PUT** | `/api/facturas/:facturaId` | `authMiddleware`, `roleMiddleware(['admin'])` | Actualizar estado de pago y adjuntar comprobante administrativo. |

### Carga de Archivos (`/api/upload`)
*Almacenamiento de archivos multimedia y documentos en el servidor.*

| Método | Endpoint | Middleware / Seguridad | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/upload/comprobante` | `authMiddleware` | Subir archivo PDF o imagen del voucher de pago de un cliente. |

---

## 2. Resumen Métrico de los Endpoints

La siguiente tabla detalla la cantidad exacta de endpoints implementados en el backend distribuidos por su respectivo verbo HTTP:

| Método HTTP | Cantidad de Rutas |
| :--- | :---: |
| **GET** | 18 |
| **POST** | 9 |
| **PUT** | 7 |
| **DELETE** | 4 |
| **TOTAL API** | **38** |

