const pool = require('../config/db');

/**
 * Registra una consulta desde el formulario de contacto (Público)
 */
const crearContacto = async (datosContacto) => {
    const { dni, nombre, email, telefono, motivo_consulta } = datosContacto;

    const queryText = `
        INSERT INTO public.consultas (dni, nombre, email, telefono, motivo_consulta, estado)
        VALUES ($1, $2, $3, $4, $5, 'pendiente')
        RETURNING *;
    `;
    const values = [dni, nombre, email, telefono || null, motivo_consulta];

    const result = await pool.query(queryText, values);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Obtiene el listado de todas las consultas registradas (Solo Admin)
 */
const listarConsultas = async () => {
    const queryText = `
        SELECT id, dni, nombre, email, telefono, motivo_consulta, estado, fecha_creacion
        FROM public.consultas
        ORDER BY fecha_creacion DESC;
    `;
    const result = await pool.query(queryText);
    return result.rows;
};

/**
 * Actualiza el estado de moderación de una consulta (Solo Admin)
 */
const actualizarEstadoConsulta = async (id, estado) => {
    const queryText = `
        UPDATE public.consultas
        SET estado = $1
        WHERE id = $2
        RETURNING id, estado;
    `;
    const result = await pool.query(queryText, [estado, id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = {
    crearContacto,
    listarConsultas,
    actualizarEstadoConsulta
};

