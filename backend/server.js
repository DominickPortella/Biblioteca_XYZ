const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Servidor Biblioteca XYZ funcionando correctamente');
});

// Rutas
const usuariosRoutes = require('./routes/usuarios');
const librosRoutes = require('./routes/libros');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/libros', librosRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
