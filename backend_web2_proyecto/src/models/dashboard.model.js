const pool = require('../config/db');

/**
 * Módulo de Dashboard - Maneja las métricas consolidadas del sistema
 */

/**
 * Métricas consolidadas para el Dashboard de Administrador
 */
const getAdminDashboard = async () => {
    try {
        // Ejecución en paralelo usando los nombres correctos de tus tablas y roles
        const [
            totalUsuarios,
            contratosActivos,
            ticketsAbiertos,
            facturasPendientes
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM public.usuarios WHERE rol = 'usuario'"), // Rol corregido a 'usuario'
            pool.query("SELECT COUNT(*) FROM public.contratos WHERE estado_contrato = 'activo'"),
            pool.query("SELECT COUNT(*) FROM public.tickets WHERE estado = 'abierto'"),
            pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM public.facturas WHERE estado = 'pendiente'")  
        ]);

        return {
            totalClientes: parseInt(totalUsuarios.rows[0].count, 10) || 0,
            serviciosActivos: parseInt(contratosActivos.rows[0].count, 10) || 0,
            ticketsPendientes: parseInt(ticketsAbiertos.rows[0].count, 10) || 0,
            porCobrar: parseFloat(facturasPendientes.rows[0].total) || 0.00
        };
    } catch (error) {
        console.error('Error en el modelo dashboard.getAdminDashboard:', error);
        throw error;
    }
};

/**
 * Datos del Dashboard específicos para un Cliente/Usuario autenticado
 */
const getClientDashboard = async (usuarioId) => {
    try {
        const [perfilResult, contratoResult, facturasResult, ticketsResult] = await Promise.all([
            // 1. Perfil del usuario autenticado
            pool.query(`
                SELECT id, username, nombre_completo, email
                FROM public.usuarios
                WHERE id = $1
                LIMIT 1
            `, [usuarioId]),

            // 2. Contrato activo
            pool.query(`
                SELECT c.estado_contrato, c.fecha_inicio, p.nombre_plan, p.velocidad, p.precio
                FROM public.contratos c
                JOIN public.planes p ON c.plan_id = p.id
                WHERE c.usuario_id = $1
                LIMIT 1
            `, [usuarioId]),

            // 3. Últimas 5 facturas
            pool.query(`
                SELECT id, monto, fecha_emision, fecha_vencimiento, estado, comprobante_pdf
                FROM public.facturas
                WHERE usuario_id = $1
                ORDER BY fecha_emision DESC
                LIMIT 5
            `, [usuarioId]),

            // 4. Últimos 10 tickets
            pool.query(`
                SELECT id, titulo, descripcion, prioridad, estado, fecha_creacion, fecha_actualizacion
                FROM public.tickets
                WHERE usuario_id = $1
                ORDER BY fecha_creacion DESC
                LIMIT 10
            `, [usuarioId])
        ]);

        const perfil = perfilResult.rows[0] || null;
        const contrato = contratoResult.rows.length > 0 ? contratoResult.rows[0] : null;

        return {
            perfil,
            servicio: contrato ? {
                estado: contrato.estado_contrato,
                fechaInicio: contrato.fecha_inicio,
                plan: contrato.nombre_plan,
                velocidad: contrato.velocidad,
                precio: parseFloat(contrato.precio)
            } : { estado: 'sin_contrato', message: 'No cuenta con un servicio de internet activo actualmente.' },
            facturas: facturasResult.rows,
            tickets: ticketsResult.rows
        };
    } catch (error) {
        console.error(`Error en el modelo dashboard.getClientDashboard para ID ${usuarioId}:`, error);
        throw error;
    }
};

module.exports = {
    getAdminDashboard,
    getClientDashboard
};