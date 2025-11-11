// backend/routes/prestamos.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middlewares/auth');

// Crear préstamo (usuario autenticado)
router.post('/', auth, (req, res) => {
  const usuarioId = req.user.id;
  const { libro_id } = req.body;
  if (!libro_id) return res.status(400).json({ error: 'libro_id es requerido' });

  db.query('SELECT * FROM libros WHERE id = ?', [libro_id], (err, libros) => {
    if (err) return res.status(500).json({ error: 'Error en DB' });
    if (!libros.length) return res.status(404).json({ error: 'Libro no encontrado' });
    const libro = libros[0];
    if ((libro.cantidad || 0) <= 0) return res.status(400).json({ error: 'No hay ejemplares disponibles' });

    const fecha_prestamo = new Date().toISOString().slice(0,10);
    db.query(
      'INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, fecha_devolucion, devuelto) VALUES (?, ?, ?, NULL, 0)',
      [usuarioId, libro_id, fecha_prestamo],
      (err2, result) => {
        if (err2) return res.status(500).json({ error: 'Error al crear préstamo' });

        const nuevaCantidad = (libro.cantidad || 0) - 1;
        db.query('UPDATE libros SET cantidad = ? WHERE id = ?', [nuevaCantidad, libro_id], (err3) => {
          if (err3) return res.status(500).json({ error: 'Error al actualizar stock' });
          res.json({ message: 'Préstamo registrado', prestamoId: result.insertId, newCantidad: nuevaCantidad });
        });
      }
    );
  });
});

// Devolver libro: marca el préstamo activo (no devuelto) como devuelto para el usuario y libro
router.post('/devolver', auth, (req, res) => {
  const usuarioId = req.user.id;
  const { libro_id } = req.body;
  if (!libro_id) return res.status(400).json({ error: 'libro_id es requerido' });

  // buscar préstamo activo del usuario y libro (el más reciente)
  db.query(
    `SELECT * FROM prestamos WHERE usuario_id = ? AND libro_id = ? AND devuelto = 0 ORDER BY id DESC LIMIT 1`,
    [usuarioId, libro_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error DB' });
      if (!rows.length) return res.status(404).json({ error: 'No se encontró préstamo activo para este libro' });

      const prestamo = rows[0];
      const fecha_devolucion = new Date().toISOString().slice(0,10);
      db.query(
        'UPDATE prestamos SET devuelto = 1, fecha_devolucion = ? WHERE id = ?',
        [fecha_devolucion, prestamo.id],
        (err2) => {
          if (err2) return res.status(500).json({ error: 'Error al actualizar préstamo' });

          // incrementar stock
          db.query('UPDATE libros SET cantidad = cantidad + 1 WHERE id = ?', [libro_id], (err3) => {
            if (err3) return res.status(500).json({ error: 'Error al actualizar stock' });
            res.json({ message: 'Libro devuelto correctamente', prestamoId: prestamo.id });
          });
        }
      );
    }
  );
});

// Obtener préstamos: admin = todos, user = solo suyos
router.get('/', auth, (req, res) => {
  if (req.user.role === 'admin') {
    const sql = `SELECT p.id, u.email AS usuario, l.titulo AS libro, p.fecha_prestamo, p.fecha_devolucion, p.devuelto
                 FROM prestamos p
                 LEFT JOIN usuarios u ON p.usuario_id = u.id
                 LEFT JOIN libros l ON p.libro_id = l.id
                 ORDER BY p.id DESC`;
    db.query(sql, (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    });
  } else {
    const sql = `SELECT p.id, l.titulo AS libro, p.fecha_prestamo, p.fecha_devolucion, p.devuelto
                 FROM prestamos p
                 LEFT JOIN libros l ON p.libro_id = l.id
                 WHERE p.usuario_id = ?
                 ORDER BY p.id DESC`;
    db.query(sql, [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    });
  }
});

module.exports = router;
