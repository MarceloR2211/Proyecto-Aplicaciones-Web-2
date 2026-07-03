const express = require('express');
const router = express.Router();

const { 
    crearTicket, 
    obtenerTicketsDelCliente, 
    obtenerTodosLosTickets, 
    obtenerTicketPorId, 
    actualizarEstadoTicket, 
    eliminarTicket,
    enviarMensajeTicket,
    listarMensajesTicket
} = require('../controllers/ticket.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Rutas para el Sistema de Soporte Técnico (Tickets)
 * Prefijo global: /api/tickets
 */

// 1. Gestión estructural de los Tickets
router.post('/', authMiddleware, roleMiddleware(['usuario']), crearTicket); // Rol corregido a 'usuario'
router.get('/cliente/mis-tickets', authMiddleware, roleMiddleware(['usuario']), obtenerTicketsDelCliente); // Rol corregido a 'usuario'
router.get('/admin/todos', authMiddleware, roleMiddleware(['admin']), obtenerTodosLosTickets);
router.get('/:ticketId', authMiddleware, roleMiddleware(['admin', 'usuario']), obtenerTicketPorId);

// 2. Control de Estados y Ciclo de vida (Solo Admin)
router.put('/:ticketId/estado', authMiddleware, roleMiddleware(['admin']), actualizarEstadoTicket);
router.delete('/:ticketId', authMiddleware, roleMiddleware(['admin']), eliminarTicket);

// 3. Sub-recurso: Conversaciones Internas (Chat del Ticket)
router.post('/:ticketId/mensajes', authMiddleware, roleMiddleware(['admin', 'usuario']), enviarMensajeTicket);
router.get('/:ticketId/mensajes', authMiddleware, roleMiddleware(['admin', 'usuario']), listarMensajesTicket);

module.exports = router;