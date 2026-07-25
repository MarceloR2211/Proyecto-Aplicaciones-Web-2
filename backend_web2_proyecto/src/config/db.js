const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({
    path: path.resolve(__dirname, '.env')
});

const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL
    }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST || 'localhost',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 5432
    };

const pool = new Pool(config);

pool.query('SELECT NOW()')
    .then(() => {
        console.log('Conexión exitosa a PostgreSQL');
    })
    .catch(error => {
        console.error(
            'Error crítico en PostgreSQL:',
            error.message
        );
    });

module.exports = pool;