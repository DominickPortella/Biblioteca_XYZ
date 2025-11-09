// Detecta automáticamente el backend (local o producción)
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : `https://${window.location.hostname}`;

const form = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    mensaje.textContent = 'Por favor, completa todos los campos.';
    mensaje.style.color = 'red';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    mensaje.textContent = data.message || data.error;

    if (response.ok) {
      mensaje.style.color = 'green';
      localStorage.setItem('token', data.token);
      setTimeout(() => (window.location.href = 'index.html'), 1000);
    } else {
      mensaje.style.color = 'red';
    }
  } catch (error) {
    console.error('Error en login:', error);
    mensaje.textContent = 'Error al conectar con el servidor.';
    mensaje.style.color = 'red';
  }
});
