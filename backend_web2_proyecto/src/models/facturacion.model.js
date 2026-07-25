const pool = require('../config/db');

/**
 * =========================================================================
 * 1. FUNCIONES PRINCIPALES (Para el uso de Controladores y la API REST)
 * =========================================================================
 */

/**
 * Obtiene todas las facturas del sistema con un JOIN limpio hacia usuarios (Solo Admin)
 */
const obtenerFacturas = async () => {
    const queryText = `
        SELECT f.id, f.usuario_id, u.nombre_completo AS nombre_usuario, u.email,
               f.monto, f.fecha_emision, f.fecha_vencimiento, f.estado, f.comprobante_pdf
        FROM public.facturas f
        JOIN public.usuarios u ON f.usuario_id = u.id
        ORDER BY f.fecha_emision DESC;
    `;
    const result = await pool.query(queryText);
    return result.rows;
};

/**
 * Obtiene las facturas correspondientes a un usuario/cliente en específico
 */
const obtenerFacturasDelCliente = async (usuarioId) => {
    const queryText = `
        SELECT id, monto, fecha_emision, fecha_vencimiento, estado, comprobante_pdf
        FROM public.facturas
        WHERE usuario_id = $1
        ORDER BY fecha_emision DESC;
    `;
    const result = await pool.query(queryText, [usuarioId]);
    return result.rows;
};

/**
 * Obtiene una factura específica filtrada por su ID con datos del usuario asociados
 */
const obtenerFacturaPorId = async (facturaId) => {
    const queryText = `
        SELECT f.id, f.usuario_id, u.nombre_completo AS nombre_usuario, u.email,
               f.monto, f.fecha_emision, f.fecha_vencimiento, f.estado, f.comprobante_pdf
        FROM public.facturas f
        JOIN public.usuarios u ON f.usuario_id = u.id
        WHERE f.id = $1;
    `;
    const result = await pool.query(queryText, [facturaId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Actualiza el estado de pago, asigna el PDF del comprobante y registra la fecha de pago
 */
const actualizarEstadoYComprobante = async (facturaId, nuevoEstado, nombreComprobante) => {
    const queryText = `
        UPDATE public.facturas
        SET estado = $1, 
            comprobante_pdf = $2,
            fecha_pago = CASE WHEN $1 = 'pagado' THEN CURRENT_TIMESTAMP ELSE NULL END
        WHERE id = $3
        RETURNING *;
    `;
    const result = await pool.query(queryText, [nuevoEstado, nombreComprobante, facturaId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};



const registrarComprobante = async (facturaId, usuarioId, ruta) => {
    const queryText = `
        UPDATE public.facturas
        SET comprobante_pdf = $1
        WHERE id = $2
          AND usuario_id = $3
          AND estado IN ('pendiente', 'vencido')
        RETURNING id, usuario_id, monto, fecha_vencimiento, estado, comprobante_pdf;
    `;
    const result = await pool.query(queryText, [ruta, facturaId, usuarioId]);
    return result.rows[0] || null;
};

/**
 * =========================================================================
 * 2. FUNCIONES AUTOMÁTICAS (Para el uso exclusivo del billingCron Job)
 * =========================================================================
 */

/**
 * Obtiene todos los contratos activos junto con el precio de su plan asignado
 */
const obtenerContratosActivos = async () => {
    const queryText = `
        SELECT c.id, c.usuario_id, c.plan_id, p.precio 
        FROM public.contratos c
        INNER JOIN public.planes p ON c.plan_id = p.id
        WHERE c.estado_contrato = 'activo';
    `;
    const result = await pool.query(queryText);
    return result.rows;
};

/**
 * Verifica si ya existe una factura emitida para el usuario en el mes y año en curso
 */
const verificarFacturaMesActual = async (usuarioId, mes, anio) => {
    const queryText = `
        SELECT id FROM public.facturas
        WHERE usuario_id = $1
          AND EXTRACT(MONTH FROM fecha_emision) = $2
          AND EXTRACT(YEAR FROM fecha_emision) = $3
        LIMIT 1;
    `;
    const result = await pool.query(queryText, [usuarioId, mes, anio]);
    return result.rows.length > 0;
};

/**
 * Inserta automáticamente una nueva factura generada por el sistema
 */
const crearFacturaAutomatica = async (usuarioId, monto, fechaVencimiento) => {
    const queryText = `
        INSERT INTO public.facturas (usuario_id, monto, fecha_emision, fecha_vencimiento, estado)
        VALUES ($1, $2, CURRENT_DATE, $3, 'pendiente')
        RETURNING id;
    `;
    const result = await pool.query(queryText, [usuarioId, monto, fechaVencimiento]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = {
    // Endpoints API
    obtenerFacturas,
    obtenerFacturasDelCliente,
    obtenerFacturaPorId,
    actualizarEstadoYComprobante,
    registrarComprobante,
    // Métodos Cron Job
    obtenerContratosActivos,
    verificarFacturaMesActual,
    crearFacturaAutomatica
};