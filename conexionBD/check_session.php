<?php
require 'config.php';

// Respuesta JSON
$respuesta = array(
    'loggedin' => isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true,
    'usuario' => isset($_SESSION['usuario']) ? $_SESSION['usuario'] : null,
    'rol' => isset($_SESSION['rol']) ? $_SESSION['rol'] : null,
    'email' => isset($_SESSION['email']) ? $_SESSION['email'] : null
);

echo json_encode($respuesta);
?>