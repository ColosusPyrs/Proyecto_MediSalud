// ===== VALIDACIONES =====

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ===== NAVBAR HAMBURGER (móvil) =====

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.classList.toggle('active');
}

// ===== SIDEBAR =====

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

function showSection(sectionId, linkEl) {
  // Ocultar todas las secciones
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));

  // Mostrar la sección seleccionada
  const target = document.getElementById('section-' + sectionId);
  if (target) target.classList.add('active');

  // Actualizar enlace activo en sidebar
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');

  // Actualizar subtítulo del header
  const subtitulos = {
    'resumen-estadisticas': 'Resumen de estadísticas',
    'agregar':              'Agregar nuevo registro',
    'historial-medico':     'Historial médico completo',
    'mis-datos':            'Información personal'
  };
  const el = document.getElementById('dashboard-subtitle');
  if (el) el.textContent = subtitulos[sectionId] || '';

  // Cerrar sidebar en móvil al navegar
  if (window.innerWidth <= 900) closeSidebar();

  return false;
}

// ===== SESIÓN (funciones reutilizables en otras páginas) =====

function toggleForms() {
  const loginSection    = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  if (loginSection && registerSection) {
    loginSection.style.display    = loginSection.style.display    === 'none' ? 'block' : 'none';
    registerSection.style.display = registerSection.style.display === 'none' ? 'block' : 'none';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const email    = document.getElementById('login-email')?.value    || '';
  const password = document.getElementById('login-password')?.value || '';

  if (!email || !password) { alert('Por favor completa todos los campos'); return; }
  if (!validateEmail(email)) { alert('Por favor ingresa un email válido'); return; }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const usuario  = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) { alert('Email o contraseña incorrectos'); return; }

  localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  mostrarDashboard(usuario);
}

function handleRegister(event) {
  event.preventDefault();
  const nombre   = document.getElementById('reg-nombre')?.value    || '';
  const email    = document.getElementById('reg-email')?.value     || '';
  const telefono = document.getElementById('reg-telefono')?.value  || '';
  const password = document.getElementById('reg-password')?.value  || '';

  if (!nombre || !email || !telefono || !password) { alert('Por favor completa todos los campos'); return; }
  if (!validateEmail(email))  { alert('Por favor ingresa un email válido'); return; }
  if (password.length < 6)    { alert('La contraseña debe tener al menos 6 caracteres'); return; }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  if (usuarios.some(u => u.email === email)) { alert('Este email ya está registrado'); return; }

  usuarios.push({
    id: Date.now(), nombre, email, telefono, password,
    plan: 'Plan Básico',
    fechaRegistro: new Date().toLocaleDateString()
  });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert('¡Registro exitoso! Ahora inicia sesión');
  toggleForms();
  const le = document.getElementById('login-email');
  const lp = document.getElementById('login-password');
  if (le) le.value = '';
  if (lp) lp.value = '';
}

function mostrarDashboard(usuario) {
  ['login-section', 'register-section'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const dash = document.getElementById('dashboard-section');
  if (dash) dash.style.display = 'block';

  const map = {
    'user-name':      usuario.nombre,
    'dash-email':     usuario.email,
    'dash-telefono':  usuario.telefono,
    'dash-plan':      usuario.plan
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}

// ===== LOGOUT =====

function handleLogout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    localStorage.removeItem('usuarioActual');
    window.location.href = 'index.html';
  }
}

// ===== CONTACTO =====

function handleContactForm(event) {
  event.preventDefault();
  const nombre  = document.getElementById('nombre')?.value  || '';
  const email   = document.getElementById('email')?.value   || '';
  const mensaje = document.getElementById('mensaje')?.value || '';

  if (!nombre || !email || !mensaje) { alert('Por favor completa todos los campos'); return; }
  if (!validateEmail(email)) { alert('Por favor ingresa un email válido'); return; }

  const contactos = JSON.parse(localStorage.getItem('contactos') || '[]');
  contactos.push({ id: Date.now(), nombre, email, mensaje, fecha: new Date().toLocaleDateString() });
  localStorage.setItem('contactos', JSON.stringify(contactos));

  alert('¡Mensaje enviado! Nos pondremos en contacto pronto.');
  event.target.reset();
}

// ===== INICIALIZAR AL CARGAR PÁGINA =====

document.addEventListener('DOMContentLoaded', function () {
  const usuarioActual = localStorage.getItem('usuarioActual');
  if (usuarioActual && window.location.pathname.includes('sesiondemo')) {
    mostrarDashboard(JSON.parse(usuarioActual));
  }
});
