const PlanModel = require('../models/planes.model');

// Obtener todos los planes del catálogo
const obtenerTodos = async (req, res) => {
    try {
        const planes = await PlanModel.obtenerTodos();
        return res.status(200).json({ error: false, planes });
    } catch (error) {
        console.error('Error en obtenerTodos (planes):', error);
        return res.status(500).json({ error: true, message: 'Error interno del servidor al listar los planes.' });
    }
};

// Obtener un plan específico por ID
const obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const plan = await PlanModel.obtenerPorId(id);
        if (!plan) {
            return res.status(404).json({ error: true, message: 'El plan de internet solicitado no existe.' });
        }
        return res.status(200).json({ error: false, plan });
    } catch (error) {
        console.error(`Error en obtenerPorId para el plan ${id}:`, error);
        return res.status(500).json({ error: true, message: 'Error interno al buscar el plan.' });
    }
};

// Crear un nuevo plan (Solo Administrador)
const crear = async (req, res) => {
    const { nombre_plan, tipo_plan, velocidad, precio, estado } = req.body;

    // Validación básica preventiva
    if (!nombre_plan || !tipo_plan || !velocidad || !precio || !estado) {
        return res.status(400).json({ 
            error: true, 
            message: 'Todos los campos son obligatorios.' 
        });
    }

    try {
        const nuevoPlan = await PlanModel.crear(req.body);
        return res.status(201).json({
            error: false,
            message: 'Plan de internet creado exitosamente.',
            plan: nuevoPlan
        });
    } catch (error) {
        console.error('Error al crear un plan:', error);
        return res.status(400).json({ error: true, message: error.message });
    }
};

// Actualizar un plan existente (Solo Administrador)
const actualizar = async (req, res) => {
    const { id } = req.params;
    const { nombre_plan, tipo_plan, velocidad, precio, estado } = req.body;

    if (!nombre_plan || !tipo_plan || !velocidad || !precio || !estado) {
        return res.status(400).json({ 
            error: true, 
            message: 'Todos los campos son requeridos para actualizar el plan.' 
        });
    }

    try {
        const planActualizado = await PlanModel.actualizar(id, req.body);
        if (!planActualizado) {
            return res.status(404).json({ error: true, message: 'No se encontró el plan de internet para actualizar.' });
        }
        return res.status(200).json({
            error: false,
            message: 'Plan actualizado correctamente.',
            plan: planActualizado
        });
    } catch (error) {
        console.error(`Error al actualizar el plan ${id}:`, error);
        return res.status(400).json({ error: true, message: error.message });
    }
};

// Eliminar un plan (Solo Administrador)
const eliminar = async (req, res) => {
    const { id } = req.params;
    try {
        // Nota académica: En producción se prefiere un borrado lógico (estado = 'inactivo'), 
        // pero mapeamos el método de tu modelo original de manera segura.
        await PlanModel.eliminar(id);
        return res.status(200).json({ 
            error: false, 
            message: 'Plan eliminado del catálogo de manera permanente.' 
        });
    } catch (error) {
        console.error(`Error al eliminar el plan ${id}:`, error);
        return res.status(500).json({ 
            error: true, 
            message: 'No se pudo eliminar el plan. Verifique que no esté siendo usado por un contrato vigente.' 
        });
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};