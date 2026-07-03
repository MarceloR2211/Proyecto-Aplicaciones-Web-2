const express = require('express');
const router = express.Router();

const {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
} = require('../controllers/comentarios.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Rutas de Reseñas / Comentarios Públicos de la Aplicación
 * Prefijo global: /api/comentarios
 */

// Rutas Públicas (Cualquier visitante de la Landing Page puede leerlas)
router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);

// Rutas Protegidas de Usuario (Solo clientes registrados pueden comentar)
router.post('/', authMiddleware, roleMiddleware(['usuario']), crear);

// Rutas de Moderación (Solo administradores pueden aprobar, editar o eliminar comentarios)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), actualizar);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), eliminar);

module.exports = router;