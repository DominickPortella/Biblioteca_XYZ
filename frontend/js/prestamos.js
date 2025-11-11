// frontend/js/prestamos.js

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : `https://${window.location.hostname}`;

const totalPrestamos = document.getElementById('totalPrestamos');
const libroMasPrestado = document.getElementById('libroMasPrestado');
const prestamosActivos = document.getElementById('prestamosActivos');
const prestamosChartCanvas = document.getElementById('prestamosChart').getContext('2d');

// Fetch de préstamos desde el backend
async function fetchPrestamos() {
  const res = await fetch(`${API_BASE}/api/prestamos`);
  if (!res.ok) {
    showMessage('⚠️ Error al cargar los préstamos.', 'error');
    return [];
  }
  return await res.json();
}

// Fetch de libros desde el backend para encontrar el libro más prestado
async function fetchLibros() {
  const res = await fetch(`${API_BASE}/api/libros`);
  if (!res.ok) {
    showMessage('⚠️ Error al cargar los libros.', 'error');
    return [];
  }
  return await res.json();
}

// Mostrar mensajes de éxito o error
function showMessage(text, type = 'info') {
  msg.textContent = text;
  msg.className = `msg ${type}`;
  setTimeout(() => { msg.textContent = ''; }, 2500);
}

// Cargar estadísticas y gráficos
async function loadStats() {
  const prestamos = await fetchPrestamos();
  const libros = await fetchLibros();

  // Total de Préstamos
  totalPrestamos.textContent = prestamos.length;

  // Préstamos Activos (no devueltos)
  const prestamosActivosCount = prestamos.filter(p => !p.devuelto).length;
  prestamosActivos.textContent = prestamosActivosCount;

  // Libro Más Prestado
  const libroPrestadoCount = libros.map(libro => {
    const vecesPrestado = prestamos.filter(p => p.libro_id === libro.id).length;
    return { ...libro, vecesPrestado };
  });
  
  const libroMasPrestadoData = libroPrestadoCount.sort((a, b) => b.vecesPrestado - a.vecesPrestado)[0];
  libroMasPrestado.textContent = libroMasPrestadoData ? `${libroMasPrestadoData.titulo} (${libroMasPrestadoData.vecesPrestado} veces)` : 'N/A';

  // Gráfico de libros más prestados
  const libroNombres = libroPrestadoCount.map(libro => libro.titulo);
  const libroVecesPrestado = libroPrestadoCount.map(libro => libro.vecesPrestado);

  const prestamosChart = new Chart(prestamosChartCanvas, {
    type: 'bar',
    data: {
      labels: libroNombres,
      datasets: [{
        label: 'Veces Prestado',
        data: libroVecesPrestado,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Cargar las estadísticas al cargar la página
window.addEventListener('load', loadStats);
