# MediSalud ARS – Portal de Salud Digital

Sistema web completo de Administradora de Riesgos de Salud (ARS) para la República Dominicana.  
Permite a los afiliados gestionar su salud, citas, recetas y pagos desde cualquier dispositivo.

---

## Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Requisitos del Sistema](#requisitos-del-sistema)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Guía de Páginas – Sitio Público](#guía-de-páginas--sitio-público)
7. [Guía de Páginas – Portal del Afiliado](#guía-de-páginas--portal-del-afiliado)
8. [Base de Datos](#base-de-datos)
9. [Sistema de Diseño](#sistema-de-diseño)
10. [Flujo de Autenticación](#flujo-de-autenticación)
11. [Funciones JavaScript Principales](#funciones-javascript-principales)
12. [Responsive Design](#responsive-design)
13. [División de Trabajo](#división-de-trabajo)
14. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Descripción del Proyecto

MediSalud ARS es una plataforma web que digitaliza los servicios de una aseguradora de salud:

- **Sitio público**: información de planes, servicios, directorio médico y formulario de contacto.
- **Portal privado**: dashboard del afiliado con citas, recetas, telemedicina, perfil y facturación.
- **Backend PHP**: autenticación con sesiones, registro y recuperación de contraseña conectados a MySQL.

---

## Estructura de Archivos

```
Proyecto_MediSalud-master/
│
├── index.html              – Redirección automática a inicio.html
│
├── ── SITIO PÚBLICO ──
├── inicio.html             – Landing page principal rediseñada
├── login.html              – Formulario de inicio de sesión
├── register.html           – Formulario de registro de usuario
├── recover.html            – Recuperación de contraseña
├── servicios.html          – Catálogo de servicios médicos
├── planes.html             – Planes de salud disponibles (Básico, Premium, Familiar)
├── nosotros.html           – Información institucional
├── contacto.html           – Formulario de contacto
├── privacidad.html         – Políticas de privacidad
├── terminos.html           – Términos de uso
│
├── ── PORTAL DEL AFILIADO (requieren sesión activa) ──
├── dashboard.html          – Panel principal del usuario
├── perfil.html             – Datos personales e historial médico
├── medicos.html            – Directorio de médicos y centros afiliados
├── citas.html              – Solicitar, ver y cancelar citas médicas
├── telemedicina.html       – Chat médico en línea y formulario de consulta
├── recetas.html            – Recetas, catálogo de medicamentos y farmacias
├── facturacion.html        – Estado de cuenta, historial de pagos y comprobantes
│
├── style.css               – Estilos personalizados (animaciones, portal, badges, chat...)
├── main.js                 – JavaScript principal con todos los módulos
│
├── conexionBD/             – Backend PHP
│   ├── config.php          – Configuración de la base de datos
│   ├── check_session.php   – Verifica sesión activa → JSON {loggedin, usuario, id}
│   ├── login_process.php   – Procesa inicio de sesión → JSON {exito, mensaje}
│   ├── register_process.php– Procesa el registro → JSON {exito, mensaje}
│   ├── logout.php          – Destruye sesión y redirige
│   ├── recover_password.php– Lógica de recuperación
│   ├── daoAfiliados.php    – Acceso a datos de afiliados
│   ├── daoPlanes.php       – Acceso a datos de planes
│   └── registrarAfiliado.php– Inserción de nuevo afiliado
│
└── img/                    – Imágenes del proyecto
    ├── Logo .png
    ├── LogoSolo.png
    ├── inicio_v2.png
    └── ...
```

---

## Tecnologías Utilizadas

| Capa | Tecnología | Uso |
|------|-----------|-----|
| Frontend | HTML5 | Estructura semántica de todas las páginas |
| Frontend | Tailwind CSS (CDN) | Layout, utilidades y componentes |
| Frontend | CSS3 personalizado (`style.css`) | Animaciones, portal, badges, chat, stepper |
| Frontend | JavaScript ES6+ (`main.js`) | Interactividad, validaciones, render dinámico |
| Backend | PHP 7.4+ | Sesiones, autenticación, consultas a BD |
| Base de datos | MySQL / MariaDB | Almacenamiento de afiliados y planes |
| Tipografía | Google Fonts – Inter | Fuente principal del proyecto |

---

## Requisitos del Sistema

- **Servidor local**: XAMPP, WAMP, MAMP o Laragon
- **PHP** 7.4 o superior
- **MySQL** 5.7 o MariaDB 10.4+
- **Navegador moderno**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Conexión a internet (para cargar Tailwind CSS y la fuente Inter desde CDN)

---

## Instalación y Configuración

### Paso 1 – Copiar el proyecto al servidor local

```bash
# Coloca la carpeta dentro de htdocs (XAMPP) o www (WAMP/MAMP)
cp -r Proyecto_MediSalud-master/ /xampp/htdocs/medisalud/
```

### Paso 2 – Crear la base de datos

Abre **phpMyAdmin** en `http://localhost/phpmyadmin` y ejecuta:

```sql
CREATE DATABASE medisalud
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE medisalud;

-- Tabla principal de usuarios / afiliados
CREATE TABLE usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100)  NOT NULL,
  apellido    VARCHAR(100)  NOT NULL,
  cedula      VARCHAR(11)   NOT NULL UNIQUE,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  usuario     VARCHAR(80)   NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,           -- hash bcrypt
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de planes de salud
CREATE TABLE planes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100)  NOT NULL,
  precio      DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  activo      TINYINT(1) DEFAULT 1
);

-- Planes iniciales de ejemplo
INSERT INTO planes (nombre, precio, descripcion) VALUES
  ('Plan Básico',   3000.00, 'Consultas médicas, emergencias, descuento medicamentos, laboratorios básicos'),
  ('Plan Premium',  5500.00, 'Consultas ilimitadas, hospitalización, medicamentos, laboratorios completos, especialistas'),
  ('Plan Familiar', 4000.00, 'Cobertura para 4 personas, consultas, emergencias, hospitalización, medicamentos');
```

### Paso 3 – Configurar la conexión

Edita `conexionBD/config.php` con tus credenciales:

```php
<?php
define('DB_HOST',    'localhost');
define('DB_USER',    'root');       // tu usuario de MySQL
define('DB_PASS',    '');           // tu contraseña de MySQL
define('DB_NAME',    'medisalud');
define('DB_CHARSET', 'utf8mb4');
?>
```

### Paso 4 – Iniciar el servidor

1. Abre XAMPP Control Panel.
2. Inicia **Apache** y **MySQL**.
3. Abre `http://localhost/medisalud/` en el navegador.

### Paso 5 – Verificar funcionamiento

1. Verifica que carga la landing page de MediSalud.
2. Ve a **Registrarse** y crea una cuenta de prueba.
3. Inicia sesión → deberías llegar al portal (`dashboard.html`).

> **Sin servidor PHP**: Las páginas del portal funcionan en modo demo.  
> `verificarSesionPortal()` detecta el fallo de red y carga un usuario "Demo Usuario" automáticamente.

---

## Guía de Páginas – Sitio Público

### `inicio.html` – Landing Page

| Sección | Contenido |
|---------|-----------|
| Hero | Gradiente animado, texto principal, 3 botones CTA, panel de accesos rápidos al portal |
| Estadísticas | Contadores animados al hacer scroll: 150k afiliados, 800 médicos, 120 centros, 24/7 |
| ¿Por qué nosotros? | 3 tarjetas de valor: cobertura integral, respuesta rápida, portal digital |
| Cómo funciona | 3 pasos ilustrados: Regístrate → Elige plan → Disfruta |
| Servicios | 6 tarjetas con hover: consulta, emergencias, telemedicina, medicamentos, laboratorios, facturación |
| Testimonios | 3 testimonios de afiliados con nombre, ciudad, plan y rating |
| Contacto | Formulario validado + info de contacto + redes sociales |
| Footer | 4 columnas: branding, navegación, portal, legal |

### `login.html` – Inicio de Sesión
Tarjeta centrada con usuario, contraseña, enlace de recuperación y redirección automática al dashboard tras el login.

### `register.html` – Registro de Usuario
Campos: nombre, apellido, cédula (validada), email, usuario, contraseña.  
Validaciones en tiempo real con mensajes inline de color.

### `servicios.html` – Servicios
6 tarjetas con modal de detalle y enlace a planes.

### `planes.html` – Planes de Salud
3 tarjetas (Básico / Premium destacado / Familiar) con modal de confirmación que verifica sesión activa.

---

## Guía de Páginas – Portal del Afiliado

> Todas las páginas del portal llaman a `verificarSesionPortal()` al cargar.  
> Sin sesión activa → redirigen a `login.html`.

### `dashboard.html` – Panel Principal

- **Métricas**: citas del mes, plan activo, recetas activas, pagos pendientes.
- **Próxima cita**: datos del médico, fecha, hora, clínica y estado.
- **Accesos rápidos**: iconos hacia telemedicina, directorio, recetas y facturas.
- **Estado del plan**: tarjeta visual con beneficios incluidos.
- **Actividad reciente**: línea de tiempo de últimos eventos.
- **Aviso de pago**: alerta con botón de acción si hay factura pendiente.

### `perfil.html` – Mi Perfil

Tres secciones con botón **Editar / Guardar / Cancelar**:

1. **Datos personales**: nombre, cédula (solo lectura), nacimiento, sexo, teléfono, email, dirección.
2. **Historial médico**: tipo de sangre, peso, altura, presión, alergias, enfermedades crónicas, medicamentos actuales.
3. **Contacto de emergencia**: nombre, relación y teléfono.

### `medicos.html` – Directorio de Médicos y Centros

| Elemento | Detalle |
|---------|---------|
| Buscador | Por nombre o especialidad (tiempo real) |
| Filtros | Especialidad (12 opciones) + clínica/hospital |
| Checkbox | Mostrar solo disponibles |
| Tab Médicos | 12 tarjetas con disponibilidad, rating, experiencia, botón cita |
| Tab Centros | 6 clínicas con dirección, teléfono, horario y estado abierto/cerrado |

### `citas.html` – Citas Médicas

**Formulario de nueva cita** (panel colapsable):
- Stepper visual de 3 pasos (Médico → Fecha/Hora → Confirmar)
- Selección de médico con especialidad
- Fecha con selector de fecha mínima = hoy
- Selector visual de horarios disponibles (slots de 30 min)
- Campo de motivo de consulta

**Tabla de citas** con filtros por estado y acción de cancelación.

### `telemedicina.html` – Consultas en Línea

| Panel | Funcionalidad |
|-------|--------------|
| Chat en vivo | Indicador online, selector de médico, burbuja de mensajes, respuesta automática simulada |
| Formulario formal | Tipo, síntomas, duración, urgencia → procesado en < 4 horas |
| Historial | Últimas 3 consultas con estado (respondida / en revisión) |

### `recetas.html` – Recetas y Medicamentos

| Pestaña | Contenido |
|---------|-----------|
| Mis Recetas | Historial con diagnóstico, medicamentos (dosis, frecuencia, duración), botón imprimir |
| Catálogo | 12 medicamentos con categoría, cobertura (%) y descripción; buscador en tiempo real |
| Farmacias | 6 farmacias afiliadas con descuentos del 15% al 35%, dirección, teléfono y horario |

### `facturacion.html` – Facturación y Pagos

- **Métricas**: total facturado, total pagado, pendiente de pago.
- **Aviso** de pago con fecha de vencimiento y botón "Pagar ahora".
- **Tabla de facturas**: número, fecha, concepto, monto, estado, descarga de comprobante.
- **Modal de pago**: resumen con subtotal, 3 métodos de pago (tarjeta / transferencia / efectivo), formulario de tarjeta con formato automático.

---

## Base de Datos

### Tablas mínimas requeridas

```sql
usuarios   – Registro y autenticación de afiliados
planes     – Catálogo de planes de salud disponibles
```

### Endpoints PHP (todos devuelven JSON)

| Archivo | Método | Descripción |
|---------|--------|-------------|
| `check_session.php` | GET | `{"loggedin": true, "usuario": "Juan", "id": 1}` |
| `login_process.php` | POST | `{"exito": true, "mensaje": "Bienvenido"}` |
| `register_process.php` | POST | `{"exito": true, "mensaje": "Registro exitoso"}` |
| `logout.php` | GET | Destruye sesión → redirige a `inicio.html` |

---

## Sistema de Diseño

### Paleta de colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--primary` | `#1F6FB5` | Botones, links activos, íconos |
| `--primary-dark` | `#0F4C81` | Hover, sidebar, footer, hero |
| `--primary-light` | `#6EC1FF` | Fondos suaves, highlights |
| `--accent` | `#4CAF50` | Éxito, plan activo, naturaleza |
| `--danger` | `#E53E3E` | Errores, cancelaciones |
| `--warning` | `#F6AD55` | Pendientes, advertencias |

### Componentes CSS clave (`style.css`)

| Clase | Propósito |
|-------|-----------|
| `.portal-layout` | Grid sidebar + contenido (col 260px + 1fr) |
| `.portal-card` | Tarjeta blanca con borde y sombra suave |
| `.metric-card` | Tarjeta de KPI con icono y valor grande |
| `.badge` + variantes | Etiquetas de estado con color semántico |
| `.sidebar-link` | Enlace de nav con estado `.active` |
| `.data-table` | Tabla con cabecera gris y hover en filas |
| `.chat-msg` | Burbuja de chat `.sent` / `.received` |
| `.time-slot` | Selector visual de horarios para citas |
| `.stepper` | Indicador de progreso en pasos |
| `.modal-overlay` | Modal con backdrop con blur |
| `.toast` | Notificación flotante temporal |
| `.skeleton` | Loader animado tipo esqueleto (shimmer) |
| `.form-control` | Input/select/textarea con estilo unificado |

### Animaciones disponibles

```css
.anim-fade-in        /* Aparece desde abajo */
.anim-fade-in-left   /* Aparece desde la izquierda */
.anim-fade-in-right  /* Aparece desde la derecha */
.anim-delay-1 a 5    /* Retrasos de 0.1s a 0.5s */
```

---

## Flujo de Autenticación

```
Usuario visita inicio.html
         ↓
  Header llama check_session.php
         ↓
  ¿loggedin = true?
     /         \
   SÍ           NO
    ↓             ↓
Botón         Botones
"Mi Portal"   "Iniciar sesión"
"Cerrar ses." "Registrarse"
    ↓
Usuario hace clic en página del portal
(dashboard, citas, recetas, etc.)
         ↓
verificarSesionPortal() → check_session.php
         ↓
  ¿loggedin = true?
     /         \
   SÍ           NO
    ↓             ↓
 Carga la    Redirige a
  página     login.html
```

---

## Funciones JavaScript Principales

| Función | Módulo | Descripción |
|---------|--------|-------------|
| `mostrarToast(texto, tipo)` | Utilidades | Notificación flotante con icono |
| `mostrarMensaje(id, texto, tipo)` | Utilidades | Mensaje inline en formularios |
| `verificarSesion()` | Sesión | Actualiza header de páginas públicas |
| `verificarSesionPortal(cb)` | Sesión | Protege el portal; redirige si no hay sesión |
| `cerrarSesion()` | Sesión | Confirma y llama a logout.php |
| `toggleMenu()` | Menú | Abre/cierra menú hamburguesa (móvil) |
| `toggleSidebar()` | Portal | Abre/cierra sidebar en móvil |
| `filtrarMedicos()` | Directorio | Aplica filtros al listado de médicos |
| `renderizarMedicos(lista)` | Directorio | Genera tarjetas HTML de médicos |
| `solicitarCitaMedico(id, nombre, esp)` | Directorio | Pre-rellena y redirige a citas |
| `renderizarCitas(lista)` | Citas | Genera tabla HTML de citas |
| `procesarNuevaCita(event)` | Citas | Valida y agrega cita a la lista |
| `cancelarCita(id)` | Citas | Cambia estado con confirmación |
| `enviarMensajeChat(event)` | Telemedicina | Envía y muestra mensaje de chat |
| `agregarMensajeChat(texto, tipo)` | Telemedicina | Inserta burbuja en el chat |
| `renderizarRecetas()` | Recetas | Genera tarjetas de historial de recetas |
| `renderizarFacturas()` | Facturación | Genera tabla y actualiza métricas |
| `habilitarEdicionPerfil()` | Perfil | Activa campos del formulario |
| `animarContadores()` | Landing | Anima números estadísticos al scroll |
| `activarTab(tabId, btnEl)` | General | Sistema de pestañas reutilizable |

---

## Responsive Design

| Breakpoint | Ancho | Cambios principales |
|-----------|-------|---------------------|
| Móvil | < 768px | Sidebar oculto (deslizable con overlay), hamburguesa en topbar, tablas con scroll horizontal |
| Tablet | 768px–1024px | Sidebar visible, grid de 2 columnas, menú colapsado |
| Escritorio | > 1024px | Sidebar fijo, grid de 3–4 columnas, tabla completa |

---

## División de Trabajo

| Integrante | Área |
|-----------|------|
| **Josue (líder)** | HTML, CSS, JS, PHP — validaciones, interacción dinámica, conexión con BD, supervisión general |
| **Hander (colíder)** | MariaDB — estructura y base de datos |
| **Kleiber** | HTML, JS — estructura y contenido de las páginas |
| **Alba** | CSS, JS — diseño responsivo y estilo visual |

---

## Preguntas Frecuentes

**¿Funciona sin servidor PHP?**  
Sí. Si `check_session.php` no responde, el portal carga en modo demo con un usuario ficticio. Toda la interactividad del portal (citas, recetas, facturas) usa datos de ejemplo definidos en `main.js`.

**¿Los datos del portal son reales?**  
No. Son datos de demostración en JavaScript. En producción, cada función `renderizar*()` debería hacer un `fetch()` a un endpoint PHP que consulte la base de datos.

**¿El chat de telemedicina es funcional?**  
Es una simulación. Para producción se recomienda integrar WebSockets (Socket.io), Firebase Realtime Database o Pusher.

**¿Cómo conecto el portal a la BD real?**  
Reemplaza los arrays `citasEjemplo`, `recetasData`, `facturasData` y `medicosData` en `main.js` con llamadas `fetch()` a endpoints PHP que devuelvan JSON con los mismos campos.

**¿El pago en facturación es real?**  
No. Es una simulación de UI. Para pagos reales se debe integrar un gateway como Azul Payments o PayPal.

---

## Licencia

Proyecto académico – MediSalud ARS © 2026  
República Dominicana · Todos los derechos reservados.
