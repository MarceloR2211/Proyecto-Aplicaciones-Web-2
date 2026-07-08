# Guía de Uso e Instalación - Módulo Internet Pro

Este módulo contiene 4 vistas específicas para un proveedor de Servicios de Internet Corporativo y Residencial, desarrolladas como componentes independientes en Angular.

## Estructura del Módulo
El código se encuentra en: `src/app/features/views-internet/`

- **Modelos:** Definiciones de interfaces estrictas para Comentarios y Métricas.
- **Servicio:** `InternetDataService` que simula la lógica de backend con RxJS.
- **Componentes:**
  1. `IndexMainComponent`: Pantalla de inicio con planes comerciales.
  2. `DashboardAdminComponent`: Panel de control operativo para administradores.
  3. `DashboardClienteComponent`: Área de autoservicio para clientes.
  4. `GestionComentariosComponent`: Sistema de moderación de reseñas.

## Tecnologías y Estilos
- **Angular:** Componentes Standalone.
- **Bootstrap 5:** Maquetación responsiva.
- **CSS Variables:** Paleta corporativa aislada localmente.
  - Primario: `#27187E`
  - Secundario: `#758BFD`
  - Acento: `#AEB8FE`
  - Fondo: `#F1F2F6`
  - CTA (Naranja): `#FF8600`

## Instalación y Ejecución

### Requisitos Previos
- Node.js (versión compatible con Angular 18+)
- Angular CLI

### Pasos para correr el servidor
1. Navega a la carpeta del proyecto:
   ```bash
   cd frontend_web2_proyecto
   ```
2. Instala las dependencias (si es la primera vez):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```
4. Abre tu navegador en `http://localhost:4200`

## Cómo integrar las vistas
Debido a las restricciones de no modificar archivos globales, para visualizar estos componentes debes importarlos en tus rutas principales (`app.routes.ts`) de la siguiente manera:

```typescript
// Ejemplo de integración en app.routes.ts
{
  path: 'internet-index',
  loadComponent: () => import('./features/views-internet/components/index-main/index-main').then(m => m.IndexMainComponent)
},
{
  path: 'admin-internet',
  loadComponent: () => import('./features/views-internet/components/dashboard-admin/dashboard-admin').then(m => m.DashboardAdminComponent)
},
// ... y así sucesivamente para el resto de componentes.
```

## Notas Adicionales
- Se han utilizado iconos de **Bootstrap Icons**. Asegúrate de tenerlos disponibles en tu proyecto o incluirlos vía CDN en el `index.html`.
- Toda la lógica de datos es simulada, no requiere un backend real activo para funcionar visualmente.
