// index.js

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { expires: new Date('2024-02-22') }
}));

let data = [
  { id: 1, 
    tipo: 'Pino', 
    color: 'Verde', 
    nombre: 'Pino Navideño' 
},
  { id: 2, 
    tipo: 'Roble', 
    color: 'Marrón', 
    nombre: 'Roble Centenario' 
},
  { id: 3, 
    tipo: 'Palmera', 
    color: 'Verde', 
    nombre: 'Palmera Tropical' 
}];

// Ruta para capturar la cookie y mostrarla en el DOM
app.get('/', (req, res) => {
  res.cookie('cookie_ejemplo', { titulo: 'Una petición HTTP', descripcion: 'La descripción de tu petición HTTP' });
  console.log(req.cookies);
  res.send('Cookie capturada. Revisa la consola del navegador.');
});

// Ruta para imprimir en la consola la cookie cada vez que se visita "/"
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

// Ruta para contar visitas
let count = 0;
app.get('/conteo', (req, res) => {
  count++;
  res.send(`Esta ruta ha sido visitada ${count} veces.`);
});

app.get('/arboles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const arbol = data.find(arbol => arbol.id === id);
  if (!arbol) {
    res.status(404).send('Árbol no encontrado.');
  } else {
    res.json(arbol);
  }
});

app.post('/arboles/nuevo', (req, res) => {
  try {
    const { id, tipo, color, nombre } = req.body;
    if (!id || !tipo || !color || !nombre) {
      res.status(400).send('Faltan campos requeridos.');
    } else {
      const nuevoArbol = { id, tipo, color, nombre };
      data.push(nuevoArbol);
      res.status(201).json(nuevoArbol);
    }
  } catch (error) {
    res.status(500).send('Error interno del servidor.');
  }
});

// Ruta adicional para manejar query parameters y redireccionar si no se proporcionan
app.get('/arboles', (req, res) => {
  const { id, color } = req.query;
  if (!id || !color) {
    res.redirect(302, '/');
  } else {
    const arbol = data.find(arbol => arbol.id === parseInt(id) && arbol.color === color);
    if (!arbol) {
      res.status(404).send('Árbol no encontrado.');
    } else {
      res.json(arbol);
    }
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
