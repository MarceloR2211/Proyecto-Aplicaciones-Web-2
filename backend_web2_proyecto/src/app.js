const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Importar rutas unificadas y corregidas
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes'); // Absorbió clientes.routes
const dashboardRoutes = require('./routes/dashboard.routes');
const consultasRoutes = require('./routes/consultas.routes');
const planesRoutes = require('./routes/planes.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const ticketRoutes = require('./routes/ticket.routes'); // Centralizado a la convención .routes.js
const facturacionRoutes = require('./routes/facturacion.routes'); // Centralizado a la convención .routes.js
const uploadRoutes = require('./routes/upload.routes'); // Centralizado a la convención .routes.js

// Importar cron job de facturación automática
require('./cron/billingCron');

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// Middlewares globales
app.use(express.json({ limit: '8mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ruta de salud del servidor (Health Check)
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

// Montar rutas con sus respectivos prefijos API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/facturas', facturacionRoutes);
app.use('/api/upload', uploadRoutes);

// Inicialización del servidor
app.listen(3000, () => { 
    console.log('Servidor ejecutándose en http://localhost:3000'); 
});