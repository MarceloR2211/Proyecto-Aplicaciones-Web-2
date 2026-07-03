const pool = require('../config/db');

/**
 * Obtener todos los planes registrados en el sistema ordenados por ID
 */
const obtenerTodos = async () => {
    const queryText = 'SELECT * FROM public.planes ORDER BY id;';
    const result = await pool.query(queryText);
    return result.rows;
};

/**
 * Obtener un plan específico por su clave primaria
 */
const obtenerPorId = async (id) => {
    const queryText = 'SELECT * FROM public.planes WHERE id = $1;';
    const result = await pool.query(queryText, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Registrar un nuevo plan de servicio de internet
 */
const crear = async (plan) => {
    const { nombre_plan, tipo_plan, velocidad, precio, descripcion, estado } = plan;
    const queryText = `
        INSERT INTO public.planes (nombre_plan, tipo_plan, velocidad, precio, descripcion, estado)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
    `;
    const result = await pool.query(queryText, [
        nombre_plan, 
        tipo_plan, 
        velocidad, 
        precio, 
        descripcion, 
        estado || 'activo' // Estado por defecto en caso de no enviarse
    ]);
    return result.rows[0];
};

/**
 * Actualizar los parámetros de un plan existente
 */
const actualizar = async (id, plan) => {
    const { nombre_plan, tipo_plan, velocidad, precio, descripcion, estado } = plan;
    const queryText = `
        UPDATE public.planes 
        SET nombre_plan = $1, tipo_plan = $2, velocidad = $3, precio = $4, descripcion = $5, estado = $6
        WHERE id = $7 
        RETURNING *;
    `;
    const result = await pool.query(queryText, [nombre_plan, tipo_plan, velocidad, precio, descripcion, estado, id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Eliminar físicamente un plan del catálogo
 */
const eliminar = async (id) => {
    const queryText = 'DELETE FROM public.planes WHERE id = $1;';
    await pool.query(queryText, [id]);
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};