# MediSalud — Sistema de Seguro de Salud

Sitio web estático para un sistema de seguro de salud (ARS) desarrollado como proyecto académico grupal.
Diseñado con **Tailwind CSS** e interactividad implementada en **JavaScript vanilla**.

---

## Estructura del proyecto (mapa de carpetas y archivos)

```
SistemaSeguroSalud/
├── img/                  # Imágenes (logo, hero, nosotros)
├── inicio.html           # Página principal
├── login.html            # Inicio de sesión
├── register.html         # Registro de usuario
├── planes.html           # Planes y precios
├── servicios.html        # Catálogo de servicios
├── nosotros.html         # Información institucional
├── contacto.html         # Formulario de contacto
├── privacidad.html       # Políticas de privacidad
├── terminos.html         # Términos de uso
├── main.js               # Toda la lógica JavaScript
└── style.css             # Estilos complementarios (mensajes JS)
```

---

## Páginas y contenido

### `inicio.html` — Página principal
- Hero con imagen de fondo y botones de llamada a la acción.
- Sección de 6 servicios destacados con íconos SVG.
- Formulario de contacto rápido integrado.
- Información de contacto y redes sociales.

### `login.html` — Inicio de sesión
- Card centrada con campos de usuario y contraseña.
- Botón conectado a la función `iniciarSesion()`.
- Muestra mensajes de error/éxito sin recargar la página.

### `register.html` — Registro
- Formulario con campos: nombre, apellido, cédula, usuario y contraseña.
- Botón conectado a la función `registrar()`.
- Muestra mensajes de validación en tiempo real.

### `planes.html` — Planes y Programas
- Tres tarjetas de precio: **Básico**, **Premium** y **Familiar**.
- El Plan Premium aparece destacado con badge "MÁS POPULAR" y escala mayor.
- Al pulsar "Elegir Plan" se abre un modal de confirmación sin recargar.

### `servicios.html` — Servicios
- Grid de 6 tarjetas con íconos y color único por categoría.
- Botón "Ver más" abre un modal con descripción expandida del servicio.
- Modal incluye enlace directo a la página de planes.

### `nosotros.html` — Sobre nosotros
- Hero con imagen institucional.
- Tarjetas de Misión y Visión.
- Sección de Valores con fondo degradado.
- Tarjetas de Equipo y Contacto.

### `contacto.html` — Contacto
- Formulario completo conectado a `enviarContacto()`.
- Panel lateral con dirección, teléfono, email y horario de atención.
- Botones de redes sociales con colores de marca.

### `privacidad.html` y `terminos.html` — Legal
- Artículos numerados con badges circulares.
- Diseño limpio tipo documento con separadores.

---

## JavaScript — `main.js`

Toda la lógica del lado del cliente está centralizada en este archivo.

### Funciones implementadas

| Función | Descripción |
|---|---|
| `iniciarSesion()` | Valida campos vacíos, busca credenciales en `localStorage` y redirige al inicio si son correctas. |
| `registrar()` | Valida nombre/apellido (solo letras), cédula dominicana (11 dígitos), contraseña (mínimo 6 caracteres) y usuario único. Guarda el usuario en `localStorage`. |
| `elegirPlan(nombre, precio, beneficios)` | Abre el modal de confirmación de plan con los datos del plan seleccionado. |
| `confirmarPlan()` | Verifica si hay sesión activa antes de confirmar. Si no hay sesión, redirige al login. |
| `cerrarModalPlan()` | Cierra el modal de planes. |
| `verMasServicio(nombre, descripcion)` | Abre el modal de detalle del servicio seleccionado. |
| `cerrarModalServicio()` | Cierra el modal de servicios. |
| `enviarContacto()` | Valida nombre, formato de email y longitud mínima del mensaje (10 caracteres). Muestra confirmación y limpia el formulario. |
| `mostrarMensaje(id, texto, tipo)` | Función utilitaria que muestra mensajes de error o éxito en el elemento indicado. |

### Validaciones aplicadas

| Campo | Regla |
|---|---|
| Campos de login | No pueden estar vacíos |
| Nombre y apellido | Solo letras y espacios (sin números ni símbolos) |
| Cédula | Exactamente 11 dígitos numéricos (guiones opcionales, ej: `001-1234567-8`) |
| Contraseña | Mínimo 6 caracteres |
| Usuario | No puede repetirse entre registros |
| Email (contacto) | Formato válido con `@` y dominio |
| Mensaje (contacto) | Mínimo 10 caracteres |

### Persistencia de datos
Los usuarios registrados se guardan en `localStorage` bajo la clave `usuarios` (array de objetos).
El usuario activo se guarda bajo la clave `usuarioActivo` al iniciar sesión.

---

## Diseño — Tailwind CSS

Se usa **Tailwind CSS vía CDN** (`https://cdn.tailwindcss.com`) con colores personalizados definidos en cada página:

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#1F6FB5', dark: '#0F4C81', light: '#6EC1FF' },
        accent:   '#4CAF50',
      }
    }
  }
}
```

### Elementos de diseño consistentes

- **Header sticky** con logo, botones de sesión y barra de navegación con enlace activo subrayado.
- **Hero sections** con gradiente azul oscuro → azul principal o imagen con overlay.
- **Cards** con bordes redondeados (`rounded-2xl`, `rounded-3xl`), sombra y efecto hover.
- **Modales** con backdrop semitransparente y tarjeta centrada animada.
- **Footer de 3 columnas** sobre fondo azul oscuro con logo, navegación y legal.
- **`style.css`** contiene únicamente los estilos `.mensaje.error` y `.mensaje.exito` que JavaScript aplica dinámicamente.

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de todas las páginas |
| Tailwind CSS (CDN) | Diseño visual y responsivo |
| JavaScript (vanilla) | Validaciones, modales e interactividad |
| localStorage | Persistencia de usuarios y sesión |
| CSS3 | Estilos de mensajes de validación JS |

---

## División de trabajo

| Integrante | Área |
|---|---|
| **Josue (líder)** | HTML, CSS, JS, PHP — Validaciones, interacción dinámica, conexión con HTML a DB, asistencia y supervisión de todo el equipo y proyecto |
| **Hander (colíder)** | MariaDB — Estructura y base de datos |
| **Kleiber** | HTML, JS — Estructura y contenido de las páginas |
| **Alba** | CSS, JS, CSS — Diseño responsivo y estilo de la Web |

---

## Cómo usar el proyecto

1. Abrir `inicio.html` en cualquier navegador moderno.
2. Navegar al registro (`register.html`) y crear una cuenta.
3. Iniciar sesión en `login.html` con las credenciales creadas.
4. Explorar servicios, planes y el formulario de contacto.

> No requiere servidor ni instalación. Funciona directamente desde el sistema de archivos.

---

## Notas

- Los datos de registro se guardan en el `localStorage` del navegador. Al limpiar el navegador se pierden.
- Los formularios de contacto no envían emails reales; muestran confirmación visual únicamente.
- Las imágenes deben estar en la carpeta `img/` con los nombres: `Logo .png`, `inicio.png`, `nosotros.png`.
- La BD aún no ha sido implementada, intentaremos implementarla prontamente (Esto puede cambiar, ya sea BD no implementada por falta de tiempo o BD implementada).
