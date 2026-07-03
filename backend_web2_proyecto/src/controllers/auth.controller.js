const Model = require('../models/auth.models');
const { comparePassword, hashPassword } = require('../utils/bcrypt');

/**
 * Controlador para el inicio de sesión con Bcrypt
 */
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            error: true,
            message: 'El usuario y la contraseña son requeridos.' 
        });
    }

    try {
        const user = await Model.buscarPorUsername(username);

        if (!user) {
            return res.status(401).json({ 
                error: true,
                message: 'Usuario o contraseña incorrectos.'
            });
        }

        // COMPARACIÓN CON BCRYPT
        const passwordMatch = await comparePassword(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ 
                error: true,
                message: 'Usuario o contraseña incorrectos.'
            });
        }

        const mustChangePassword = user.primer_login === 1;

        return res.status(200).json({ 
            error: false,
            message: 'Inicio de sesión exitoso.',
            simulatedSession: {
                userId: user.id,
                userRol: user.rol
            },
            user: {
                id: user.id,
                username: user.username,
                nombre_completo: user.nombre_completo,
                rol: user.rol,
                mustChangePassword: mustChangePassword
            }
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ 
            error: true,
            message: 'Error interno del servidor.' 
        });
    }
};

/**
 * Controlador para cambiar la contraseña
 */
const changePassword = async (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;

    if (!username || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: true, message: 'Todos los campos son obligatorios.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: true, message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: true, message: 'La nueva contraseña y la confirmación no coinciden.' });
    }

    try {
        // ENCRIPTACIÓN CON BCRYPT
        const passwordHash = await hashPassword(newPassword);
        
        const userUpdated = await Model.actualizarPassword(username, passwordHash);

        if (!userUpdated) {
            return res.status(404).json({ error: true, message: 'Usuario no encontrado.' });
        }

        return res.status(200).json({ 
            error: false,
            message: 'Contraseña actualizada exitosamente.',
            redirectTo: userUpdated.rol === 'admin' ? '/admin/dashboard' : '/user/dashboard'
        });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({
            error: true,
            message: 'Error interno del servidor al actualizar la seguridad.'
        });
    }
};

const logout = (req, res) => {
    return res.status(200).json({
        error: false,
        message: 'Sesión finalizada correctamente.',
        clearHeaders: true,
        redirectTo: '/login'
    });
};

module.exports = { login, changePassword, logout };