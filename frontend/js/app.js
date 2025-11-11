// ======== MANEJO DEL MENÚ LATERAL ========
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  menuBtn.classList.toggle('active');
});

// Cerrar sidebar al hacer click fuera (solo si está abierto)
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove('open');
    menuBtn.classList.remove('active');
  }
});

// ======== CERRAR SESIÓN ========
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "login.html";
  });
}
