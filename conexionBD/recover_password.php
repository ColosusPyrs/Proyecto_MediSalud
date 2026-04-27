<?php
require 'config.php';

// Recibir email
$email = isset($_POST['email']) ? limpiar($_POST['email']) : '';

$respuesta = array('exito' => false, 'mensaje' => '');

if (empty($email)) {
    $respuesta['mensaje'] = 'Por favor ingrese su email.';
    echo json_encode($respuesta);
    exit;
}

// Buscar email en BD
$query = "SELECT UsuarioID, Username, Email FROM usuario WHERE Email = '$email'";
$resultado = $conn->query($query);

if ($resultado->num_rows == 1) {
    $fila = $resultado->fetch_assoc();
    
    // Generar token (simple, válido por 1 hora)
    $token = bin2hex(random_bytes(16));
    $expiracion = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    // Para simplificar, solo mostramos el enlace
    $respuesta['exito'] = true;
    $respuesta['mensaje'] = 'Se ha enviado un enlace de recuperación. (Simular envío de email)';
    $respuesta['enlace_simulado'] = "reset_password.html?token=$token&email=$email";
} else {
    $respuesta['mensaje'] = 'Email no encontrado.';
}

echo json_encode($respuesta);
$conn->close();
?>