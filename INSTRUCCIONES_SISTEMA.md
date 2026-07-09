# INSTRUCCIONES_SISTEMA - Guía Completa de Configuración y Despliegue

Este documento detalla los pasos para instalar y ejecutar el ecosistema completo (Frontend Angular y Backend Node.js) con persistencia en Base de Datos Real.

---

## 1. Módulo Backend (Node.js + PostgreSQL)

### Requisitos Previos:
- Node.js instalado.
- Base de datos PostgreSQL configurada.

### Instalación y Ejecución:
1. Navega a `backend_web2_proyecto`.
2. Ejecuta `npm install`.
3. Inicia con `node src/app.js`.

---

## 2. Módulo Frontend (Angular 18+)

### Navegación Dinámica y Roles:
El sistema utiliza un **Navbar Inteligente** que detecta el estado de sesión:
- **Público:** Muestra enlaces de navegación general y el botón **"INICIAR SESIÓN"**.
- **Autenticado:** El botón cambia a **"MI CUENTA"**. Al hacer clic, el sistema redirige automáticamente según el rol guardado en LocalStorage (vía `AuthService`):
  - Si el rol es `admin`, redirige a `/dashboard-admin`.
  - Si el rol es `usuario`, redirige a `/dashboard-cliente`.

### Pasos de Instalación:
1. Navega a `frontend_web2_proyecto`.
2. Ejecuta `npm install`.
3. Inicia con `npm start`.

---

## 3. Guía de Uso del Módulo ISP

- **Index:** Landing page con planes dinámicos y formulario de consulta.
- **Dashboard Cliente:** Vista de perfil única. Permite ver servicios activos, facturas y solicitar cambio de contraseña.
- **Dashboard Admin:** Panel de Control Total. Incluye pestañas para:
  - **Planes:** CRUD completo (Crear, Editar, Eliminar).
  - **Usuarios:** Gestión de cuentas y roles.
  - **Comentarios:** Moderación en tiempo real.
- **Seguridad:** Los componentes utilizan el operador de navegación segura `?` para garantizar estabilidad durante la carga asíncrona de datos.

---

## 4. Notas Técnicas
- **Autenticación:** Se emula y persiste el estado en LocalStorage mediante `AuthService`.
- **Inyección de Dependencias:** `provideHttpClient()` está configurado en `app.config.ts` para habilitar todas las peticiones a la API.
- **Tipado:** Código 100% TypeScript Strict verificado con TSC.
