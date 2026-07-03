const path = require('path');
// Busca de forma exacta el archivo .env dentro de su misma carpeta (src/config/.env)
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 5432
});

// Verificación inicial de conexión
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error crítico en PostgreSQL:', err.message);
    } else {
        console.log('Conexión exitosa a PostgreSQL en la base de datos: ' + process.env.DB_NAME);
    }
});

module.exports = pool;