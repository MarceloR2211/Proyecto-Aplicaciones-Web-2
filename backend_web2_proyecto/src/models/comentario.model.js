const pool = require('../config/db');

/**
 * Obtener todos los comentarios públicos aprobados o pendientes
 * Realiza un JOIN para traer el nombre real del usuario desde la tabla usuarios
 */
const obtenerTodos = async () => {
  const queryText = `
    SELECT c.id, c.usuario_id, u.username AS nombre_usuario, 
            c.comentario, c.calificacion, c.estado, c.fecha_comentario
    FROM public.comentarios_publicos c
    JOIN public.usuarios u ON c.usuario_id = u.id
    ORDER BY c.fecha_comentario DESC;
  `;
  const result = await pool.query(queryText);
  return result.rows;
};

/**
 * Obtener un comentario específico por su ID
 */
const obtenerPorId = async (id) => {
  const queryText = `
    SELECT c.id, c.usuario_id, u.username AS nombre_usuario, 
      c.comentario, c.calificacion, c.estado, c.fecha_comentario
    FROM public.comentarios_publicos c
    JOIN public.usuarios u ON c.usuario_id = u.id
    WHERE c.id = $1;
  `;
  const result = await pool.query(queryText, [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Crear un nuevo comentario público
 * (Corregido el error de inserción: ahora apunta correctamente a comentarios_publicos)
 */
const crear = async (datos) => {
  const { usuario_id, comentario, calificacion, estado = 'pendiente' } = datos;
  
  const queryText = `
    INSERT INTO public.comentarios_publicos (usuario_id, comentario, calificacion, estado)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [usuario_id, comentario, calificacion, estado];
  
  const result = await pool.query(queryText, values);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Actualizar un comentario existente
 */
const actualizar = async (id, datos) => {
  const { comentario, calificacion, estado } = datos;
  
  const queryText = `
    UPDATE public.comentarios_publicos 
    SET comentario = $1, calificacion = $2, estado = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [comentario, calificacion, estado, id];
  
  const result = await pool.query(queryText, values);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Eliminar un comentario de la base de datos
 */
const eliminar = async (id) => {
  const queryText = 'DELETE FROM public.comentarios_publicos WHERE id = $1';
  await pool.query(queryText, [id]);
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};