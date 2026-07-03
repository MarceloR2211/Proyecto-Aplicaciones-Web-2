/**
 * Middleware para simular autenticación mediante Headers
 * Reemplaza la verificación de tokens JWT por lectura directa de x-usuario-id
 */
const authMiddleware = (req, res, next) => {
    const usuarioId = req.headers["x-usuario-id"];
    const usuarioRol = req.headers["x-usuario-rol"] || "usuario";

    if (!usuarioId) {
        return res.status(401).json({ 
            error: true, 
            message: "Usuario no autenticado" 
        });
    }

    const id = Number(usuarioId);
    if (Number.isNaN(id)) {
        return res.status(400).json({ 
            error: true, 
            message: "Usuario inválido" 
        });
    }

    // Guardamos los datos simulados en el objeto request
    req.usuario = { id, rol: usuarioRol };
    next();

    
};

module.exports = authMiddleware;