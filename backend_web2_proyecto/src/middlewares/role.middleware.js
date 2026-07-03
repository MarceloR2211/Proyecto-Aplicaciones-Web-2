/**
 * Middleware para validar roles de usuario en la API
 * @param {string[]} rolesPermitidos - Array de roles (ej: ['admin'])
 */
const roleMiddleware = (rolesPermitidos) => {
    return (req, res, next) => {
        // El authMiddleware debió ejecutarse antes e inyectar el usuario
        const usuario = req.usuario || req.user;

        if (!usuario || !usuario.rol) {
            return res.status(401).json({
                error: true,
                message: 'Usuario no autenticado o sesión inválida.'
            });
        }

        // Verificar si el rol del usuario cuenta con los permisos necesarios
        if (!rolesPermitidos.includes(usuario.rol)) {
            return res.status(403).json({
                error: true,
                message: 'Acceso denegado: No tienes los permisos requeridos para este recurso.'
            });
        }

        next();
    };
};

module.exports = roleMiddleware;