const express = require('express');
const router = express.Router();

// Importación limpia mediante desestructuración
const { 
    crearContacto, 
    listarConsultas, 
    actualizarEstadoConsulta 
} = require('../controllers/consultas.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Rutas de Consultas y Contacto de la Landing Page
 * Prefijo global configurado en el servidor: /api/consultas
 */

// 1. RUTA PÚBLICA: Cualquier usuario/visitante de la web puede enviar un formulario
router.post('/', crearContacto);

// 2. RUTAS ADMINISTRATIVAS PROTEGIDAS: Solo accesibles por Administradores logueados
router.get('/', authMiddleware, roleMiddleware(['admin']), listarConsultas);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), actualizarEstadoConsulta);

module.exports = router;