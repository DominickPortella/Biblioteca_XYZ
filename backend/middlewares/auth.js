const jwt = require('jsonwebtoken');
const db = require('../database');  // Asegúrate de tener la referencia a tu base de datos

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verificar el token y decodificarlo
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); 
    req.user = decoded;  // Almacenamos la información del usuario en la solicitud

    // Verificar el rol del usuario en la base de datos
    db.query('SELECT role FROM usuarios WHERE id = ?', [decoded.id], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error al verificar el rol del usuario' });
      }
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Añadimos el rol del usuario al objeto `req.user`
      req.user.role = rows[0].role;  // Aquí se agrega el rol al usuario
      next();  // Continuamos con la solicitud
    });
    
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
