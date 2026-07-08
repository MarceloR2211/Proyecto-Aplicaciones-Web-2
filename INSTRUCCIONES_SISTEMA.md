# INSTRUCCIONES_SISTEMA - Guía Completa de Configuración y Despliegue

Este documento detalla los pasos para instalar y ejecutar el ecosistema completo (Frontend Angular y Backend Node.js) con persistencia en Base de Datos Real.

---

## 1. Módulo Backend (Node.js + PostgreSQL)

### Requisitos Previos:
- Node.js instalado.
- Base de datos PostgreSQL configurada con las tablas: `usuarios`, `planes`, `contratos`, `facturas`, `tickets`, `consultas` y `comentarios_publicos`.

### Instalación:
1. Navega a la carpeta del backend:
   ```bash
   cd backend_web2_proyecto
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

### Configuración de Conectividad:
Asegúrate de que tu archivo `.env` en `backend_web2_proyecto/` tenga las credenciales correctas:
```env
DB_USER=tu_usuario
DB_HOST=localhost
DB_NAME=nombre_bd
DB_PASSWORD=tu_password
DB_PORT=5432
PORT=3000
```

### Ejecución:
1. Inicia el servidor de API:
   ```bash
   node src/app.js
   ```

---

## 2. Módulo Frontend (Angular 18+)

### Instalación:
1. Navega a la carpeta del frontend:
   ```bash
   cd frontend_web2_proyecto
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecución:
1. Inicia la aplicación en modo desarrollo:
   ```bash
   npm start
   ```
2. Accede a `http://localhost:4200/internet-index` para ver la landing page integrada.

---

## 3. Guía de Uso del Módulo ISP

- **Página de Inicio (Index):** Muestra ofertas reales de la tabla `planes`. El formulario de contacto inserta registros en la tabla `consultas`.
- **Dashboard Cliente:** Requiere login. Realiza un JOIN entre `usuarios` y `contratos` para mostrar el plan activo, además de consultar las tablas `facturas` y `tickets`.
- **Dashboard Admin:** Calcula métricas de agregación real (COUNT/SUM) de las tablas del sistema.
- **Moderación:** Permite aprobar o rechazar comentarios, actualizando directamente la columna `estado` en la tabla `comentarios_publicos`.

---

## 4. Notas Técnicas
- **Estilos:** Se utiliza la tipografía 'Segoe UI' globalmente. Bootstrap 5 y Bootstrap Icons se cargan vía CDN para garantizar consistencia.
- **Navegación:** Se utiliza un **Navbar Institucional** y un **Footer** compartidos en todas las vistas del módulo mediante `RouterModule` y `[routerLink]`.
- **Conectividad:** `provideHttpClient()` está configurado en `app.config.ts`.
