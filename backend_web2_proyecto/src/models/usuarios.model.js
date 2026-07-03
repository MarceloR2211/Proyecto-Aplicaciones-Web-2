const pool = require('../config/db');

/**
 * Obtener todos los usuarios del sistema junto con el estado de su contrato de internet (si aplica)
 */
const listarUsuarios = async () => {
    try {
        const queryText = `
            SELECT
                u.id,
                u.username,
                u.dni,
                u.nombre_completo,
                u.email,
                u.telefono,
                u.fecha_nacimiento,
                u.ubigeo,
                u.zona,
                u.rol,
                c.estado_contrato,
                c.fecha_inicio
            FROM public.usuarios u
            LEFT JOIN public.contratos c ON u.id = c.usuario_id
            ORDER BY u.id DESC;
        `;
        const result = await pool.query(queryText);
        return result.rows;
    } catch (error) {
        console.error('Error en usuariosModel.listarUsuarios:', error);
        throw error;
    }
};

/**
 * Obtener un usuario específico por su ID
 */
const obtenerPorId = async (id) => {
    try {
        const queryText = `
            SELECT id, username, dni, nombre_completo, email, telefono, fecha_nacimiento, ubigeo, zona, rol, primer_login 
            FROM public.usuarios 
            WHERE id = $1;
        `;
        const result = await pool.query(queryText, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error(`Error en usuariosModel.obtenerPorId para ID ${id}:`, error);
        throw error;
    }
};

/**
 * Obtener usuarios filtrados por su rol ('usuario' o 'admin')
 */
const obtenerPorRol = async (rol) => {
    try {
        const queryText = 'SELECT * FROM public.usuarios WHERE rol = $1 ORDER BY id DESC;';
        const result = await pool.query(queryText, [rol]);
        return result.rows;
    } catch (error) {
        console.error(`Error en usuariosModel.obtenerPorRol para rol ${rol}:`, error);
        throw error;
    }
};

/**
 * Crear un nuevo usuario (con contraseña ya encriptada)
 */
const crearUsuario = async (usuario) => {
    try {
        const { 
            username, password, dni, nombre_completo, email, 
            telefono, fecha_nacimiento, ubigeo, zona, rol = 'usuario',          
            primer_login = 1       
        } = usuario;

        const queryText = `
            INSERT INTO public.usuarios (
                username, password, dni, nombre_completo, email, 
                telefono, fecha_nacimiento, ubigeo, zona, rol, primer_login
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING id, username, dni, nombre_completo, email, rol;
        `;
        const values = [username, password, dni, nombre_completo, email, telefono, fecha_nacimiento, ubigeo, zona, rol, primer_login];
        const result = await pool.query(queryText, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error en usuariosModel.crearUsuario:', error);
        throw error;
    }
};

/**
 * Actualizar datos de usuario y su contrato mediante una transacción segura (Uso Administrativo)
 */
const actualizarUsuarioYContrato = async (userId, datosUsuario, datosContrato) => {
    const { username, dni, nombre_completo, email, telefono, fecha_nacimiento, ubigeo, zona, rol } = datosUsuario;
    const { estado_contrato, fecha_inicio } = datosContrato;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Actualizar la tabla usuarios
        const updateUserQuery = `
            UPDATE public.usuarios 
            SET username = $1, dni = $2, nombre_completo = $3, email = $4, telefono = $5, 
                fecha_nacimiento = $6, ubigeo = $7, zona = $8, rol = $9 
            WHERE id = $10;
        `;
        await client.query(updateUserQuery, [username, dni, nombre_completo, email, telefono, fecha_nacimiento, ubigeo, zona, rol, userId]);

        // 2. Establecer valores de resguardo para el contrato
        const fechaIniFinal = fecha_inicio || new Date().toISOString().split('T')[0];
        const estadoServFinal = estado_contrato || 'activo';

        // 3. Actualizar o verificar el contrato asociado
        const updateContratoQuery = `
            UPDATE public.contratos
            SET estado_contrato = $1, fecha_inicio = $2
            WHERE usuario_id = $3;
        `;
        await client.query(updateContratoQuery, [estadoServFinal, fechaIniFinal, userId]);
        
        await client.query('COMMIT');
        return { success: true };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Error en transacción del modelo actualizarUsuarioYContrato para ID ${userId}:`, error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Eliminar físicamente un usuario del sistema
 */
const eliminarUsuario = async (id) => {
    try {
        const queryText = 'DELETE FROM public.usuarios WHERE id = $1;';
        const result = await pool.query(queryText, [id]);
        return result; // Mantiene rowCount para validación en el controlador
    } catch (error) {
        console.error(`Error en usuariosModel.eliminarUsuario para ID ${id}:`, error);
        throw error;
    }
};

/**
 * Obtener los contratos activos o históricos de un usuario específico
 */
const obtenerContratosPorUsuarioId = async (usuarioId) => {
    try {
        const queryText = `
            SELECT c.*, p.nombre_plan, p.velocidad, p.precio
            FROM public.contratos c
            JOIN public.planes p ON c.plan_id = p.id
            WHERE c.usuario_id = $1;
        `;
        const result = await pool.query(queryText, [usuarioId]);
        return result.rows;
    } catch (error) {
        console.error(`Error en usuariosModel.obtenerContratosPorUsuarioId para ID ${usuarioId}:`, error);
        throw error;
    }
};

module.exports = {
    listarUsuarios,
    obtenerPorId,
    obtenerPorRol,
    crearUsuario,
    actualizarUsuarioYContrato,
    eliminarUsuario,
    obtenerContratosPorUsuarioId
};