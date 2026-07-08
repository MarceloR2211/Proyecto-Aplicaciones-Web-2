# INSTRUCCIONES_SISTEMA - Guía Completa de Configuración y Despliegue

Este documento detalla los pasos exactos para instalar y ejecutar el sistema completo (Frontend y Backend).

---

## 1. Módulo Backend (Node.js + Express)

El servidor gestiona la persistencia de datos, autenticación y lógica de negocio.

### Requisitos Previos:
- Node.js instalado.

### Instalación:
1. Navega a la carpeta del backend:
   ```bash
   cd backend_web2_proyecto
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecución:
1. Inicia el servidor:
   ```bash
   node src/app.js
   ```
   *El servidor correrá en `http://localhost:3000`.*

### Notas Importantes:
- **CORS:** El backend ya tiene habilitado CORS para peticiones desde `http://localhost:4200`. Si usas un puerto diferente, actualiza `src/app.js`.
- **Base de Datos:** Asegúrate de tener configurado el archivo `.env` con las credenciales de tu base de Datos MySQL.

---

## 2. Módulo Frontend (Angular 18+)

Interfaz de usuario moderna integrada con Bootstrap 5.

### Requisitos Previos:
- Node.js (v22.22.3+ recomendado).
- Angular CLI (opcional, se puede usar `npm start`).

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
1. Inicia la aplicación:
   ```bash
   npm start
   ```
   *O alternativamente:*
   ```bash
   ng serve
   ```
2. Accede a la aplicación en `http://localhost:4200`.

---

## 3. Integración y Uso

1. **Página de Inicio:** Accede a `http://localhost:4200/internet-index` para ver la landing page corporativa.
2. **Navegación:** Utiliza el botón "Acceso Portal" para ir al Login.
3. **Flujo de Usuario:**
   - Inicia sesión como Admin para ver `/dashboard-admin` y `/gestion-comentarios`.
   - Inicia sesión como Usuario para ver `/dashboard-cliente`.
4. **Estilos:** La aplicación utiliza Bootstrap 5 y Bootstrap Icons cargados globalmente para garantizar un diseño profesional y responsivo.

---

## 4. Solución de Problemas
- **UI sin Estilos:** Si la interfaz se ve como texto plano, verifica que el archivo `frontend_web2_proyecto/src/styles.scss` incluya los `@import` de Bootstrap.
- **Error de Conexión:** Verifica que el backend esté encendido antes de navegar por los dashboards.
