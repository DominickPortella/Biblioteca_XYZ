// Configuración de la API
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : `https://${window.location.hostname}`;
const API_URL = `${API_BASE}/api/libros`;

// Función para cargar libros nuevos (últimos 4 libros agregados)
async function cargarLibrosNuevos() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error al cargar libros');

        const libros = await response.json();
        
        // Ordenar por ID descendente (los más nuevos primero) y tomar 4
        const librosNuevos = libros
            .sort((a, b) => b.id - a.id)
            .slice(0, 4);

        mostrarLibrosNuevos(librosNuevos);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('nuevosLibrosGrid').innerHTML = 
            '<div class="loading">Error al cargar libros nuevos</div>';
    }
}

// Función para mostrar libros nuevos con botón de préstamo
function mostrarLibrosNuevos(libros) {
    const grid = document.getElementById('nuevosLibrosGrid');
    
    if (libros.length === 0) {
        grid.innerHTML = '<div class="loading">No hay libros nuevos disponibles</div>';
        return;
    }

    grid.innerHTML = libros.map(libro => `
        <div class="book-item">
            <div class="book-cover">
                ${libro.titulo.split(' ').slice(0, 2).join(' ')}
            </div>
            <div class="book-title">${libro.titulo}</div>
            <div class="book-author">${libro.autor}</div>
            <button class="prestamo-btn" onclick="solicitarPrestamo(${libro.id})" ${libro.cantidad <= 0 ? 'disabled' : ''}>
                ${libro.cantidad <= 0 ? 'No Disponible' : 'Solicitar Préstamo'}
            </button>
            <div class="book-stats">
                <span>📊 ${libro.cantidad} disp.</span>
            </div>
        </div>
    `).join('');
}

// Función para cargar libros destacados (vacío por ahora)
function cargarLibrosDestacados() {
    const grid = document.getElementById('destacadosLibrosGrid');
    
    grid.innerHTML = `
        <div class="empty-state">
            <i>📊</i>
            <p>Los libros más prestados aparecerán aquí cuando tengas datos de préstamos</p>
            <small>Visita la sección de préstamos para comenzar</small>
        </div>
    `;
}

// Función para solicitar préstamo
function solicitarPrestamo(libroId) {
    // Por ahora redirige a préstamos.html, luego puedes implementar la lógica específica
    alert(`Solicitud de préstamo para el libro ID: ${libroId}\n\nSerás redirigido a la sección de préstamos.`);
    // window.location.href = `prestamos.html?libro=${libroId}`;
    
    // Aquí puedes implementar la lógica de préstamo cuando esté lista
    console.log('Solicitar préstamo para libro:', libroId);
}

// Funciones de logout
function logout() {
    document.getElementById('confirmModal').style.display = 'block';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

function confirmLogout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Cargar los libros cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    cargarLibrosNuevos();
    cargarLibrosDestacados();
});

// Cerrar modal al hacer click fuera
window.onclick = function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        closeConfirmModal();
    }
}