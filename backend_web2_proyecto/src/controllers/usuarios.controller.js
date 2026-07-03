const Model = require('../models/usuarios.model');
const { hashPassword } = require('../utils/bcrypt');

// Listar todos los usuarios con sus estados contractuales (Solo Admin)
const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Model.listarUsuarios();
        return res.status(200).json({ error: false, usuarios });
    } catch (error) {
        console.error('Error en controlador listarUsuarios:', error);
        return res.status(500).json({ error: true, message: 'Error interno al compilar la lista de usuarios.' });
    }
};

// Obtener un usuario específico por su ID (Admin o el propio Usuario)
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Model.obtenerPorId(id);
        if (!usuario) {
            return res.status(404).json({ error: true, message: 'Usuario no encontrado.' });
        }
        return res.status(200).json({ error: false, usuario });
    } catch (error) {
        console.error('Error en controlador obtenerPorId:', error);
        return res.status(500).json({ error: true, message: 'Error interno al buscar el usuario.' });
    }
};

// Obtener usuarios filtrados por un rol específico
const obtenerPorRol = async (req, res) => {
    try {
        const { rol } = req.params; // Se puede pasar como parámetro de ruta /rol/:rol
        const usuarios = await Model.obtenerPorRol(rol || 'usuario');
        return res.status(200).json({ error: false, usuarios });
    } catch (error) {
        console.error('Error en controlador obtenerPorRol:', error);
        return res.status(500).json({ error: true, message: 'Error interno al filtrar usuarios por rol.' });
    }
};

// Crear un nuevo usuario desde cero (Administración o registro manual seguro)
const crearUsuario = async (req, res) => {
    try {
        const datosUsuario = { ...req.body };
        
        if (!datosUsuario.username || !datosUsuario.password || !datosUsuario.nombre_completo || !datosUsuario.email) {
            return res.status(400).json({ error: true, message: 'Los campos username, password, nombre completo y email son estrictamente obligatorios.' });
        }
        
        // Encriptación segura de la contraseña mediante tu utilidad centralizada
        datosUsuario.password = await hashPassword(datosUsuario.password);
        
        const nuevoUsuario = await Model.crearUsuario(datosUsuario);
        return res.status(201).json({
            error: false,
            message: 'Usuario registrado exitosamente en el sistema.',
            usuario: nuevoUsuario
        });
    } catch (error) {
        console.error('Error en controlador crearUsuario:', error);
        return res.status(400).json({ error: true, message: error.message });
    }
};

// Actualizar datos de un usuario y su contrato correspondiente (Solo Admin)
const actualizarUsuario = async (req, res) => {
    const userId = req.params.id;
    const { 
        username, dni, nombre_completo, email, telefono, fecha_nacimiento, ubigeo, zona, rol,
        estado_contrato, fecha_inicio 
    } = req.body;

    if (!nombre_completo || !email || !dni || !rol || !username) {
        return res.status(400).json({
            error: true,
            message: 'Los campos username, nombre completo, email, dni y rol son estrictamente obligatorios.'
        });
    }

    const rolesValidos = ['admin', 'usuario'];
    if (!rolesValidos.includes(rol.toLowerCase())) {
        return res.status(400).json({
            error: true,
            message: `El rol provisto no es válido. Roles autorizados: ${rolesValidos.join(', ')}.`
        });
    }

    try {
        const datosUsuario = { username, dni, nombre_completo, email, telefono, fecha_nacimiento, ubigeo, zona, rol };
        const datosContrato = { estado_contrato, fecha_inicio };

        await Model.actualizarUsuarioYContrato(userId, datosUsuario, datosContrato);
        return res.status(200).json({
            error: false,
            message: 'Los datos personales y de servicio del usuario han sido actualizados con éxito.'
        });
    } catch (error) {
        console.error(`Error en controlador actualizarUsuario para ID ${userId}:`, error);
        return res.status(500).json({
            error: true,
            message: 'Error interno en el servidor al procesar la actualización del usuario.'
        });
    }
};

// Eliminar permanentemente un usuario (Solo Admin)
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    const currentAdminId = req.usuario ? req.usuario.id : null; 

    // Medida crítica de seguridad: Evitar auto-eliminación accidental
    if (parseInt(id, 10) === parseInt(currentAdminId, 10)) {
        return res.status(400).json({
            error: true,
            message: 'Operación inválida. No puedes eliminar tu propia cuenta de administrador mientras estás en sesión.'
        });
    }

    try {
        const result = await Model.eliminarUsuario(id);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: true, message: 'El usuario solicitado no existe en el sistema.' });
        }

        return res.status(200).json({ error: false, message: 'Usuario removido del sistema de forma exitosa.' });
    } catch (error) {
        console.error(`Error en controlador eliminarUsuario para ID ${id}:`, error);
        return res.status(500).json({
            error: true,
            message: 'Error al remover el usuario. Verifique que no cuente con dependencias activas (facturas o tickets).'
        });
    }
};

// Obtener contratos vinculados a un usuario específico
const obtenerContratosUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const contratos = await Model.obtenerContratosPorUsuarioId(id);
        return res.status(200).json({ error: false, contratos });
    } catch (error) {
        console.error(`Error en controlador obtenerContratosUsuario para ID ${req.params.id}:`, error);
        return res.status(500).json({ error: true, message: 'Error al recopilar los contratos del usuario.' });
    }
};

module.exports = {
    listarUsuarios,
    obtenerPorId,
    obtenerPorRol,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerContratosUsuario
};