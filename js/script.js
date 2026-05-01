// ===== VALIDACIONES =====

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// ===== SESIÓN DEMO =====

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

  if (!email || !password) {
    alert('Por favor completa todos los campos');
    return;
  }

  if (!validateEmail(email)) {
    alert('Por favor ingresa un email válido');
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    alert('Email o contraseña incorrectos');
    return;
  }

  localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  mostrarDashboard(usuario);
}

function handleRegister(event) {
  event.preventDefault();

  const nombre = document.getElementById('reg-nombre')?.value || '';
  const email = document.getElementById('reg-email')?.value || '';
  const telefono = document.getElementById('reg-telefono')?.value || '';
  const password = document.getElementById('reg-password')?.value || '';

  if (!nombre || !email || !telefono || !password) {
    alert('Por favor completa todos los campos');
    return;
  }

  if (!validateEmail(email)) {
    alert('Por favor ingresa un email válido');
    return;
  }

  if (password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

  if (usuarios.some(u => u.email === email)) {
    alert('Este email ya está registrado');
    return;
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    email,
    telefono,
    password,
    plan: 'Plan Básico',
    fechaRegistro: new Date().toLocaleDateString()
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert('¡Registro exitoso! Ahora inicia sesión');
  toggleForms();

  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
}

function mostrarDashboard(usuario) {
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  const dashboardSection = document.getElementById('dashboard-section');

  if (loginSection) loginSection.style.display = 'none';
  if (registerSection) registerSection.style.display = 'none';
  if (dashboardSection) dashboardSection.style.display = 'block';

  document.getElementById('user-name').textContent = usuario.nombre;
  document.getElementById('dash-email').textContent = usuario.email;
  document.getElementById('dash-telefono').textContent = usuario.telefono;
  document.getElementById('dash-plan').textContent = usuario.plan;

  cargarRegistros(usuario.id);
}

function cargarRegistros(usuarioId) {
  const registros = JSON.parse(localStorage.getItem('registros') || '[]');
  const registrosUsuario = registros.filter(r => r.usuarioId === usuarioId);
  const container = document.getElementById('records-container');

  if (registrosUsuario.length === 0) {
    container.innerHTML = '<p>No hay registros aún.</p>';
    return;
  }

  container.innerHTML = registrosUsuario.map(record => `
    <div class="record-item">
      <div class="record-type">${record.type}</div>
      <div class="record-date">${record.date}</div>
      <div>${record.description}</div>
      <div class="record-cost">RD$ ${record.cost}</div>
      <button class="delete-btn" onclick="deleteRecord(${record.id})">Eliminar</button>
    </div>
  `).join('');
}

function handleAddRecord(event) {
  event.preventDefault();

  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  const type = document.getElementById('record-type')?.value || '';
  const date = document.getElementById('record-date')?.value || '';
  const description = document.getElementById('record-description')?.value || '';
  const cost = document.getElementById('record-cost')?.value || '';

  if (!type || !date || !description || !cost) {
    alert('Por favor completa todos los campos');
    return;
  }

  const nuevoRegistro = {
    id: Date.now(),
    usuarioId: usuarioActual.id,
    type,
    date,
    description,
    cost
  };

  const registros = JSON.parse(localStorage.getItem('registros') || '[]');
  registros.push(nuevoRegistro);
  localStorage.setItem('registros', JSON.stringify(registros));

  event.target.reset();
  cargarRegistros(usuarioActual.id);
  alert('Registro agregado exitosamente');
}

function deleteRecord(recordId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) {
    return;
  }

  let registros = JSON.parse(localStorage.getItem('registros') || '[]');
  registros = registros.filter(r => r.id !== recordId);
  localStorage.setItem('registros', JSON.stringify(registros));

  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  cargarRegistros(usuarioActual.id);
  alert('Registro eliminado');
}

function handleLogout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    localStorage.removeItem('usuarioActual');
    location.reload();
  }
}

// ===== CONTACTO =====

function handleContactForm(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre')?.value || '';
  const email = document.getElementById('email')?.value || '';
  const mensaje = document.getElementById('mensaje')?.value || '';

  if (!nombre || !email || !mensaje) {
    alert('Por favor completa todos los campos');
    return;
  }

  if (!validateEmail(email)) {
    alert('Por favor ingresa un email válido');
    return;
  }

  const contactos = JSON.parse(localStorage.getItem('contactos') || '[]');
  contactos.push({
    id: Date.now(),
    nombre,
    email,
    mensaje,
    fecha: new Date().toLocaleDateString()
  });

  localStorage.setItem('contactos', JSON.stringify(contactos));
  alert('¡Mensaje enviado! Nos pondremos en contacto pronto.');
  event.target.reset();
}

// ===== INICIALIZAR AL CARGAR PÁGINA =====

document.addEventListener('DOMContentLoaded', function() {
  const usuarioActual = localStorage.getItem('usuarioActual');
  
  if (usuarioActual && window.location.pathname.includes('sesiondemo')) {
    const usuario = JSON.parse(usuarioActual);
    mostrarDashboard(usuario);
  }
});