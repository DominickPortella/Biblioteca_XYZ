const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ➕ Registro
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ error: 'El correo ya está registrado' });

          console.error('Error MySQL:', err);
          return res.status(500).json({ error: 'Error al registrar usuario' });
        }

        res.json({ message: 'Usuario registrado correctamente' });
      }
    );
  } catch (error) {
    console.error('Error en /register:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// 🔑 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Error MySQL:', err);
        return res.status(500).json({ error: 'Error al buscar usuario' });
      }

      if (results.length === 0)
        return res.status(401).json({ error: 'Usuario no encontrado' });

      const usuario = results[0];
      const isMatch = await bcrypt.compare(password, usuario.password);

      if (!isMatch)
        return res.status(401).json({ error: 'Contraseña incorrecta' });

      // Generar token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || 'biblioteca123',
        { expiresIn: '2h' }
      );

      res.json({
        message: 'Inicio de sesión exitoso',
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email
        },
        token
      });
    });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
