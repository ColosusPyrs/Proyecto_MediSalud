<?php
// Iniciar sesión
session_start();

// Destruir la sesión
session_destroy();

// Limpiar todas las variables de sesión
$_SESSION = array();

// Redirigir al inicio
header('Location: ../inicio.html');
exit;
?>