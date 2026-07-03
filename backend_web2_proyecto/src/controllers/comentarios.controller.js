const ComentarioModel = require('../models/comentario.model');

// Obtener todos los comentarios aprobados o públicos
const obtenerTodos = async (req, res) => {
    try {
        const comentarios = await ComentarioModel.obtenerTodos();
        return res.status(200).json({ error: false, comentarios });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Obtener un comentario específico por su ID
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const comentario = await ComentarioModel.obtenerPorId(id);
        
        if (!comentario) {
            return res.status(404).json({ error: true, message: 'Comentario no encontrado.' });
        }
        return res.status(200).json({ error: false, comentario });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Crear un nuevo comentario público (Requiere usuario autenticado)
const crear = async (req, res) => {
    try {
        const { comentario, calificacion } = req.body;
        const usuarioId = req.usuario.id; // Extraído de forma segura desde el authMiddleware

        if (!comentario || comentario.trim() === '') {
            return res.status(400).json({ error: true, message: 'El comentario es requerido.' });
        }

        if (calificacion === undefined || calificacion < 0 || calificacion > 5) {
            return res.status(400).json({ error: true, message: 'La calificación es obligatoria y debe ser un valor entre 0 y 5 estrellas.' });
        }

        const datosComentario = {
            usuario_id: usuarioId,
            comentario,
            calificacion,
            estado: 'pendiente' // Por seguridad, entran en revisión de moderación
        };

        const nuevoComentario = await ComentarioModel.crear(datosComentario);
        return res.status(201).json({
            error: false,
            message: 'Comentario registrado con éxito. Será visible una vez que sea moderado.',
            comentario: nuevoComentario
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

// Actualizar el estado o contenido de un comentario (Solo Admin para moderación)
const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentario, calificacion, estado } = req.body;

        // Validar si el comentario existe antes de proceder
        const comentarioExistente = await ComentarioModel.obtenerPorId(id);
        if (!comentarioExistente) {
            return res.status(404).json({ error: true, message: 'El comentario que intenta editar no existe.' });
        }

        // Si no se envían datos nuevos, se preservan los de la BD
        const datosActualizados = {
            usuario_id: comentarioExistente.usuario_id,
            nombre_usuario: comentarioExistente.nombre_usuario,
            comentario: comentario || comentarioExistente.comentario,
            calificacion: calificacion !== undefined ? calificacion : comentarioExistente.calificacion,
            estado: estado || comentarioExistente.estado
        };

        const comentarioActualizado = await ComentarioModel.actualizar(id, datosActualizados);
        return res.status(200).json({
            error: false,
            message: 'Comentario moderado/actualizado con éxito.',
            comentario: comentarioActualizado
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

// Eliminar un comentario de la base de datos (Solo Admin)
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await ComentarioModel.eliminar(id);
        return res.status(200).json({ error: false, message: 'Comentario removido del sistema de forma permanente.' });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Exportación unificada bajo el estándar moderno de tu proyecto
module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};