const express = require('express');
const router = express.Router();

// Importación desestructurada limpia del controlador unificado
const { 
    listarUsuarios, 
    obtenerPorId, 
    obtenerPorRol, 
    crearUsuario, 
    actualizarUsuario, 
    eliminarUsuario,
    obtenerContratosUsuario
} = require('../controllers/usuarios.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Rutas Unificadas de Gestión de Usuarios y Clientes
 * Prefijo global recomendado en app.js: /api/usuarios
 */

// 1. Operación de creación (Pública o libre para flujos de registro/creación manual)
router.post('/', crearUsuario);

// 2. Rutas administrativas restringidas (Requieren autenticación y rol de 'admin')
router.get('/', authMiddleware, roleMiddleware(['admin']), listarUsuarios);
router.get('/rol/:rol', authMiddleware, roleMiddleware(['admin']), obtenerPorRol);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), actualizarUsuario);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), eliminarUsuario);

// 3. Rutas de consulta de perfiles y relaciones (Acceso compartido o verificado)
router.get('/:id', authMiddleware, obtenerPorId);
router.get('/:id/contratos', authMiddleware, obtenerContratosUsuario);

module.exports = router;