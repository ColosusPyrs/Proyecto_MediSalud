// ============================================================
//  main.js  –  MediSalud Sistema de Seguro de Salud
//  Responsable JS: validaciones, interacción dinámica
// ============================================================

// ---------- UTILIDADES ----------

/**
 * Muestra un mensaje de error o éxito en el elemento indicado.
 * @param {string} id   - id del <div> de mensaje
 * @param {string} texto
 * @param {string} tipo - 'error' | 'exito'
 */
function mostrarMensaje(id, texto, tipo) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = 'mensaje ' + tipo;
  el.style.display = 'block';
}

function limpiarMensaje(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  el.textContent = '';
}

// ============================================================
//  LOGIN
// ============================================================

function iniciarSesion() {
  const usuario   = document.getElementById('user').value.trim();
  const contrasena = document.getElementById('pass').value.trim();

  // -- Campos vacíos --
  if (!usuario || !contrasena) {
    mostrarMensaje('msg-login', 'Por favor complete todos los campos.', 'error');
    return;
  }

  // -- Verificar credenciales guardadas en localStorage --
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const encontrado = usuarios.find(
    u => u.usuario === usuario && u.password === contrasena
  );

  if (encontrado) {
    localStorage.setItem('usuarioActivo', JSON.stringify(encontrado));
    mostrarMensaje('msg-login', '¡Bienvenido, ' + encontrado.nombre + '! Redirigiendo...', 'exito');
    setTimeout(() => { window.location.href = 'inicio.html'; }, 1500);
  } else {
    mostrarMensaje('msg-login', 'Usuario o contraseña incorrectos.', 'error');
  }
}

// ============================================================
//  REGISTRO
// ============================================================

function registrar() {
  const nombre   = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const cedula   = document.getElementById('cedula').value.trim();
  const usuario  = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value.trim();

  // -- Campos vacíos --
  if (!nombre || !apellido || !cedula || !usuario || !password) {
    mostrarMensaje('msg-registro', 'Por favor complete todos los campos.', 'error');
    return;
  }

  // -- Validar nombre (solo letras y espacios) --
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
    mostrarMensaje('msg-registro', 'El nombre solo debe contener letras.', 'error');
    return;
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellido)) {
    mostrarMensaje('msg-registro', 'El apellido solo debe contener letras.', 'error');
    return;
  }

  // -- Validar cédula dominicana (11 dígitos, guiones opcionales) --
  const cedulaLimpia = cedula.replace(/-/g, '');
  if (!/^\d{11}$/.test(cedulaLimpia)) {
    mostrarMensaje('msg-registro', 'La cédula debe tener 11 dígitos (ej: 001-1234567-8).', 'error');
    return;
  }

  // -- Validar contraseña (mínimo 6 caracteres) --
  if (password.length < 6) {
    mostrarMensaje('msg-registro', 'La contraseña debe tener al menos 6 caracteres.', 'error');
    return;
  }

  // -- Verificar si el usuario ya existe --
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  if (usuarios.find(u => u.usuario === usuario)) {
    mostrarMensaje('msg-registro', 'El nombre de usuario ya está en uso. Elija otro.', 'error');
    return;
  }

  // -- Guardar nuevo usuario --
  usuarios.push({ nombre, apellido, cedula: cedulaLimpia, usuario, password });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  mostrarMensaje('msg-registro', '¡Registro exitoso! Redirigiendo al inicio de sesión...', 'exito');
  setTimeout(() => { window.location.href = 'login.html'; }, 2000);
}

// ============================================================
//  PLANES – Modal sin recarga de página
// ============================================================

function elegirPlan(nombre, precio, beneficios) {
  document.getElementById('modal-plan-nombre').textContent    = nombre;
  document.getElementById('modal-plan-precio').textContent    = precio;
  document.getElementById('modal-plan-beneficios').textContent = beneficios;
  document.getElementById('modal-plan').style.display = 'flex';
}

function cerrarModalPlan() {
  document.getElementById('modal-plan').style.display = 'none';
}

function confirmarPlan() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
  const plan    = document.getElementById('modal-plan-nombre').textContent;

  cerrarModalPlan();

  if (!usuario) {
    mostrarMensaje('msg-plan',
      'Debe iniciar sesión para suscribirse a un plan. Redirigiendo...', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 3000);
    return;
  }

  mostrarMensaje('msg-plan', '¡Plan ' + plan + ' seleccionado exitosamente, ' + usuario.nombre + '!', 'exito');
}

// ============================================================
//  SERVICIOS – Sección de detalle sin recarga
// ============================================================

function verMasServicio(nombre, descripcion) {
  document.getElementById('detalle-servicio-nombre').textContent = nombre;
  document.getElementById('detalle-servicio-desc').textContent   = descripcion;
  document.getElementById('modal-servicio').style.display = 'flex';
}

function cerrarModalServicio() {
  document.getElementById('modal-servicio').style.display = 'none';
}

// ============================================================
//  CONTACTO – Validación y envío sin recarga
// ============================================================

function enviarContacto() {
  const nombre  = document.getElementById('contacto-nombre').value.trim();
  const email   = document.getElementById('contacto-email').value.trim();
  const mensaje = document.getElementById('contacto-mensaje').value.trim();

  // -- Campos vacíos --
  if (!nombre || !email || !mensaje) {
    mostrarMensaje('msg-contacto', 'Por favor complete todos los campos.', 'error');
    return;
  }

  // -- Validar formato de email --
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarMensaje('msg-contacto', 'Por favor ingrese un correo electrónico válido.', 'error');
    return;
  }

  // -- Validar longitud mínima del mensaje --
  if (mensaje.length < 10) {
    mostrarMensaje('msg-contacto', 'El mensaje debe tener al menos 10 caracteres.', 'error');
    return;
  }

  // Éxito: limpiar campos y mostrar confirmación
  mostrarMensaje('msg-contacto',
    '¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'exito');
  document.getElementById('contacto-nombre').value  = '';
  document.getElementById('contacto-email').value   = '';
  document.getElementById('contacto-mensaje').value = '';
}

// ============================================================
//  MENÚ HAMBURGUESA (responsive móvil)
// ============================================================

function toggleMenu() {
  const menu      = document.getElementById('mobile-menu');
  const iconMenu  = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');
  if (!menu) return;
  menu.classList.toggle('hidden');
  iconMenu.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');
}

// Cerrar menú móvil al redimensionar a desktop
window.addEventListener('resize', function () {
  if (window.innerWidth >= 768) {
    const menu = document.getElementById('mobile-menu');
    const iconMenu  = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    if (menu)      menu.classList.add('hidden');
    if (iconMenu)  iconMenu.classList.remove('hidden');
    if (iconClose) iconClose.classList.add('hidden');
  }
});

// ============================================================
//  CIERRE DE MODALES AL HACER CLICK FUERA
// ============================================================

window.addEventListener('click', function (e) {
  const modalPlan      = document.getElementById('modal-plan');
  const modalServicio  = document.getElementById('modal-servicio');

  if (modalPlan     && e.target === modalPlan)     cerrarModalPlan();
  if (modalServicio && e.target === modalServicio) cerrarModalServicio();
});