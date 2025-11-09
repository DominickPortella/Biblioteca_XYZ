const form = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/usuarios/login', {
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
    mensaje.textContent = 'Error al conectar con el servidor';
    mensaje.style.color = 'red';
  }
});
