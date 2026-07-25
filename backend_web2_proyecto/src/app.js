const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, 'config', '.env')
});

const app = express();

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const consultasRoutes = require('./routes/consultas.routes');
const planesRoutes = require('./routes/planes.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const ticketRoutes = require('./routes/ticket.routes');
const facturacionRoutes = require('./routes/facturacion.routes');
const uploadRoutes = require('./routes/upload.routes');

// Facturación automática
require('./cron/billingCron');

// CORS
const allowedOrigins = [
    'http://localhost:4200',
    process.env.FRONTEND_URL
]
    .filter(Boolean)
    .map(origin => origin.replace(/\/$/, ''));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const normalizedOrigin = origin.replace(/\/$/, '');

        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }

        return callback(
            new Error(`Origen no permitido por CORS: ${origin}`)
        );
    },
    credentials: true
}));

// Middlewares
app.use(express.json({ limit: '8mb' }));

app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'))
);

// Health Check
app.get('/', (req, res) => {
    res.status(200).send('Servidor funcionando');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/facturas', facturacionRoutes);
app.use('/api/upload', uploadRoutes);

// Servidor
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(
        'Frontend autorizado:',
        process.env.FRONTEND_URL || 'solo localhost'
    );
});