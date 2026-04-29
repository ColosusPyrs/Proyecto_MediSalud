# Registro de Archivos Nuevos y Modificados

Este documento detalla todos los cambios realizados en la segunda versión del proyecto MediSalud ARS.

---

## Resumen de Cambios

| Archivo | Estado | Descripción breve |
|---------|--------|-------------------|
| `style.css` | **Modificado** | Reescrito completamente con sistema de diseño completo |
| `main.js` | **Modificado** | Ampliado con 20+ funciones nuevas para el portal |
| `inicio.html` | **Modificado** | Landing page completamente rediseñada |
| `README.md` | **Modificado** | Documentación completa actualizada |
| `dashboard.html` | **Nuevo** | Panel principal del portal del afiliado |
| `perfil.html` | **Nuevo** | Perfil de usuario e historial médico |
| `medicos.html` | **Nuevo** | Directorio de médicos y centros afiliados |
| `citas.html` | **Nuevo** | Gestión de citas médicas |
| `telemedicina.html` | **Nuevo** | Consultas médicas en línea y chat |
| `recetas.html` | **Nuevo** | Recetas, medicamentos y farmacias |
| `facturacion.html` | **Nuevo** | Facturación, pagos y comprobantes |
| `ARCHIVOS_MODIFICADOS.md` | **Nuevo** | Este documento |

---

## Archivos Modificados

---

### `style.css`
**Estado**: Reescrito completamente  
**Tamaño anterior**: ~25 líneas  
**Tamaño nuevo**: ~500+ líneas

#### Qué había antes
Solo contenía los estilos de `.mensaje`, `.mensaje.error` y `.mensaje.exito` para los mensajes de validación de JavaScript.

#### Qué se agregó

| Sección | Descripción |
|---------|-------------|
| Variables CSS (`--primary`, `--accent`, etc.) | Tokens de diseño centralizados para consistencia |
| Importación de Inter | Google Fonts cargada vía `@import` |
| Scrollbar personalizado | Barra de desplazamiento estilizada |
| Animaciones CSS | `fadeIn`, `fadeInLeft`, `fadeInRight`, `shimmer`, `gradientMove`, `spin`, `pulse-ring` |
| Clases `.anim-*` | Utilidades de animación con delays (`.anim-delay-1` a `.anim-delay-5`) |
| `.hero-gradient` | Fondo animado del hero de la landing |
| `.hero-wave` / `.hero-blob` | Elementos decorativos del hero |
| `.service-card` / `.service-icon` | Tarjetas de servicio con hover elevado |
| `.stat-counter` | Estilo del texto de contadores estadísticos |
| `.portal-layout` | Grid de 2 columnas para el portal (sidebar + contenido) |
| `.portal-sidebar` | Sidebar fijo con gradiente oscuro |
| `.portal-topbar` | Barra superior del portal |
| `.portal-content` | Área de contenido principal |
| `.sidebar-link` | Enlace de navegación del sidebar con estado `.active` |
| `.portal-card` | Tarjeta del portal con sombra suave |
| `.metric-card` | Tarjeta de métricas con icono y valor |
| `.badge` + 7 variantes | Etiquetas de estado con colores semánticos |
| `.data-table` | Tabla estilizada con cabecera y hover |
| `.skeleton` | Loader animado tipo shimmer |
| `.empty-state` | Estado vacío centrado con icono |
| `.spinner` | Círculo de carga animado |
| `.form-group` / `.form-label` / `.form-control` | Sistema de formularios unificado |
| `.btn` + variantes | Sistema de botones (`btn-primary`, `btn-outline`, `btn-danger`, `btn-success`, tamaños sm/lg/full) |
| `.doctor-card` / `.doctor-avatar` | Tarjeta de médico del directorio |
| `.timeline` / `.timeline-item` / `.timeline-dot` | Línea de tiempo de actividad |
| `.receta-card` / `.receta-header` / `.receta-body` | Tarjeta de receta médica |
| `.payment-row` / `.payment-total` | Filas de resumen de pago |
| `.search-wrapper` / `.search-icon` | Contenedor de buscador con icono flotante |
| `.tabs` / `.tab-btn` / `.tab-content` | Sistema de pestañas |
| `.modal-overlay` / `.modal-box` / `.modal-header` | Modal con backdrop blur |
| `.chat-container` / `.chat-msg` / `.chat-input-area` | Panel de chat de telemedicina |
| `.time-slot` | Bloques de horario para selección de citas |
| `.stepper` / `.step` / `.step-circle` / `.step-line` | Indicador de progreso en pasos |
| `.toast-container` / `.toast` | Sistema de notificaciones flotantes |
| `.testimonial-card` | Tarjeta de testimonio con comillas decorativas |
| Media queries responsive | Sidebar móvil deslizable, adaptaciones de grid |
| `@media print` | Estilos para impresión de recetas y comprobantes |

---

### `main.js`
**Estado**: Ampliado significativamente  
**Tamaño anterior**: ~230 líneas  
**Tamaño nuevo**: ~520+ líneas

#### Qué había antes
- `mostrarMensaje()` / `limpiarMensaje()`
- `iniciarSesion()` (con localStorage)
- `registrar()` (con localStorage)
- `elegirPlan()` / `confirmarPlan()` / `cerrarModalPlan()`
- `verMasServicio()` / `cerrarModalServicio()`
- `enviarContacto()`
- `toggleMenu()` + resize listener
- Click fuera para cerrar modales

#### Qué se agregó o modificó

| Función | Cambio | Descripción |
|---------|--------|-------------|
| `mostrarToast(texto, tipo, duracion)` | **Nueva** | Notificación flotante con icono SVG, auto-dismiss y animación de salida |
| `formatearFecha(fechaStr)` | **Nueva** | Convierte fecha ISO a "28 de abril de 2026" |
| `obtenerIniciales(nombre)` | **Nueva** | Extrae hasta 2 iniciales de un nombre completo |
| `toggleSidebar()` / `closeSidebar()` | **Nuevas** | Abrir/cerrar sidebar del portal en móvil |
| `verificarSesion()` | **Modificada** | Ahora también actualiza enlaces "Mi Portal" cuando hay sesión activa |
| `verificarSesionPortal(callback)` | **Nueva** | Protege páginas del portal; modo demo si no hay backend |
| `cerrarSesion()` | **Modificada** | Ahora llama a `conexionBD/logout.php` en lugar de `localStorage` |
| `elegirPlan()` / `confirmarPlan()` | **Modificadas** | Usan `check_session.php` en lugar de `localStorage` |
| `observarContadores()` | **Nueva** | IntersectionObserver para activar contadores al hacer scroll |
| `animarContadores()` | **Nueva** | Animación de cuenta regresiva hasta el valor objetivo |
| `medicosData` | **Nuevo** | Array de 12 médicos con especialidad, clínica, rating y disponibilidad |
| `renderizarMedicos(lista)` | **Nueva** | Genera HTML de tarjetas de médico; incluye estado vacío |
| `filtrarMedicos()` | **Nueva** | Filtra `medicosData` por búsqueda, especialidad y clínica |
| `solicitarCitaMedico(id, nombre, esp)` | **Nueva** | Guarda en `sessionStorage` y redirige a citas |
| `citasEjemplo` | **Nuevo** | Array de 4 citas de ejemplo con estados variados |
| `estadoBadge` | **Nuevo** | Mapa de estado → HTML de badge con color |
| `renderizarCitas(lista)` | **Nueva** | Genera HTML de tabla de citas; incluye estado vacío |
| `cancelarCita(id)` | **Nueva** | Cancela cita con confirm y re-renderiza la tabla |
| `mostrarFormularioCita()` | **Nueva** | Muestra el panel de nueva cita con scroll automático |
| `procesarNuevaCita(event)` | **Nueva** | Valida y agrega nueva cita al array; colapsa el formulario |
| `chatMensajes` | **Nuevo** | Array del historial de mensajes de chat |
| `enviarMensajeChat(event)` | **Nueva** | Envía mensaje y simula respuesta del médico con timeout |
| `agregarMensajeChat(texto, tipo)` | **Nueva** | Inserta burbuja de chat con timestamp |
| `limpiarChat()` | **Nueva** | Limpia el panel de mensajes |
| `recetasData` | **Nuevo** | Array de 2 recetas con medicamentos detallados |
| `renderizarRecetas()` | **Nueva** | Genera HTML de tarjetas de receta |
| `imprimirReceta(id)` | **Nueva** | Llama a `window.print()` |
| `facturasData` | **Nuevo** | Array de 4 facturas con estados |
| `renderizarFacturas()` | **Nueva** | Genera tabla de facturas y actualiza métricas de resumen |
| `descargarComprobante(id)` | **Nueva** | Toast + `window.print()` |
| `habilitarEdicionPerfil()` | **Nueva** | Activa campos del formulario de perfil |
| `cancelarEdicionPerfil()` | **Nueva** | Revierte campos a solo lectura |
| `guardarPerfil(event)` | **Nueva** | Simula guardado con toast de éxito |
| `activarTab(tabId, btnEl)` | **Nueva** | Sistema de pestañas genérico y reutilizable |
| `DOMContentLoaded listener` | **Modificado** | Centralizado: sesión, contadores, sidebar overlay, menú móvil |

---

## Archivos Nuevos

---

### `dashboard.html`
**Módulo**: Portal del Afiliado – Pantalla principal

**Características**:
- Layout de portal completo (sidebar fijo + topbar + contenido)
- Sidebar con logo, perfil rápido, navegación por secciones y botón de logout
- Topbar con hamburguesa (móvil), breadcrumb y avatar con nombre de usuario
- 4 tarjetas de métricas: citas, plan, recetas activas, pagos pendientes
- Panel "Próxima cita" con datos del médico y estado
- Panel "Accesos rápidos" con 4 iconos hacia los módulos
- Panel "Estado del plan" con tarjeta visual tipo tarjeta de crédito
- Línea de tiempo de actividad reciente (4 eventos)
- Aviso de pago pendiente con CTA
- Consejo de salud del día
- Información de línea de emergencias

---

### `perfil.html`
**Módulo**: Portal del Afiliado – Perfil de Usuario

**Características**:
- Avatar dinámico con iniciales del usuario (desde `data-iniciales`)
- Número de afiliado con formato `MS-YYYY-NNNN`
- Tarjeta del plan activo con gradiente visual
- Formulario de **datos personales** con 8 campos (cédula bloqueada)
- Formulario de **historial médico básico** con 7 campos (tipo de sangre, peso, alergias, enfermedades crónicas...)
- Formulario de **contacto de emergencia** con 3 campos
- Sistema de edición con 3 botones: Editar / Guardar / Cancelar
- Campos deshabilitados visualmente cuando no están en modo edición (`.campo-perfil`)

---

### `medicos.html`
**Módulo**: Portal del Afiliado – Directorio Médico

**Características**:
- Buscador en tiempo real por nombre o especialidad
- Filtro desplegable de especialidad (12 opciones)
- Filtro desplegable de clínica/hospital (6 opciones)
- Checkbox "Solo disponibles" para filtrar disponibilidad
- Contador dinámico de resultados ("N médicos encontrados")
- Sistema de tabs: **Médicos** (renderizado JS) y **Centros Afiliados** (HTML estático)
- 12 tarjetas de médico con: avatar, nombre, especialidad, clínica, experiencia, rating de estrellas, badge de disponibilidad y botón "Solicitar cita"
- 6 tarjetas de centros con: icono, nombre, tipo, dirección, teléfono, horario y estado abierto/cerrado
- Al pulsar "Solicitar cita" → guarda en `sessionStorage` y navega a `citas.html?nuevo=1`
- Pre-rellena el médico en el formulario si viene desde el directorio

---

### `citas.html`
**Módulo**: Portal del Afiliado – Citas Médicas

**Características**:

**Formulario de nueva cita** (panel colapsable con animación):
- Stepper visual de 3 pasos que se actualiza dinámicamente
- Selector de médico (9 opciones con especialidad como `data-esp`)
- Selector de fecha con mínimo = fecha de hoy
- Selector visual de horarios (14 slots de 30 minutos, algunos marcados como no disponibles)
- El slot seleccionado se resalta visualmente
- Campo de motivo de consulta (textarea requerido)
- Mensajes de error/éxito inline

**Tabla de citas programadas**:
- Filtros rápidos por estado: todas / confirmadas / pendientes / completadas
- Badges de color por estado (verde/amarillo/azul/rojo)
- Columna de acción con botón "Cancelar" (solo para activas)
- Estado vacío con botón de acción si no hay citas

---

### `telemedicina.html`
**Módulo**: Portal del Afiliado – Consultas y Telemedicina

**Características**:

**Panel izquierdo (2/3 del ancho)**:
- Tarjeta del médico en línea con indicador de estado (punto verde animado)
- Selector de médico disponible
- Ventana de chat con historial de mensajes estilizados (burbujas enviadas/recibidas)
- Timestamp en cada mensaje
- Input de texto con envío por Enter o botón
- Respuestas automáticas simuladas del médico (5 respuestas aleatorias con delay realista)
- Botón para limpiar el chat

**Panel derecho (1/3 del ancho)**:
- Formulario de consulta formal con: tipo, descripción de síntomas, duración, urgencia (normal/urgente)
- Historial de las últimas 3 consultas con nombre, médico, fecha y estado (respondida/en revisión)
- Nota de que el chat es simulación demo

---

### `recetas.html`
**Módulo**: Portal del Afiliado – Recetas y Medicamentos

**Características**:

**Pestaña "Mis Recetas"**:
- 2 tarjetas de receta con cabecera en gradiente azul
- Cada receta muestra: médico, especialidad, fecha, diagnóstico
- Lista de medicamentos con nombre, dosis, frecuencia y duración
- Botón "Imprimir" por receta

**Pestaña "Catálogo de Medicamentos"**:
- 12 medicamentos con nombre, categoría, porcentaje de cobertura y descripción
- Badge de cobertura con color semántico (verde=100%, azul=80%, amarillo=60-70%, gris<60%)
- Buscador en tiempo real que filtra por nombre o categoría

**Pestaña "Farmacias Afiliadas"**:
- 6 farmacias con icono, nombre, badge de descuento, dirección, teléfono y horario

---

### `facturacion.html`
**Módulo**: Portal del Afiliado – Facturación y Pagos

**Características**:

**Resumen de cuenta** (3 métricas):
- Total facturado, total pagado, pendiente de pago (con borde amarillo de alerta)
- Los valores se calculan dinámicamente desde `facturasData`

**Aviso de pago pendiente**:
- Panel amarillo con icono, concepto, monto, vencimiento y botón "Pagar ahora"
- Se oculta automáticamente tras completar el pago

**Tabla de historial**:
- Columnas: N° factura, fecha formateada, concepto, monto formateado, estado con badge, comprobante
- Botón de impresión global (solo escritorio)

**Modal de pago**:
- Resumen con subtotal, ITBIS e ITBIS, total resaltado
- 3 métodos con iconos visuales: tarjeta / transferencia / efectivo (selección interactiva)
- Formulario de tarjeta con formateo automático del número (XXXX XXXX XXXX XXXX)
- Cierre con click fuera del modal
- Toast de confirmación tras pago exitoso

---

### `ARCHIVOS_MODIFICADOS.md`
**Este documento.** Registro detallado de todos los cambios para referencia del equipo.

---

## Notas Técnicas

### Patrón de datos de ejemplo
Los datos del portal (citas, recetas, facturas, médicos) son arrays JavaScript definidos en `main.js`. Siguen un patrón que facilita la migración a API real:

```js
// Ejemplo: para conectar a BD, reemplazar esto...
const citasEjemplo = [ /* datos estáticos */ ];

// ...con esto:
async function cargarCitas() {
  const res  = await fetch('conexionBD/getCitas.php');
  const data = await res.json();
  renderizarCitas(data.citas);
}
```

### Convención de atributos `data-*`
Las páginas del portal usan atributos `data-usuario` e `data-iniciales` en los elementos del DOM para que `verificarSesionPortal()` los actualice automáticamente con los datos reales del usuario sin necesidad de IDs específicos.

### Protección de rutas
`verificarSesionPortal()` en cada página del portal:
1. Llama a `check_session.php`
2. Si no hay sesión → redirige a `login.html`
3. Si hay sesión → actualiza todos los `[data-usuario]` y `[data-iniciales]`
4. Si hay error de red → activa el modo demo (útil para desarrollo sin backend)

### Soporte de impresión
Las páginas con comprobantes o recetas incluyen `@media print` en `style.css`:
- Oculta sidebar, topbar, header, footer y botones (`.no-print`)
- Quita sombras y fondos de las tarjetas
- Muestra solo el contenido relevante para imprimir
