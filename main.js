// =============================================================
//  main.js – MediSalud ARS
//  Módulos: utilidades, sesión, menú, formularios, portal
// =============================================================

/* ─── UTILIDADES ────────────────────────────────────────────── */

/** Muestra un mensaje de estado en un contenedor. */
function mostrarMensaje(id, texto, tipo = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className   = 'mensaje ' + tipo;
  el.style.display = 'block';
  // Ocultar automáticamente después de 6 s si es éxito
  if (tipo === 'exito') setTimeout(() => limpiarMensaje(id), 6000);
}

/** Limpia un contenedor de mensaje. */
function limpiarMensaje(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  el.textContent   = '';
  el.className     = 'mensaje';
}

/**
 * Muestra un toast (notificación flotante) en la esquina inferior derecha.
 * @param {string} texto  - Texto del mensaje.
 * @param {string} tipo   - 'success' | 'error' | 'warning' | 'info'
 * @param {number} duracion - ms antes de que desaparezca (default 4000)
 */
function mostrarToast(texto, tipo = 'info', duracion = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const iconos = {
    success: '<svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    error  : '<svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    warning: '<svg class="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    info   : '<svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `${iconos[tipo] || iconos.info}<span>${texto}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duracion);
}

/** Formatea fecha DD/MM/YYYY → "28 de abril de 2026". */
function formatearFecha(fechaStr) {
  const meses = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const d = new Date(fechaStr + 'T00:00:00');
  if (isNaN(d)) return fechaStr;
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

/** Retorna las iniciales de un nombre completo (máx 2 letras). */
function obtenerIniciales(nombre) {
  return nombre.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

/* ─── MENÚ HAMBURGUESA (responsive móvil) ──────────────────── */

function toggleMenu() {
  const menu      = document.getElementById('mobile-menu');
  const iconMenu  = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');
  if (!menu) return;
  menu.classList.toggle('hidden');
  if (iconMenu)  iconMenu.classList.toggle('hidden');
  if (iconClose) iconClose.classList.toggle('hidden');
}

// Cierra el menú si la ventana pasa a tamaño escritorio
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    const menu     = document.getElementById('mobile-menu');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose= document.getElementById('icon-close');
    if (menu)      menu.classList.add('hidden');
    if (iconMenu)  iconMenu.classList.remove('hidden');
    if (iconClose) iconClose.classList.add('hidden');
  }
});

/* ─── MENÚ DEL PORTAL (sidebar móvil) ──────────────────────── */

function toggleSidebar() {
  const sidebar = document.getElementById('portal-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

function closeSidebar() {
  const sidebar = document.getElementById('portal-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

/* ─── SESIÓN ────────────────────────────────────────────────── */

/**
 * Verifica si hay sesión activa y actualiza la UI del header.
 * Llama a check_session.php y actualiza los elementos del DOM.
 */
function verificarSesion() {
  fetch('conexionBD/check_session.php')
    .then(r => r.json())
    .then(data => {
      const conSesion  = document.getElementById('botones-con-sesion');
      const sinSesion  = document.getElementById('botones-sin-sesion');
      const menuCon    = document.getElementById('menu-con-sesion');
      const menuSin    = document.getElementById('menu-sin-sesion');
      const nombreEl   = document.getElementById('nombre-usuario');
      const menuNombre = document.getElementById('usuario-menu');

      if (data.loggedin) {
        if (conSesion)   conSesion.style.display = 'flex';
        if (sinSesion)   sinSesion.style.display = 'none';
        if (menuCon)     menuCon.style.display    = 'block';
        if (menuSin)     menuSin.style.display    = 'none';
        if (nombreEl)    nombreEl.textContent     = data.usuario;
        if (menuNombre)  menuNombre.textContent   = data.usuario;
      } else {
        if (conSesion)   conSesion.style.display = 'none';
        if (sinSesion)   sinSesion.style.display = 'flex';
        if (menuCon)     menuCon.style.display    = 'none';
        if (menuSin)     menuSin.style.display    = 'block';
      }
    })
    .catch(() => { /* sin backend: no hacer nada */ });
}

/**
 * Verifica la sesión para páginas protegidas del portal.
 * Redirige a login.html si no hay sesión activa.
 */
function verificarSesionPortal(callback) {
  fetch('conexionBD/check_session.php')
    .then(r => r.json())
    .then(data => {
      if (!data.loggedin) {
        window.location.href = 'login.html';
        return;
      }
      // Actualizar elementos del portal con el nombre del usuario
      const els = document.querySelectorAll('[data-usuario]');
      els.forEach(el => { el.textContent = data.usuario; });
      const inits = document.querySelectorAll('[data-iniciales]');
      inits.forEach(el => { el.textContent = obtenerIniciales(data.usuario); });
      if (callback) callback(data);
    })
    .catch(() => {
      // Sin backend activo: simular usuario de demo
      const demo = { loggedin: true, usuario: 'Demo Usuario', id: 1 };
      const els = document.querySelectorAll('[data-usuario]');
      els.forEach(el => { el.textContent = demo.usuario; });
      const inits = document.querySelectorAll('[data-iniciales]');
      inits.forEach(el => { el.textContent = 'DU'; });
      if (callback) callback(demo);
    });
}

function cerrarSesion() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    window.location.href = 'conexionBD/logout.php';
  }
}

/* ─── FORMULARIO DE CONTACTO (landing) ─────────────────────── */

function enviarContacto() {
  const nombre  = document.getElementById('contacto-nombre')?.value.trim();
  const email   = document.getElementById('contacto-email')?.value.trim();
  const mensaje = document.getElementById('contacto-mensaje')?.value.trim();

  if (!nombre || !email || !mensaje) {
    mostrarMensaje('msg-contacto', 'Por favor complete todos los campos.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarMensaje('msg-contacto', 'Por favor ingrese un correo electrónico válido.', 'error');
    return;
  }
  if (mensaje.length < 10) {
    mostrarMensaje('msg-contacto', 'El mensaje debe tener al menos 10 caracteres.', 'error');
    return;
  }

  mostrarMensaje('msg-contacto', '¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'exito');
  document.getElementById('contacto-nombre').value  = '';
  document.getElementById('contacto-email').value   = '';
  document.getElementById('contacto-mensaje').value = '';
}

/* ─── PLANES – Modal de confirmación ───────────────────────── */

function elegirPlan(nombre, precio, beneficios) {
  const el = document.getElementById('modal-plan');
  if (!el) return;
  document.getElementById('modal-plan-nombre').textContent     = nombre;
  document.getElementById('modal-plan-precio').textContent     = precio;
  document.getElementById('modal-plan-beneficios').textContent = beneficios;
  el.style.display = 'flex';
}

function cerrarModalPlan() {
  const el = document.getElementById('modal-plan');
  if (el) el.style.display = 'none';
}

function confirmarPlan() {
  const plan = document.getElementById('modal-plan-nombre')?.textContent;
  cerrarModalPlan();

  // Verificar sesión antes de confirmar
  fetch('conexionBD/check_session.php')
    .then(r => r.json())
    .then(data => {
      if (!data.loggedin) {
        mostrarMensaje('msg-plan', 'Debe iniciar sesión para suscribirse a un plan. Redirigiendo...', 'error');
        setTimeout(() => { window.location.href = 'login.html'; }, 2500);
        return;
      }
      mostrarMensaje('msg-plan', `¡Plan ${plan} seleccionado exitosamente, ${data.usuario}!`, 'exito');
    })
    .catch(() => {
      mostrarMensaje('msg-plan', 'Por favor inicie sesión para continuar.', 'error');
    });
}

/* ─── SERVICIOS – Modal de detalle ─────────────────────────── */

function verMasServicio(nombre, descripcion) {
  const el = document.getElementById('modal-servicio');
  if (!el) return;
  document.getElementById('detalle-servicio-nombre').textContent = nombre;
  document.getElementById('detalle-servicio-desc').textContent   = descripcion;
  el.style.display = 'flex';
}

function cerrarModalServicio() {
  const el = document.getElementById('modal-servicio');
  if (el) el.style.display = 'none';
}

/* ─── ANIMACIÓN CONTADORES (landing) ────────────────────────── */

function animarContadores() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target  = parseInt(el.dataset.count, 10);
    const suffix  = el.dataset.suffix || '';
    const duracion = 1800;
    const steps   = 60;
    let current   = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current).toLocaleString('es-DO') + suffix;
    }, duracion / steps);
  });
}

// Activar contadores al hacer scroll sobre ellos
function observarContadores() {
  const section = document.getElementById('stats-section');
  if (!section) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContadores();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
}

/* ─── PORTAL: DIRECTORIO DE MÉDICOS ────────────────────────── */

// Datos de ejemplo de médicos (en producción vendrían de la BD)
const medicosData = [
  { id:1,  nombre:'Dr. Carlos Méndez',     especialidad:'Cardiología',      experiencia:'15 años', clinica:'Clínica Central',          rating:4.9, disponible:true  },
  { id:2,  nombre:'Dra. María González',   especialidad:'Pediatría',        experiencia:'10 años', clinica:'Hospital Metropolitano',    rating:4.8, disponible:true  },
  { id:3,  nombre:'Dr. Roberto Herrera',   especialidad:'Ortopedia',        experiencia:'12 años', clinica:'Clínica del Este',          rating:4.7, disponible:false },
  { id:4,  nombre:'Dra. Ana Martínez',     especialidad:'Ginecología',      experiencia:'8 años',  clinica:'Clínica Central',          rating:4.9, disponible:true  },
  { id:5,  nombre:'Dr. Luis Pérez',        especialidad:'Neurología',       experiencia:'20 años', clinica:'Hospital Metropolitano',    rating:4.6, disponible:true  },
  { id:6,  nombre:'Dra. Carmen Santos',    especialidad:'Dermatología',     experiencia:'7 años',  clinica:'Clínica del Norte',         rating:4.8, disponible:true  },
  { id:7,  nombre:'Dr. Jorge Ramírez',     especialidad:'Oftalmología',     experiencia:'14 años', clinica:'Clínica del Este',          rating:4.5, disponible:false },
  { id:8,  nombre:'Dra. Patricia Núñez',   especialidad:'Endocrinología',   experiencia:'9 años',  clinica:'Hospital Metropolitano',    rating:4.7, disponible:true  },
  { id:9,  nombre:'Dr. Miguel Castillo',   especialidad:'Medicina General', experiencia:'5 años',  clinica:'Centro Médico Sur',         rating:4.6, disponible:true  },
  { id:10, nombre:'Dra. Isabel Torres',    especialidad:'Psiquiatría',      experiencia:'11 años', clinica:'Clínica Central',           rating:4.9, disponible:true  },
  { id:11, nombre:'Dr. Fernando Vega',     especialidad:'Urología',         experiencia:'16 años', clinica:'Hospital Metropolitano',    rating:4.7, disponible:true  },
  { id:12, nombre:'Dra. Gabriela Cruz',    especialidad:'Oncología',        experiencia:'13 años', clinica:'Instituto del Cáncer',      rating:4.8, disponible:false },
];

/**
 * Renderiza las tarjetas de médicos según los filtros activos.
 * @param {Array} lista - Array de objetos de médico a mostrar
 */
function renderizarMedicos(lista) {
  const grid = document.getElementById('medicos-grid');
  if (!grid) return;

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full empty-state">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>No se encontraron médicos con esos criterios.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(m => `
    <div class="doctor-card anim-fade-in">
      <div class="flex items-start gap-4 mb-4">
        <div class="doctor-avatar">${obtenerIniciales(m.nombre)}</div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-800 truncate">${m.nombre}</h3>
          <p class="text-sm text-primary font-medium">${m.especialidad}</p>
          <p class="text-xs text-gray-400 mt-0.5">${m.clinica}</p>
        </div>
        <span class="badge ${m.disponible ? 'badge-green' : 'badge-red'}">
          ${m.disponible ? 'Disponible' : 'No disponible'}
        </span>
      </div>
      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>${m.experiencia} de experiencia</span>
        <span class="doctor-rating font-semibold">
          <span>★</span> ${m.rating}
        </span>
      </div>
      <button onclick="solicitarCitaMedico(${m.id}, '${m.nombre}', '${m.especialidad}')"
        class="btn btn-outline btn-sm btn-full ${!m.disponible ? 'opacity-50 cursor-not-allowed' : ''}"
        ${!m.disponible ? 'disabled' : ''}>
        Solicitar cita
      </button>
    </div>`).join('');
}

/** Aplica filtros de búsqueda al directorio de médicos. */
function filtrarMedicos() {
  const busqueda     = document.getElementById('busq-medico')?.value.toLowerCase() || '';
  const especialidad = document.getElementById('filtro-esp')?.value || '';
  const clinica      = document.getElementById('filtro-clinica')?.value || '';

  const resultado = medicosData.filter(m => {
    const coincideBusqueda    = m.nombre.toLowerCase().includes(busqueda) || m.especialidad.toLowerCase().includes(busqueda);
    const coincideEspecialidad = !especialidad || m.especialidad === especialidad;
    const coincideClinica      = !clinica      || m.clinica      === clinica;
    return coincideBusqueda && coincideEspecialidad && coincideClinica;
  });

  const contador = document.getElementById('contador-medicos');
  if (contador) contador.textContent = `${resultado.length} médico${resultado.length !== 1 ? 's' : ''} encontrado${resultado.length !== 1 ? 's' : ''}`;

  renderizarMedicos(resultado);
}

/**
 * Pre-rellena el formulario de citas con el médico seleccionado
 * y redirige a la página de citas.
 */
function solicitarCitaMedico(id, nombre, especialidad) {
  sessionStorage.setItem('citaMedico', JSON.stringify({ id, nombre, especialidad }));
  window.location.href = 'citas.html?nuevo=1';
}

/* ─── PORTAL: CITAS MÉDICAS ─────────────────────────────────── */

// Datos de citas de ejemplo
const citasEjemplo = [
  { id:1, medico:'Dr. Carlos Méndez',   especialidad:'Cardiología',    fecha:'2026-05-05', hora:'10:00', estado:'confirmada',  clinica:'Clínica Central'       },
  { id:2, medico:'Dra. María González', especialidad:'Pediatría',      fecha:'2026-05-12', hora:'14:30', estado:'pendiente',   clinica:'Hospital Metropolitano' },
  { id:3, medico:'Dr. Luis Pérez',      especialidad:'Neurología',     fecha:'2026-04-15', hora:'09:00', estado:'completada',  clinica:'Hospital Metropolitano' },
  { id:4, medico:'Dra. Ana Martínez',   especialidad:'Ginecología',    fecha:'2026-04-20', hora:'11:00', estado:'cancelada',   clinica:'Clínica Central'       },
];

const estadoBadge = {
  confirmada : '<span class="badge badge-green">Confirmada</span>',
  pendiente  : '<span class="badge badge-yellow">Pendiente</span>',
  completada : '<span class="badge badge-blue">Completada</span>',
  cancelada  : '<span class="badge badge-red">Cancelada</span>',
};

/** Renderiza la lista de citas en la tabla. */
function renderizarCitas(lista) {
  const tbody = document.getElementById('citas-tbody');
  if (!tbody) return;

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p>No tienes citas programadas.</p>
          <button onclick="mostrarFormularioCita()" class="btn btn-primary btn-sm mt-3">Solicitar una cita</button>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(c => `
    <tr>
      <td><div class="font-semibold text-gray-800">${c.medico}</div><div class="text-xs text-gray-400">${c.especialidad}</div></td>
      <td>${formatearFecha(c.fecha)}</td>
      <td>${c.hora}</td>
      <td>${c.clinica}</td>
      <td>${estadoBadge[c.estado] || c.estado}</td>
      <td>
        ${c.estado === 'confirmada' || c.estado === 'pendiente'
          ? `<button onclick="cancelarCita(${c.id})" class="btn btn-danger btn-sm">Cancelar</button>`
          : '<span class="text-gray-400 text-sm">—</span>'}
      </td>
    </tr>`).join('');
}

/** Cancela una cita por su ID (con confirmación). */
function cancelarCita(id) {
  if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;
  const idx = citasEjemplo.findIndex(c => c.id === id);
  if (idx !== -1) {
    citasEjemplo[idx].estado = 'cancelada';
    renderizarCitas(citasEjemplo);
    mostrarToast('Cita cancelada exitosamente.', 'success');
  }
}

/** Abre el formulario de nueva cita. */
function mostrarFormularioCita() {
  const panel = document.getElementById('panel-nueva-cita');
  if (panel) {
    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Procesa el formulario de solicitud de nueva cita. */
function procesarNuevaCita(event) {
  event.preventDefault();
  const medico = document.getElementById('cita-medico')?.value;
  const fecha  = document.getElementById('cita-fecha')?.value;
  const hora   = document.getElementById('cita-hora')?.value;
  const motivo = document.getElementById('cita-motivo')?.value.trim();

  if (!medico || !fecha || !hora || !motivo) {
    mostrarMensaje('msg-nueva-cita', 'Por favor complete todos los campos.', 'error');
    return;
  }

  // Agregar la cita a la lista
  const nueva = {
    id         : citasEjemplo.length + 1,
    medico     : medico,
    especialidad: document.querySelector(`#cita-medico option[value="${medico}"]`)?.dataset.esp || '',
    fecha      : fecha,
    hora       : hora,
    estado     : 'pendiente',
    clinica    : 'Por asignar',
  };
  citasEjemplo.unshift(nueva);

  mostrarMensaje('msg-nueva-cita', '¡Cita solicitada exitosamente! Estado: pendiente de confirmación.', 'exito');
  event.target.reset();
  setTimeout(() => {
    document.getElementById('panel-nueva-cita')?.classList.add('hidden');
    renderizarCitas(citasEjemplo);
  }, 2000);
}

/* ─── PORTAL: TELEMEDICINA ──────────────────────────────────── */

// Historial de mensajes del chat
const chatMensajes = [];

/** Envía un mensaje al chat de telemedicina (demo). */
function enviarMensajeChat(event) {
  if (event && event.key && event.key !== 'Enter') return;
  const input = document.getElementById('chat-input');
  if (!input) return;
  const texto = input.value.trim();
  if (!texto) return;

  agregarMensajeChat(texto, 'sent');
  input.value = '';

  // Simular respuesta automática del médico
  setTimeout(() => {
    const respuestas = [
      'Entendido, ¿desde cuándo presenta estos síntomas?',
      'Le recomiendo descanso y mantenerse hidratado. Si los síntomas persisten más de 72 horas, consulte en persona.',
      'Voy a revisar su historial médico y le responderé en breve.',
      'Por favor describa con más detalle los síntomas que experimenta.',
      'Gracias por la información. ¿Ha tomado algún medicamento recientemente?',
    ];
    const r = respuestas[Math.floor(Math.random() * respuestas.length)];
    agregarMensajeChat('Dr. García (en línea): ' + r, 'received');
  }, 1200 + Math.random() * 800);
}

function agregarMensajeChat(texto, tipo) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const ahora  = new Date();
  const tiempo = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, '0')}`;

  const div = document.createElement('div');
  div.className = `chat-msg ${tipo}`;
  div.innerHTML = `${texto}<div class="chat-msg-time">${tiempo}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

/** Limpia el historial del chat. */
function limpiarChat() {
  const container = document.getElementById('chat-messages');
  if (container) container.innerHTML = '';
  mostrarToast('Chat limpiado.', 'info', 2000);
}

/* ─── PORTAL: RECETAS Y MEDICAMENTOS ────────────────────────── */

// Datos de ejemplo de recetas
const recetasData = [
  {
    id: 1, fecha: '2026-04-15', medico: 'Dr. Carlos Méndez', especialidad: 'Cardiología',
    diagnostico: 'Hipertensión arterial leve',
    medicamentos: [
      { nombre: 'Enalapril 10mg',  dosis: '1 tableta', frecuencia: 'Cada 12 horas', duracion: '30 días' },
      { nombre: 'Aspirina 100mg',  dosis: '1 tableta', frecuencia: 'Una vez al día', duracion: '30 días' },
    ]
  },
  {
    id: 2, fecha: '2026-03-20', medico: 'Dra. Ana Martínez', especialidad: 'Ginecología',
    diagnostico: 'Control preventivo',
    medicamentos: [
      { nombre: 'Hierro + ácido fólico', dosis: '1 cápsula', frecuencia: 'Una vez al día', duracion: '60 días' },
      { nombre: 'Vitamina D3 1000 UI',   dosis: '1 gota',   frecuencia: 'Una vez al día', duracion: '60 días' },
    ]
  },
];

/** Renderiza el historial de recetas. */
function renderizarRecetas() {
  const container = document.getElementById('recetas-container');
  if (!container) return;

  if (recetasData.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No tienes recetas registradas.</p></div>`;
    return;
  }

  container.innerHTML = recetasData.map(r => `
    <div class="receta-card mb-4 anim-fade-in">
      <div class="receta-header">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold">${r.medico}</h3>
            <p class="text-sm opacity-80">${r.especialidad}</p>
          </div>
          <span class="text-sm opacity-80">${formatearFecha(r.fecha)}</span>
        </div>
        <p class="text-sm mt-2 opacity-90"><strong>Diagnóstico:</strong> ${r.diagnostico}</p>
      </div>
      <div class="receta-body">
        <h4 class="font-semibold text-gray-700 mb-3 text-sm">Medicamentos prescritos:</h4>
        ${r.medicamentos.map(m => `
          <div class="receta-item">
            <div class="receta-bullet"></div>
            <div>
              <p class="font-semibold text-gray-800 text-sm">${m.nombre}</p>
              <p class="text-xs text-gray-500">${m.dosis} · ${m.frecuencia} · ${m.duracion}</p>
            </div>
          </div>`).join('')}
        <div class="flex gap-2 mt-4">
          <button onclick="imprimirReceta(${r.id})" class="btn btn-outline btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Imprimir
          </button>
        </div>
      </div>
    </div>`).join('');
}

function imprimirReceta(id) {
  window.print();
}

/* ─── PORTAL: FACTURACIÓN Y PAGOS ───────────────────────────── */

// Datos de ejemplo de facturas
const facturasData = [
  { id:'FAC-001', fecha:'2026-04-01', concepto:'Plan Premium – Abril 2026',  monto:5500, estado:'pagado'   },
  { id:'FAC-002', fecha:'2026-03-01', concepto:'Plan Premium – Marzo 2026',  monto:5500, estado:'pagado'   },
  { id:'FAC-003', fecha:'2026-02-01', concepto:'Plan Premium – Febrero 2026',monto:5500, estado:'pagado'   },
  { id:'FAC-004', fecha:'2026-05-01', concepto:'Plan Premium – Mayo 2026',   monto:5500, estado:'pendiente'},
];

/** Renderiza la tabla de facturas. */
function renderizarFacturas() {
  const tbody = document.getElementById('facturas-tbody');
  if (!tbody) return;

  tbody.innerHTML = facturasData.map(f => `
    <tr>
      <td class="font-mono text-xs">${f.id}</td>
      <td>${formatearFecha(f.fecha)}</td>
      <td>${f.concepto}</td>
      <td class="font-semibold">RD$ ${f.monto.toLocaleString('es-DO')}</td>
      <td>
        <span class="badge ${f.estado === 'pagado' ? 'badge-green' : 'badge-yellow'}">
          ${f.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
        </span>
      </td>
      <td>
        <button onclick="descargarComprobante('${f.id}')" class="btn btn-outline btn-sm">
          Ver
        </button>
      </td>
    </tr>`).join('');

  // Actualizar resumen
  const total    = facturasData.reduce((s, f) => s + f.monto, 0);
  const pagado   = facturasData.filter(f => f.estado === 'pagado').reduce((s, f) => s + f.monto, 0);
  const pendiente= facturasData.filter(f => f.estado === 'pendiente').reduce((s, f) => s + f.monto, 0);

  const elTotal     = document.getElementById('total-facturado');
  const elPagado    = document.getElementById('total-pagado');
  const elPendiente = document.getElementById('total-pendiente');
  if (elTotal)     elTotal.textContent     = `RD$ ${total.toLocaleString('es-DO')}`;
  if (elPagado)    elPagado.textContent    = `RD$ ${pagado.toLocaleString('es-DO')}`;
  if (elPendiente) elPendiente.textContent = `RD$ ${pendiente.toLocaleString('es-DO')}`;
}

function descargarComprobante(id) {
  mostrarToast(`Descargando comprobante ${id}...`, 'info', 2500);
  setTimeout(() => window.print(), 500);
}

/* ─── PORTAL: PERFIL DE USUARIO ─────────────────────────────── */

/** Activa la edición del perfil. */
function habilitarEdicionPerfil() {
  document.querySelectorAll('.campo-perfil').forEach(el => {
    el.removeAttribute('disabled');
    el.classList.remove('bg-gray-50', 'cursor-not-allowed');
  });
  document.getElementById('btn-editar-perfil')?.classList.add('hidden');
  document.getElementById('btn-guardar-perfil')?.classList.remove('hidden');
  document.getElementById('btn-cancelar-perfil')?.classList.remove('hidden');
  mostrarToast('Modo edición activado. Modifica tus datos y guarda.', 'info');
}

/** Desactiva la edición del perfil sin guardar. */
function cancelarEdicionPerfil() {
  document.querySelectorAll('.campo-perfil').forEach(el => {
    el.setAttribute('disabled', '');
    el.classList.add('bg-gray-50', 'cursor-not-allowed');
  });
  document.getElementById('btn-editar-perfil')?.classList.remove('hidden');
  document.getElementById('btn-guardar-perfil')?.classList.add('hidden');
  document.getElementById('btn-cancelar-perfil')?.classList.add('hidden');
}

/** Simula el guardado del perfil. */
function guardarPerfil(event) {
  event.preventDefault();
  cancelarEdicionPerfil();
  mostrarToast('Perfil actualizado exitosamente.', 'success');
}

/* ─── TABS (sistema de pestañas) ────────────────────────────── */

/**
 * Activa una pestaña específica.
 * @param {string} tabId   - ID del panel de contenido a mostrar
 * @param {Element} btnEl  - Botón que fue clickeado
 */
function activarTab(tabId, btnEl) {
  // Desactivar todos los botones y contenidos del mismo grupo
  const grupo = btnEl.closest('.tab-group') || btnEl.parentElement;
  grupo.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');

  // Ocultar todos los contenidos del grupo asociado
  const contenedorId = btnEl.dataset.tabGroup;
  const contenedor   = contenedorId ? document.getElementById(contenedorId) : btnEl.closest('.tabs')?.nextElementSibling;

  if (contenedor) {
    contenedor.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
  }
}

/* ─── CIERRE DE MODALES CON CLICK FUERA ─────────────────────── */

window.addEventListener('click', e => {
  const modalPlan     = document.getElementById('modal-plan');
  const modalServicio = document.getElementById('modal-servicio');
  if (modalPlan     && e.target === modalPlan)     cerrarModalPlan();
  if (modalServicio && e.target === modalServicio) cerrarModalServicio();
});

/* ─── INICIALIZACIÓN ────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Verificar sesión en páginas públicas (header dinámico)
  if (document.getElementById('botones-con-sesion')) {
    verificarSesion();
  }

  // Observar contadores de estadísticas (landing)
  observarContadores();

  // Cerrar sidebar al hacer click en overlay
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

  // Cerrar menú móvil al hacer click fuera
  document.addEventListener('click', e => {
    const menu   = document.getElementById('mobile-menu');
    const burger = document.querySelector('[onclick="toggleMenu()"]');
    if (menu && burger && !menu.contains(e.target) && !burger.contains(e.target)) {
      if (!menu.classList.contains('hidden')) toggleMenu();
    }
  });

  // Activar primera pestaña de cada grupo automáticamente
  document.querySelectorAll('.tab-btn.active:first-child').forEach(btn => {
    btn.click();
  });
});
