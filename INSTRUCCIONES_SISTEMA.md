# INSTRUCCIONES_SISTEMA - Guía Completa de Configuración y Despliegue

Sigue estos pasos para instalar y ejecutar tanto el backend como el frontend del sistema de Internet Pro.

---

## 1. Configuración del Módulo Backend (Node.js + Express)

El servidor maneja la API, autenticación y la lógica de negocio.

### Pasos de Instalación:
1. Abre una terminal y navega al directorio del backend:
   ```bash
   cd backend_web2_proyecto
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
   *Nota: Se instalarán automáticamente dependencias clave como `cors`, `dotenv`, `express`, `jsonwebtoken`, `mysql2` y `bcryptjs`.*

### Configuración de CORS:
El servidor está configurado para permitir peticiones desde el puerto `4200` (Angular). Si cambias el puerto del frontend, asegúrate de actualizar la configuración en `backend_web2_proyecto/src/app.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:4200'
}));
```

### Ejecución:
Para iniciar el servidor, ejecuta:
```bash
node src/app.js
```
El servidor estará escuchando en `http://localhost:3000` (o el puerto definido en su archivo `.env`).

---

## 2. Configuración del Módulo Frontend (Angular 18+)

La interfaz de usuario moderna y responsiva.

### Pasos de Instalación:
1. Abre una nueva terminal y navega al directorio del frontend:
   ```bash
   cd frontend_web2_proyecto
   ```
2. Instala las dependencias de Angular:
   ```bash
   npm install
   ```

### Ejecución:
Inicia el servidor de desarrollo de Angular:
```bash
npm start
```
O usando el CLI directamente:
```bash
ng serve
```
La aplicación estará disponible en `http://localhost:4200`.

---

## 3. Verificación de Integración

1. Asegúrate de que el **Backend** esté corriendo primero.
2. Una vez que el **Frontend** inicie, la página principal (`/internet-index`) cargará los datos desde la API.
3. Puedes acceder al portal usando el botón **"Acceso Portal"** que te redirigirá al login.
4. Las vistas están protegidas por roles:
   - **Admin:** `/dashboard-admin` y `/gestion-comentarios`
   - **Usuario:** `/dashboard-cliente`

---

## 4. Notas Técnicas
- **Estilos:** Se utiliza Bootstrap 5 vía CDN en `index.html` para asegurar el renderizado correcto de la grilla y componentes.
- **Iconos:** Se utilizan Bootstrap Icons para los indicadores visuales y botones.
- **Conectividad:** El frontend utiliza `InternetDataService` conectado a `environment.apiUrl` para interactuar con el backend de Node.js.
