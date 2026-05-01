<?php
// Iniciar sesión sin output
session_start();
ob_start();

// Verificar si el usuario está logueado
$loggedin = isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true;

// Preparar respuesta
$respuesta = array(
    'loggedin' => $loggedin,
    'usuario' => $loggedin ? $_SESSION['usuario'] : null,
    'email' => $loggedin ? $_SESSION['email'] : null,
    'rol' => $loggedin ? $_SESSION['rol'] : null
);

// Enviar como JSON
header('Content-Type: application/json');
echo json_encode($respuesta);
?>