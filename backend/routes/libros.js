const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middlewares/auth');

// 📘 OBTENER TODOS LOS LIBROS
router.get('/', auth, (req, res) => {
  db.query('SELECT * FROM libros', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los libros' });
    res.json(results);
  });
});

// ➕ AGREGAR NUEVO LIBRO
router.post('/', auth, (req, res) => {
  const { titulo, autor, cantidad } = req.body;

  if (!titulo || !autor || !cantidad)
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });

  db.query(
    'INSERT INTO libros (titulo, autor, cantidad) VALUES (?, ?, ?)',
    [titulo, autor, cantidad],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al agregar el libro' });
      res.json({ message: 'Libro agregado correctamente' });
    }
  );
});

// ✏️ EDITAR LIBRO
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { titulo, autor, cantidad } = req.body;

  db.query(
    'UPDATE libros SET titulo=?, autor=?, cantidad=? WHERE id=?',
    [titulo, autor, cantidad, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar libro' });
      res.json({ message: 'Libro actualizado correctamente' });
    }
  );
});

// ❌ ELIMINAR LIBRO
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM libros WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar libro' });
    res.json({ message: 'Libro eliminado correctamente' });
  });
});

module.exports = router;
