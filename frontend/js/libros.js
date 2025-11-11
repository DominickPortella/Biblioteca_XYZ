// Configuración de la API
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : `https://${window.location.hostname}`;
const API_URL = `${API_BASE}/api/libros`;

// Función para cargar todos los libros
async function cargarLibros() {
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
        mostrarLibrosEnTabla(libros);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('librosTableBody').innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i>❌</i>
                        <p>Error al cargar los libros</p>
                        <small>Intenta recargar la página</small>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Función para mostrar libros en la tabla
function mostrarLibrosEnTabla(libros) {
    const tbody = document.getElementById('librosTableBody');
    
    if (libros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i>📚</i>
                        <p>No hay libros en la biblioteca</p>
                        <small>Agrega el primer libro usando el botón "Agregar Libro"</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = libros.map(libro => `
        <tr>
            <td>${libro.id}</td>
            <td><strong>${libro.titulo}</strong></td>
            <td>${libro.autor}</td>
            <td>
                <span class="availability ${getAvailabilityClass(libro.cantidad)}">
                    ${getAvailabilityText(libro.cantidad)}
                </span>
            </td>
            <td>${libro.cantidad}</td>
            <td>
                <div class="book-actions">
                    <button class="action-btn prestamo-btn" onclick="solicitarPrestamo(${libro.id})" 
                            ${libro.cantidad <= 0 ? 'disabled' : ''}>
                        Préstamo
                    </button>
                    <button class="action-btn edit-btn" onclick="editarLibro(${libro.id})">
                        Editar
                    </button>
                    <button class="action-btn delete-btn" onclick="eliminarLibro(${libro.id})">
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Función para determinar la clase de disponibilidad
function getAvailabilityClass(cantidad) {
    if (cantidad > 5) return 'available';
    if (cantidad > 0) return 'low-stock';
    return 'no-stock';
}

// Función para determinar el texto de disponibilidad
function getAvailabilityText(cantidad) {
    if (cantidad > 5) return 'Disponible';
    if (cantidad > 0) return 'Poco Stock';
    return 'No Disponible';
}

// Función para mostrar modal de agregar libro
function mostrarModalAgregar() {
    document.getElementById('modalAgregarLibro').style.display = 'block';
}

// Función para cerrar modal de agregar libro
function cerrarModalAgregar() {
    document.getElementById('modalAgregarLibro').style.display = 'none';
    document.getElementById('formAgregarLibro').reset();
}

// Función para agregar libro
document.getElementById('formAgregarLibro').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const libroData = {
        titulo: formData.get('titulo'),
        autor: formData.get('autor'),
        cantidad: parseInt(formData.get('cantidad'))
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(libroData)
        });

        if (response.ok) {
            cerrarModalAgregar();
            alert('Libro agregado correctamente');
            cargarLibros(); // Recargar la lista
        } else {
            const error = await response.json();
            alert(error.error || 'Error al agregar el libro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
});

// Función para solicitar préstamo
function solicitarPrestamo(libroId) {
    alert(`Solicitud de préstamo para el libro ID: ${libroId}\n\nEsta función estará disponible pronto.`);
    // Aquí puedes redirigir a préstamos.html o implementar la lógica
}

// Función para editar libro (placeholder)
function editarLibro(libroId) {
    alert(`Editar libro ID: ${libroId}\n\nFuncionalidad en desarrollo.`);
}

// Función para eliminar libro (placeholder)
function eliminarLibro(libroId) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        alert(`Eliminar libro ID: ${libroId}\n\nFuncionalidad en desarrollo.`);
    }
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

// Cargar libros cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    cargarLibros();
});

// Cerrar modales al hacer click fuera
window.onclick = function(event) {
    const modalAgregar = document.getElementById('modalAgregarLibro');
    const modalConfirm = document.getElementById('confirmModal');
    
    if (event.target === modalAgregar) {
        cerrarModalAgregar();
    }
    if (event.target === modalConfirm) {
        closeConfirmModal();
    }
};