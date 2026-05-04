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
    'agregar': 'Agregar nuevo registro',
    'historial-medico': 'Historial médico completo',
    'mis-datos': 'Información personal'
  };
  const el = document.getElementById('dashboard-subtitle');
  if (el) el.textContent = subtitulos[sectionId] || '';

  // Cerrar sidebar en móvil al navegar
  if (window.innerWidth <= 900) closeSidebar();

  return false;
}

// ===== SESIÓN (funciones reutilizables en otras páginas) =====

function toggleForms() {
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  if (loginSection && registerSection) {
    loginSection.style.display = loginSection.style.display === 'none' ? 'block' : 'none';
    registerSection.style.display = registerSection.style.display === 'none' ? 'block' : 'none';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email')?.value || '';
  const password = document.getElementById('login-password')?.value || '';

  if (!email || !password) { alert('Por favor completa todos los campos'); return; }
  if (!validateEmail(email)) { alert('Por favor ingresa un email válido'); return; }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) { alert('Email o contraseña incorrectos'); return; }

  localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  mostrarDashboard(usuario);
}

function handleRegister(event) {
  event.preventDefault();
  const nombre = document.getElementById('reg-nombre')?.value || '';
  const email = document.getElementById('reg-email')?.value || '';
  const telefono = document.getElementById('reg-telefono')?.value || '';
  const password = document.getElementById('reg-password')?.value || '';

  if (!nombre || !email || !telefono || !password) { alert('Por favor completa todos los campos'); return; }
  if (!validateEmail(email)) { alert('Por favor ingresa un email válido'); return; }
  if (password.length < 6) { alert('La contraseña debe tener al menos 6 caracteres'); return; }

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
    'user-name': usuario.nombre,
    'dash-email': usuario.email,
    'dash-telefono': usuario.telefono,
    'dash-plan': usuario.plan
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
  const nombre = document.getElementById('nombre')?.value || '';
  const email = document.getElementById('email')?.value || '';
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

// ===== SESION DEMO: simula DB de doctores para la selección de búsqueda =====

const doctoresDB = {
  ginecologo: [
    {nombre:"Dra. Ana Pérez", tel:"809-555-1111", acepta:true, clinica:"CEDIMAT"},
    {nombre:"Dra. María López", tel:"809-555-2222", acepta:false, clinica:"Clínica Abreu"},
    {nombre:"Dra. Carla Díaz", tel:"809-555-3333", acepta:true, clinica:"Centro Médico UCE"},
    {nombre:"Dra. Laura Gómez", tel:"809-555-3344", acepta:true, clinica:"Clínica Independencia"},
    {nombre:"Dra. Patricia Ruiz", tel:"809-555-3355", acepta:false, clinica:"Centro Médico Dominicano"}
  ],

  cirujano: [
    {nombre:"Dr. Luis Gómez", tel:"809-555-4444", acepta:true, clinica:"Hospital Plaza de la Salud"},
    {nombre:"Dr. Pedro Sánchez", tel:"809-555-5555", acepta:false, clinica:"Clínica Independencia"},
    {nombre:"Dr. Juan Reyes", tel:"809-555-6666", acepta:true, clinica:"Clínica Corazones Unidos"},
    {nombre:"Dr. Andrés Batista", tel:"809-555-6677", acepta:true, clinica:"CEDIMAT"},
    {nombre:"Dr. Manuel Torres", tel:"809-555-6688", acepta:false, clinica:"Centro Médico UCE"}
  ],

  cardiologo: [
    {nombre:"Dr. Miguel Torres", tel:"809-555-7777", acepta:true, clinica:"Clínica Corazones Unidos"},
    {nombre:"Dr. José Ramírez", tel:"809-555-8888", acepta:true, clinica:"CEDIMAT"},
    {nombre:"Dr. Carlos Ruiz", tel:"809-555-9999", acepta:false, clinica:"Centro Médico Dominicano"},
    {nombre:"Dr. Felipe Castro", tel:"809-555-9900", acepta:true, clinica:"Hospital Plaza de la Salud"}
  ],

  pediatra: [
    {nombre:"Dra. Laura Castillo", tel:"809-555-1010", acepta:true, clinica:"Hospital Robert Reid Cabral"},
    {nombre:"Dr. Andrés Mejía", tel:"809-555-2020", acepta:true, clinica:"Clínica Abreu"},
    {nombre:"Dra. Rosa Núñez", tel:"809-555-3030", acepta:false, clinica:"Centro Médico UCE"},
    {nombre:"Dra. Karla Pérez", tel:"809-555-3040", acepta:true, clinica:"CEDIMAT"}
  ],

  dermatologo: [
    {nombre:"Dr. Kevin Rosario", tel:"809-555-4040", acepta:true, clinica:"CEDIMAT"},
    {nombre:"Dra. Elena Vargas", tel:"809-555-5050", acepta:true, clinica:"Clínica Independencia"},
    {nombre:"Dr. Julio Marte", tel:"809-555-6060", acepta:false, clinica:"Centro Médico Dominicano"},
    {nombre:"Dra. Sofía León", tel:"809-555-6070", acepta:true, clinica:"Clínica Abreu"}
  ],

  odontologo: [
    {nombre:"Dr. Rafael Cruz", tel:"809-555-7070", acepta:true, clinica:"Clínica Dental SD"},
    {nombre:"Dra. Patricia León", tel:"809-555-8080", acepta:true, clinica:"Centro Odontológico Moderno"},
    {nombre:"Dr. Manuel Soto", tel:"809-555-9090", acepta:false, clinica:"Clínica Abreu"},
    {nombre:"Dr. Luis Medina", tel:"809-555-9091", acepta:true, clinica:"CEDIMAT"}
  ],

  neurologo: [
    {nombre:"Dr. Héctor Peña", tel:"809-555-1112", acepta:true, clinica:"CEDIMAT"},
    {nombre:"Dra. Sonia Gil", tel:"809-555-1313", acepta:false, clinica:"Hospital Plaza de la Salud"},
    {nombre:"Dr. Mario Valdez", tel:"809-555-1414", acepta:true, clinica:"Centro Médico UCE"},
    {nombre:"Dr. Pablo Ortiz", tel:"809-555-1415", acepta:true, clinica:"Clínica Independencia"}
  ],

  psiquiatra: [
    {nombre:"Dra. Carmen Ruiz", tel:"809-555-1515", acepta:true, clinica:"Clínica Abreu"},
    {nombre:"Dr. Diego Herrera", tel:"809-555-1616", acepta:true, clinica:"Centro Médico Dominicano"},
    {nombre:"Dra. Paula Méndez", tel:"809-555-1717", acepta:false, clinica:"CEDIMAT"},
    {nombre:"Dr. Luis Cabrera", tel:"809-555-1718", acepta:true, clinica:"Hospital Plaza de la Salud"}
  ],

  oftalmologo: [
    {nombre:"Dr. Ricardo Paredes", tel:"809-555-1818", acepta:true, clinica:"Centro Láser"},
    {nombre:"Dra. Isabel Franco", tel:"809-555-1919", acepta:true, clinica:"Clínica Independencia"},
    {nombre:"Dr. Nelson Cabrera", tel:"809-555-2021", acepta:false, clinica:"Clínica Abreu"},
    {nombre:"Dra. Julia Ramos", tel:"809-555-2022", acepta:true, clinica:"CEDIMAT"}
  ],

  urologo: [
    {nombre:"Dr. Victor Santana", tel:"809-555-2121", acepta:true, clinica:"CEDIMAT"},
    {nombre:"Dr. Luis Batista", tel:"809-555-2223", acepta:true, clinica:"Centro Médico Dominicano"},
    {nombre:"Dr. Omar Peralta", tel:"809-555-2323", acepta:false, clinica:"Hospital Plaza de la Salud"},
    {nombre:"Dr. Enrique Soto", tel:"809-555-2324", acepta:true, clinica:"Clínica Independencia"}
  ]
};

// FUNCIÓN PRINCIPAL
function buscarDoctores() {
  const especialidad = document.getElementById("filtro-especialidad").value;
  const contenedor = document.getElementById("lista-doctores");

  contenedor.innerHTML = "";

  const lista = doctoresDB[especialidad];

  lista.forEach(doc => {
    contenedor.innerHTML += `
      <div class="doctor-card">
        <div class="doctor-info">
          <div class="doctor-nombre">${doc.nombre}</div>
          <div class="${doc.acepta ? 'badge-activo' : 'badge-inactivo'}">
            ${doc.acepta ? 'Acepta pacientes nuevos' : 'No acepta pacientes nuevos'}
          </div>
          <div>Tel: ${doc.tel}</div>
          <div>Especialidad: ${especialidad}</div>
        </div>

        <div class="doctor-right">
          <div><strong>Centro:</strong> ${doc.clinica}</div>
        </div>
      </div>
    `;
  });
}