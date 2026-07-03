const bcrypt = require('bcryptjs');

/**
 * Genera un hash seguro para una contraseña en texto plano
 */
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara una contraseña en texto plano con el hash guardado en la BD
 */
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword
};