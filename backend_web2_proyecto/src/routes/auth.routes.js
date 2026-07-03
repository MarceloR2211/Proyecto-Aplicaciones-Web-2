const express = require('express');
const router = express.Router();
const { login, changePassword, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Rutas de autenticación simplificadas
 * Prefijo: /api/auth
 */

// POST /api/auth/login - Iniciar sesión (Público)
router.post('/login', login);

// POST /api/auth/change-password - Cambiar contraseña (Protegido por Header)
router.post('/change-password', authMiddleware, changePassword);

// POST /api/auth/logout - Cerrar sesión (Protegido por Header)
router.post('/logout', authMiddleware, logout);

module.exports = router;