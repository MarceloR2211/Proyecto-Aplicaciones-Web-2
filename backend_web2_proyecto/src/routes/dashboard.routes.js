const express = require('express');
const router = express.Router();

// Importación limpia usando desestructuración (Mismo estilo que auth)
const { getAdminDashboard, getClientDashboard } = require('../controllers/dashboard.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Rutas para los Dashboards del Sistema
 * Prefijo global: /api/dashboard
 */

// 1. Dashboard de Administrador: Acceso exclusivo para rol 'admin'
router.get('/admin', authMiddleware, roleMiddleware(['admin']), getAdminDashboard);

// 2. Dashboard del Cliente: Acceso para rol 'usuario' 
router.get('/cliente', authMiddleware, roleMiddleware(['usuario']), getClientDashboard);

module.exports = router;