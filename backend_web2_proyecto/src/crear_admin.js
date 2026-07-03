
//para hacer las pruebas aqui creen el admin

// 1. Cargamos las variables del .env de forma directa apuntando a su carpeta
require('dotenv').config({ path: './config/.env' });

const pool = require('./config/db');
const bcrypt = require('./utils/bcrypt');

async function crearUsuarioAdmin() {
    const adminData = {
        username: 'admin_pruebas',
        passwordRaw: 'Admin123*',
        dni: '00000000',
        nombre_completo: 'Administrador de Pruebas',
        email: 'admin.test@internet.com',
        telefono: '987654321',
        fecha_nacimiento: '1995-01-01',
        ubigeo: '180201',
        zona: 'Cercado',
        rol: 'admin'
    };

    console.log('=== Creando usuario Administrador (Modo Simple) ===');

    try {
        // Encriptar de forma directa
        const passwordEncriptada = await bcrypt.hashPassword(adminData.passwordRaw, 10);

        const queryText = `
            INSERT INTO public.usuarios (
                username, password, dni, nombre_completo, email, 
                telefono, fecha_nacimiento, ubigeo, zona, rol, primer_login
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, username, rol;
        `;

        const values = [
            adminData.username,
            passwordEncriptada,
            adminData.dni,
            adminData.nombre_completo,
            adminData.email,
            adminData.telefono,
            adminData.fecha_nacimiento,
            adminData.ubigeo,
            adminData.zona,
            adminData.rol,
            0 // 0 = Cuenta de sistema/admin activa sin cambio obligatorio
        ];

        const resultado = await pool.query(queryText, values);

        console.log('\n¡Admin creado exitosamente con el script limpio!');
        console.log(`ID: ${resultado.rows[0].id} | Rol: ${resultado.rows[0].rol}`);
        console.log('-------------------------------------------');
        console.log(`Usa en Postman -> x-usuario-id: ${resultado.rows[0].id}`);

    } catch (error) {
        if (error.code === '23505') {
            console.error('\nEl administrador de pruebas ya existe en la base de datos.');
        } else {
            console.error('\nError en la inserción:', error.message);
        }
    } finally {
        // Cerramos el pool para liberar la terminal
        await pool.end();
        console.log('Conexión finalizada.');
    }
}

crearUsuarioAdmin();