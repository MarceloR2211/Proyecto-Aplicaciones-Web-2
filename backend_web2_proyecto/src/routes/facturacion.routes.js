const express = require('express');
const router = express.Router();

// Importación limpia mediante desestructuración (Mismo estilo que auth)
const { 
    obtenerFacturas, 
    obtenerFacturasDelCliente, 
    obtenerFacturaPorId, 
    actualizarEstadoYComprobante 
} = require('../controllers/facturacion.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Rutas para la Gestión Financiera y Facturación
 * Prefijo global configurado en tu servidor: /api/facturacion
 */

// 1. Endpoints de lectura general (Filtros jerárquicos por rol)
router.get('/admin/todas', authMiddleware, roleMiddleware(['admin']), obtenerFacturas);
router.get('/cliente/mis-facturas', authMiddleware, roleMiddleware(['usuario']), obtenerFacturasDelCliente); // Rol corregido a 'usuario'

// 2. Operaciones específicas sobre un recurso ID
router.get('/:facturaId', authMiddleware, roleMiddleware(['admin', 'usuario']), obtenerFacturaPorId); // Rol corregido a 'usuario'
router.put('/:facturaId', authMiddleware, roleMiddleware(['admin']), actualizarEstadoYComprobante);

module.exports = router;