const DashboardModel = require('../models/dashboard.model');

/**
 * Obtener métricas para el dashboard de administrador
 */
const getAdminDashboard = async (req, res) => {
    try {
        const metrics = await DashboardModel.getAdminDashboard();
        return res.status(200).json({
            error: false,
            metrics
        });
    } catch (error) {
        console.error('Error en el controlador getAdminDashboard:', error);
        return res.status(500).json({
            error: true,
            message: 'Error interno en el servidor al compilar las métricas del sistema.'
        });
    }
};

/**
 * Obtener datos del dashboard del cliente/usuario autenticado
 */
const getClientDashboard = async (req, res) => {
    // Tomamos el ID directo de la sesión inyectada por el authMiddleware
    const usuarioId = req.usuario ? req.usuario.id : null; 

    if (!usuarioId) {
        return res.status(401).json({
            error: true,
            message: 'Acceso no autorizado. No se pudo verificar la identidad del usuario.'
        });
    }

    try {
        const dashboardData = await DashboardModel.getClientDashboard(usuarioId);
        return res.status(200).json({
            error: false,
            dashboard: dashboardData
        });
    } catch (error) {
        console.error(`Error en controlador getClientDashboard para el usuario ${usuarioId}:`, error);
        return res.status(500).json({
            error: true,
            message: 'Error interno del servidor al cargar tu panel de control de usuario.'
        });
    }
};

module.exports = {
    getAdminDashboard,
    getClientDashboard
};