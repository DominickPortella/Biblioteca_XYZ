// frontend/js/registro_libro.js

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : `https://${window.location.hostname}`;

const table = document.querySelector('#librosTable tbody');
const msg = document.getElementById('msg');
const form = document.getElementById('bookForm');
const idField = document.getElementById('bookId');
const titulo = document.getElementById('titulo');
const autor = document.getElementById('autor');
const cantidad = document.getElementById('cantidad');

// Obtener el token JWT de localStorage
const getToken = () => localStorage.getItem('token');

// Mostrar mensajes de éxito o error
function showMessage(text, type = 'info') {
  msg.textContent = text;
  msg.className = `msg ${type}`;
  setTimeout(() => { msg.textContent = ''; }, 2500);
}

// Fetch libros desde la base de datos
async function fetchLibros() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/libros`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Enviar token en la cabecera
    }
  });

  if (!res.ok) {
    showMessage('⚠️ Error al cargar los libros.', 'error');
    return [];
  }

  return await res.json();  // Devolver los resultados de los libros
}

// Renderizar la tabla de libros
async function renderLibros() {
  const libros = await fetchLibros();
  if (!libros.length) {
    table.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay libros registrados.</td></tr>`;
    return;
  }

  table.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos libros
  libros.forEach(lib => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${lib.id}</td>
      <td>${lib.titulo}</td>
      <td>${lib.autor}</td>
      <td>${lib.cantidad}</td>
      <td>
        <button onclick="editarLibro(${lib.id}, '${lib.titulo}', '${lib.autor}', ${lib.cantidad})">✏️</button>
        <button onclick="eliminarLibro(${lib.id})">🗑️</button>
      </td>`;
    table.appendChild(tr);
  });
}

// Crear un libro nuevo
async function crearLibro(data) {
  const token = getToken();  // Obtener el token del localStorage
  const res = await fetch(`${API_BASE}/api/libros`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Enviar token en la cabecera
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Actualizar los datos de un libro
async function actualizarLibro(id, data) {
  const token = getToken();  // Obtener el token del localStorage
  const res = await fetch(`${API_BASE}/api/libros/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Enviar token en la cabecera
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Eliminar un libro
async function eliminarLibro(id) {
  const token = getToken();  // Obtener el token del localStorage
  if (!confirm('¿Seguro que deseas eliminar este libro?')) return;

  const res = await fetch(`${API_BASE}/api/libros/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,  // Enviar token en la cabecera
    },
  });
  
  const data = await res.json();
  showMessage(data.message || 'Libro eliminado', 'success');
  renderLibros(); // Refrescar la lista de libros
}

// Editar un libro existente
function editarLibro(id, t, a, c) {
  idField.value = id;
  titulo.value = t;
  autor.value = a;
  cantidad.value = c;
  form.querySelector('button').textContent = 'Actualizar'; // Cambiar texto del botón a "Actualizar"
}

// Evento para el formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = { titulo: titulo.value, autor: autor.value, cantidad: parseInt(cantidad.value) };

  let resp;
  if (idField.value) {
    resp = await actualizarLibro(idField.value, data);  // Actualizar libro
    showMessage(resp.message || 'Libro actualizado', 'success');
  } else {
    resp = await crearLibro(data);  // Crear nuevo libro
    showMessage(resp.message || 'Libro creado', 'success');
  }

  // Limpiar el formulario
  idField.value = '';
  form.reset();
  form.querySelector('button').textContent = 'Guardar';  // Cambiar botón a "Guardar"
  renderLibros();  // Refrescar la lista de libros
});

// Cargar los libros al cargar la página
renderLibros();
