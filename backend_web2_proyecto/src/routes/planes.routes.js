const express = require('express');
const router = express.Router();

// Importación limpia desestructurada
const { 
    obtenerTodos, 
    obtenerPorId, 
    crear, 
    actualizar, 
    eliminar 
} = require('../controllers/planes.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Rutas del Catálogo de Planes de Internet
 * Prefijo global: /api/planes
 */

// --- RUTAS PÚBLICAS O DE LECTURA ---
// Cualquiera puede ver los planes disponibles (visitantes, clientes/usuarios y administradores)
router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);

// --- RUTAS PROTEGIDAS (Solo Rol: 'admin') ---
// Solo un administrador autenticado puede alterar el catálogo de productos comerciales
router.post('/', authMiddleware, roleMiddleware(['admin']), crear);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), actualizar);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), eliminar);

module.exports = router;