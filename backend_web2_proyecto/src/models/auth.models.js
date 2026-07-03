const pool = require('../config/db');

/**
 * Busca un usuario por su username
 */
const buscarPorUsername = async (username) => {
    const queryText = 'SELECT * FROM public.usuarios WHERE username = $1';
    const result = await pool.query(queryText, [username]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Actualiza la contraseña en texto plano y cambia primer_login a 0 (Falso)
 */
const actualizarPassword = async (username, password) => {
    const queryText = `
        UPDATE public.usuarios
        SET password = $1, primer_login = 0
        WHERE username = $2
        RETURNING id, rol;
    `;
    const result = await pool.query(queryText, [password, username]);
    return result.rowCount > 0 ? result.rows[0] : null;
};

module.exports = {
    buscarPorUsername,
    actualizarPassword
};