// ======== SCRIPT DE INTERACCIÓN ========
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');

// Abrir / cerrar sidebar
menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  menuBtn.classList.toggle('active');
});

// Cerrar sidebar si se hace clic fuera (en pantallas pequeñas)
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove('open');
    menuBtn.classList.remove('active');
  }
});
