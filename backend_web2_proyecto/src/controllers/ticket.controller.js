const TicketModel = require('../models/ticket.model');

// Crear un Ticket Base
const crearTicket = async (req, res) => {
    try {
        const { titulo, descripcion, prioridad } = req.body;
        const usuarioId = req.usuario.id;

        if (!titulo || !descripcion) {
            return res.status(400).json({
                error: true,
                message: 'El título y la descripción son obligatorios.'
            });
        }

        const nuevoTicket = await TicketModel.crearTicket(
            usuarioId,
            titulo,
            descripcion,
            prioridad
        );

        return res.status(201).json({
            error: false,
            message: 'Ticket de asistencia abierto correctamente.',
            ticket: nuevoTicket
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

// Obtener un ticket por ID (Con bloqueo de seguridad)
const obtenerTicketPorId = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await TicketModel.obtenerTicketPorId(ticketId);

        if (!ticket) {
            return res.status(404).json({ error: true, message: 'Ticket no encontrado.' });
        }

        // Blindaje de seguridad: Un usuario común no puede husmear tickets ajenos
        if (req.usuario.rol === 'usuario' && ticket.usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: true, message: 'Acceso denegado a este recurso de soporte.' });
        }

        return res.status(200).json({ error: false, ticket });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Obtener todos los tickets del cliente logueado
const obtenerTicketsDelCliente = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const tickets = await TicketModel.obtenerTicketsDelCliente(usuarioId);
        return res.status(200).json({ error: false, tickets });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Obtener la bandeja de entrada total (Solo Admin)
const obtenerTodosLosTickets = async (req, res) => {
    try {
        const tickets = await TicketModel.obtenerTodosLosTickets();
        return res.status(200).json({ error: false, tickets });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Modificar estado del ticket (Solo Admin)
const actualizarEstadoTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { estado } = req.body;

        const estadosValidos = ['abierto', 'en_proceso', 'resuelto', 'cerrado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ error: true, message: 'El estado enviado es inválido.' });
        }

        const ticketActualizado = await TicketModel.actualizarEstadoTicket(ticketId, estado);
        if (!ticketActualizado) {
            return res.status(404).json({ error: true, message: 'No se encontró el ticket solicitado.' });
        }

        return res.status(200).json({ error: false, message: 'Estado actualizado correctamente.', ticket: ticketActualizado });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Eliminar un ticket (Solo Admin)
const eliminarTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticketEliminado = await TicketModel.eliminarTicket(ticketId);

        if (!ticketEliminado) {
            return res.status(404).json({ error: true, message: 'El ticket que intenta eliminar no existe.' });
        }

        return res.status(200).json({ error: false, message: 'Ticket purgado del sistema de forma permanente.' });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

/**
 * =========================================================================
 * NUEVOS CONTROLADORES PARA LAS RESPUESTAS (MENSAJES_TICKETS)
 * =========================================================================
 */

// Agregar un mensaje/respuesta a un ticket existente
const enviarMensajeTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { mensaje } = req.body;
        const usuarioId = req.usuario.id;

        if (!mensaje || mensaje.trim() === '') {
            return res.status(400).json({ error: true, message: 'El cuerpo del mensaje no puede estar vacío.' });
        }

        // Verificar existencia y pertenencia del ticket antes de responder
        const ticket = await TicketModel.obtenerTicketPorId(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: true, message: 'El ticket al que intenta responder ya no existe.' });
        }

        if (req.usuario.rol === 'usuario' && ticket.usuario_id !== usuarioId) {
            return res.status(403).json({ error: true, message: 'No tienes autorización para comentar en este ticket.' });
        }

        const nuevoMensaje = await TicketModel.agregarMensajeTicket(ticketId, usuarioId, mensaje);
        
        // Efecto secundario lógico: Si un administrador responde, el ticket puede pasar automáticamente a 'en_proceso'
        if (req.usuario.rol === 'admin' && ticket.estado === 'abierto') {
            await TicketModel.actualizarEstadoTicket(ticketId, 'en_proceso');
        }

        return res.status(201).json({ error: false, message: 'Mensaje enviado con éxito.', respuesta: nuevoMensaje });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Listar la conversación/chat de un ticket específico
const listarMensajesTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Validar primero si el solicitante tiene derecho a leer la conversación
        const ticket = await TicketModel.obtenerTicketPorId(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: true, message: 'Ticket inexistente.' });
        }

        if (req.usuario.rol === 'usuario' && ticket.usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: true, message: 'Acceso denegado a la conversación.' });
        }

        const mensajes = await TicketModel.obtenerMensajesPorTicket(ticketId);
        return res.status(200).json({ error: false, mensajes });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = {
    // Métodos para tickets
    crearTicket,
    obtenerTicketPorId,
    obtenerTicketsDelCliente,
    obtenerTodosLosTickets,
    actualizarEstadoTicket,
    eliminarTicket,
    // mtodos para mensajestickets
    enviarMensajeTicket,
    listarMensajesTicket
};