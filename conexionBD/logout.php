<?php
session_start();

// Destruir sesión
session_destroy();

// Redirigir
header('Location: ../inicio.html');
exit;
?>