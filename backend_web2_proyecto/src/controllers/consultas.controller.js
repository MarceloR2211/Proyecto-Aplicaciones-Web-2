const ConsultasModel = require('../models/consultas.model');

// Registrar una nueva consulta (Público para cualquier visitante)
const crearContacto = async (req, res) => {
    const { dni, nombre, email, telefono, motivo_consulta } = req.body;

    // Validación de campos obligatorios según la BD
    if (!dni || !nombre || !email || !motivo_consulta) {
        return res.status(400).json({
            error: true,
            message: 'Los campos DNI, Nombre, Email y Motivo de consulta son obligatorios.'
        });
    }

    try {
        const datosContacto = { dni, nombre, email, telefono, motivo_consulta };
        const nuevaConsulta = await ConsultasModel.crearContacto(datosContacto);

        return res.status(201).json({
            error: false,
            message: 'Tu consulta ha sido enviada con éxito. Nos pondremos en contacto contigo pronto.',
            consulta: nuevaConsulta
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

// Listar todas las consultas (Privado: Solo Administradores)
const listarConsultas = async (req, res) => {
    try {
        const consultas = await ConsultasModel.listarConsultas();
        return res.json(consultas);
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

// Actualizar el estado de una consulta (Privado: Solo Administradores)
const actualizarEstadoConsulta = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({
            error: true,
            message: 'El campo estado es requerido para la actualización.'
        });
    }

    try {
        const consultaActualizada = await ConsultasModel.actualizarEstadoConsulta(id, estado);
        
        if (!consultaActualizada) {
            return res.status(404).json({
                error: true,
                message: 'La consulta especificada no existe.'
            });
        }

        return res.json({
            error: false,
            message: 'Estado de la consulta actualizado de forma exitosa.',
            consulta: consultaActualizada
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

module.exports = {
    crearContacto,
    listarConsultas,
    actualizarEstadoConsulta
};