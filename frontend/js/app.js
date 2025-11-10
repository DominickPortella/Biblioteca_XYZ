// Detecta automáticamente el backend en el puerto 3000
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : `https://${window.location.hostname}`; // para despliegue futuro
const API_URL = `${API_BASE}/api/libros`;

// Función para mostrar modal de éxito
function showSuccessModal() {
    showModal('¡Éxito!', 'Libro agregado correctamente', 'success');
}

// Función para mostrar modal de error
function showErrorModal(message) {
    showModal('Error', message, 'error');
}

// Función para mostrar modal de confirmación
function showConfirmModal(title, message, onConfirm) {
    // Crear modal de confirmación dinámicamente si no existe
    let modal = document.getElementById('confirmModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-confirm">
                <div class="modal-icon">🔐</div>
                <h3 id="confirmTitle">Título</h3>
                <p id="confirmMessage">Mensaje</p>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-cancel" onclick="closeConfirmModal()">Cancelar</button>
                    <button class="modal-btn modal-btn-confirm" id="confirmActionBtn">Confirmar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer click fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeConfirmModal();
            }
        });
    }
    
    // Configurar contenido
    const modalTitle = modal.querySelector('#confirmTitle');
    const modalMessage = modal.querySelector('#confirmMessage');
    const confirmBtn = modal.querySelector('#confirmActionBtn');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Configurar el evento de confirmación
    confirmBtn.onclick = function() {
        closeConfirmModal();
        onConfirm();
    };
    
    modal.style.display = 'block';
}

// Función para cerrar modal de confirmación
function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función general para mostrar modales
function showModal(title, message, type) {
    // Crear modal dinámicamente si no existe
    let modal = document.getElementById('customModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'customModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon" id="modalIcon">📚</div>
                <h3 id="modalTitle">Título</h3>
                <p id="modalMessage">Mensaje</p>
                <button class="close-modal" onclick="closeModal()">Aceptar</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer click fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Configurar contenido según el tipo
    const modalContent = modal.querySelector('.modal-content');
    const modalIcon = modal.querySelector('#modalIcon');
    const modalTitle = modal.querySelector('#modalTitle');
    const modalMessage = modal.querySelector('#modalMessage');
    
    // Estilos según el tipo
    if (type === 'success') {
        modalContent.className = 'modal-content modal-success';
        modalIcon.textContent = '📚';
        modalTitle.style.color = '#2E7D32';
    } else {
        modalContent.className = 'modal-content modal-error';
        modalIcon.textContent = '⚠️';
        modalTitle.style.color = '#D32F2F';
    }
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'block';
    
    // Cerrar automáticamente después de 3 segundos
    setTimeout(() => {
        closeModal();
    }, 3000);
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para obtener todos los libros
async function obtenerLibros() {
  const token = localStorage.getItem('token');
  if (!token) {
    showErrorModal('No hay token. Inicia sesión primero.');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
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
    showErrorModal('Error al conectar con el servidor.');
  }
}

// Función para agregar un libro nuevo
async function agregarLibro() {
  const token = localStorage.getItem('token');
  const titulo = document.getElementById('titulo').value.trim();
  const autor = document.getElementById('autor').value.trim();
  const cantidad = document.getElementById('cantidad').value.trim();

  // Validaciones básicas - ahora con modal de error
  if (!titulo || !autor || !cantidad) {
    showErrorModal('Por favor, completa todos los campos.');
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
      showSuccessModal();
      
      document.getElementById('titulo').value = '';
      document.getElementById('autor').value = '';
      document.getElementById('cantidad').value = '';
      obtenerLibros();
    } else {
      showErrorModal(data.error || 'Error al agregar el libro');
    }
  } catch (err) {
    console.error('Error al agregar libro:', err);
    showErrorModal('Error al conectar con el servidor.');
  }
}

// Cerrar sesión CON MODAL DE CONFIRMACIÓN
function logout() {
  showConfirmModal(
    'Cerrar Sesión', 
    '¿Estás seguro de que deseas cerrar sesión?', 
    function() {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
  );
}

// Cuando se cargue la página, obtener libros
window.onload = obtenerLibros;