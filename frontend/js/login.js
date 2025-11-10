// ===== login.js =====

document.getElementById('loginBtn').addEventListener('click', login);

async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const msg = document.getElementById('msg');

  msg.textContent = ''; // limpiar mensajes previos

  if (!email || !password) {
    msg.textContent = 'Por favor completa todos los campos.';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } else {
      msg.textContent = data.error || 'Credenciales incorrectas.';
    }
  } catch (error) {
    msg.textContent = 'Error de conexión con el servidor.';
  }
}
