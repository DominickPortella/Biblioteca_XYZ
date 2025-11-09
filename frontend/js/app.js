// Detecta automáticamente el backend en el puerto 3000
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : `https://${window.location.hostname}`; // para despliegue futuro
const API_URL = `${API_BASE}/api/libros`;


// ✅ Función para obtener todos los libros
async function obtenerLibros() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('No hay token. Inicia sesión primero.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    const tbody = document.querySelector('#tablaLibros tbody');
    tbody.innerHTML = '';

    data.forEach((libro) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${libro.id}</td>
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.cantidad}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al obtener libros:', err);
    alert('Error al conectar con el servidor.');
  }
}

// ✅ Función para agregar un libro nuevo
async function agregarLibro() {
  const token = localStorage.getItem('token');
  const titulo = document.getElementById('titulo').value.trim();
  const autor = document.getElementById('autor').value.trim();
  const cantidad = document.getElementById('cantidad').value.trim();

  // Validaciones básicas
  if (!titulo || !autor || !cantidad) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ titulo, autor, cantidad }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('📚 Libro agregado correctamente');
      document.getElementById('titulo').value = '';
      document.getElementById('autor').value = '';
      document.getElementById('cantidad').value = '';
      obtenerLibros();
    } else {
      alert(data.error || 'Error al agregar el libro');
    }
  } catch (err) {
    console.error('Error al agregar libro:', err);
    alert('Error al conectar con el servidor.');
  }
}

// ✅ Cerrar sesión
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// ✅ Cuando se cargue la página, obtener libros
window.onload = obtenerLibros;
