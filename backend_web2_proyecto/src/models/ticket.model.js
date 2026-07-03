const pool = require('../config/db');

/**
 * =========================================================================
 * 1. MÉTODOS PARA EL RECURSO PRINCIPAL: TICKETS
 * =========================================================================
 */

// Crear el contenedor principal del ticket
const crearTicket = async (usuarioId, titulo, descripcion, prioridad) => {
    const query = `
        INSERT INTO public.tickets (usuario_id, titulo, descripcion, estado, prioridad, fecha_creacion, fecha_actualizacion)
        VALUES ($1, $2, $3,'abierto', $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
    `;
    const result = await pool.query(query, [usuarioId, titulo, descripcion, prioridad]);
    return result.rows[0];
};

// Obtener un ticket con información detallada de su creador
const obtenerTicketPorId = async (ticketId) => {
    const query = `
        SELECT t.*, u.nombre_completo, u.email, u.rol
        FROM public.tickets t
        JOIN public.usuarios u ON t.usuario_id = u.id
        WHERE t.id = $1;
    `;
    const result = await pool.query(query, [ticketId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Listar tickets pertenecientes a un cliente en específico
const obtenerTicketsDelCliente = async (usuarioId) => {
    const query = `
        SELECT id, titulo, descripcion, estado, fecha_creacion, fecha_actualizacion
        FROM public.tickets
        WHERE usuario_id = $1
        ORDER BY fecha_creacion DESC;
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
};

// Listar la totalidad de tickets (Solo Admin)
const obtenerTodosLosTickets = async () => {
    const query = `
        SELECT t.*, u.nombre_completo, u.email
        FROM public.tickets t
        JOIN public.usuarios u ON t.usuario_id = u.id
        ORDER BY t.fecha_creacion DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// Cambiar el estado del flujo del ticket (abierto, en_proceso, resuelto, cerrado)
const actualizarEstadoTicket = async (ticketId, nuevoEstado) => {
    const query = `
        UPDATE public.tickets
        SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
    `;
    const result = await pool.query(query, [nuevoEstado, ticketId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Borrado físico de un ticket
const eliminarTicket = async (ticketId) => {
    const query = 'DELETE FROM public.tickets WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [ticketId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};


/**
 * =========================================================================
 * 2. NUEVOS MÉTODOS: MENSAJES / RESPUESTAS INTERNAS DE UN TICKET
 * =========================================================================
 */

// Insertar un mensaje dentro de la conversación del ticket
const agregarMensajeTicket = async (ticketId, usuarioId, mensaje) => {
    const query = `
        INSERT INTO public.mensajes_tickets (ticket_id, usuario_id, mensaje, fecha_envio)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *;
    `;
    const result = await pool.query(query, [ticketId, usuarioId, mensaje]);
    return result.rows[0];
};

// Obtener el historial de chat cronológico de un ticket con los nombres de quienes respondieron
const obtenerMensajesPorTicket = async (ticketId) => {
    const query = `
        SELECT m.id, m.ticket_id, m.usuario_id, u.nombre_completo AS remitente, u.rol AS rol_remitente, m.mensaje, m.fecha_envio
        FROM public.mensajes_tickets m
        JOIN public.usuarios u ON m.usuario_id = u.id
        WHERE m.ticket_id = $1
        ORDER BY m.fecha_envio ASC;
    `;
    const result = await pool.query(query, [ticketId]);
    return result.rows;
};

module.exports = {
    // Métodos para tickets  
    crearTicket,
    obtenerTicketPorId,
    obtenerTicketsDelCliente,
    obtenerTodosLosTickets,
    actualizarEstadoTicket,
    eliminarTicket,
    // Métodos para mensajestickets
    agregarMensajeTicket,
    obtenerMensajesPorTicket
};