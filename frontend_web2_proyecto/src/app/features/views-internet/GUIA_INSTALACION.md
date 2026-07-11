# Guía de Uso e Instalación - Módulo ISP (Internet Service Provider)

Este módulo ha sido desarrollado siguiendo una arquitectura limpia y aislada dentro de Angular, diseñado específicamente para gestionar servicios de Internet Residencial y Corporativo.

## 🚀 Requisitos Previos

- **Node.js**: Versión 16 o superior.
- **Angular CLI**: Versión 15 o superior.
- **Backend**: El servidor Express debe estar corriendo en `http://localhost:3000` (o el puerto configurado en `environments/environment.ts`).

## 🛠️ Instalación

1. **Clonar el repositorio** (si aún no lo ha hecho).
2. **Navegar a la carpeta del proyecto**:
   ```bash
   cd frontend_web2_proyecto
   ```
3. **Instalar dependencias**:
   ```bash
   npm install
   ```
   *Nota: Se requiere Bootstrap 5 y Bootstrap Icons para la interfaz visual.*

4. **Levantar el servidor de desarrollo**:
   ```bash
   ng serve
   ```
5. **Acceder a la aplicación**: Abra su navegador en `http://localhost:4200`.

## 📂 Estructura del Módulo

El código se encuentra totalmente contenido en:
`src/app/features/views-internet/`

- **models/**: Interfaces estrictas para Planes, Comentarios, Métricas y Usuarios.
- **services/**: `InternetDataService` maneja la comunicación con el Backend (PostgreSQL) e inyecta cabeceras de seguridad.
- **components/**:
  - `IndexMain`: Landing page comercial con planes y formulario de contacto.
  - `DashboardAdmin`: Panel de control total (CRUD de planes, gestión de usuarios, tickets y leads).
  - `DashboardCliente`: Autogestión (Perfil, Facturación con carga de PDF, Speed Test).
  - `GestionComentarios`: Moderación de reseñas.

## 🔑 Credenciales de Prueba (Simuladas en AuthService)

El sistema utiliza un `AuthInterceptor` para enviar el rol y ID de usuario al backend.
- **Admin**: Login con cualquier usuario que el backend identifique como rol 'admin'.
- **Cliente**: Login estándar para usuarios finales.

## 🎨 Paleta de Colores Corporativa

- **Azul Oscuro (#27187E)**: Base ejecutiva y Sidebars.
- **Azul Medio (#758BFD)**: Enlaces y botones secundarios.
- **Naranja (#FF8600)**: CTAs, Precios y alertas críticas.
- **Blanco Grisáceo (#F1F2F6)**: Fondos de sección.

## 📝 Notas de Desarrollo

- Se ha implementado **Tipado Estricto** en todo el módulo para evitar el uso de `any`.
- Los componentes son **Stand-alone** para facilitar su migración o reutilización.
- La comunicación con el backend es real, utilizando `HttpClient` y observadores de RxJS.
