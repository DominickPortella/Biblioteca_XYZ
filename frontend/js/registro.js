const form = document.getElementById('formRegistro');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/usuarios/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await response.json();
    mensaje.textContent = data.message || data.error;

    if (response.ok) {
      mensaje.style.color = 'green';
      setTimeout(() => (window.location.href = 'login.html'), 1500);
    } else {
      mensaje.style.color = 'red';
    }
  } catch (error) {
    mensaje.textContent = 'Error al conectar con el servidor';
    mensaje.style.color = 'red';
  }
});
