const http = require('http');

const users = [
  {
    username: 'admin_test',
    password: '123456',
    nombre_completo: 'Admin de Pruebas',
    email: 'admin@test.com',
    dni: '12345678',
    rol: 'admin',
    ubigeo: '150101',
    zona: 'Lima Centro'
  },
  {
    username: 'user_test',
    password: '123456',
    nombre_completo: 'Usuario de Pruebas',
    email: 'user@test.com',
    dni: '87654321',
    rol: 'usuario',
    ubigeo: '150101',
    zona: 'San Isidro'
  }
];

function postUser(userData) {
  const data = JSON.stringify(userData);
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/usuarios',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log('Status for ' + userData.username + ': ' + res.statusCode);
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (error) => {
    console.error('Error seeding ' + userData.username + ': ' + error.message);
  });

  req.write(data);
  req.end();
}

users.forEach(postUser);
