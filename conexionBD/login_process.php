<?php
require 'config.php';

// Recibir datos
$usuario = isset($_POST['usuario']) ? limpiar($_POST['usuario']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

$respuesta = array('exito' => false, 'mensaje' => '');

// Validar campos
if (empty($usuario) || empty($password)) {
    $respuesta['mensaje'] = 'Usuario y contraseña son obligatorios.';
    echo json_encode($respuesta);
    exit;
}

// Buscar usuario en BD
$query = "SELECT u.UsuarioID, u.Username, u.Email, u.PasswordHash, u.RolID, r.Nombre as Rol, u.Estado 
          FROM usuario u 
          JOIN rol r ON u.RolID = r.RolID 
          WHERE u.Username = '$usuario' AND u.Estado = 'Activo'";

$resultado = $conn->query($query);

if ($resultado->num_rows == 1) {
    $fila = $resultado->fetch_assoc();
    
    // Verificar contraseña
    if (verificar_password($password, $fila['PasswordHash'])) {
        // Contraseña correcta - crear sesión
        $_SESSION['usuario_id'] = $fila['UsuarioID'];
        $_SESSION['usuario'] = $fila['Username'];
        $_SESSION['email'] = $fila['Email'];
        $_SESSION['rol'] = $fila['Rol'];
        $_SESSION['loggedin'] = true;
        
        // Actualizar último acceso
        $conn->query("UPDATE usuario SET FechaUltimoAcceso = NOW() WHERE UsuarioID = " . $fila['UsuarioID']);
        
        $respuesta['exito'] = true;
        $respuesta['mensaje'] = 'Bienvenido, ' . $fila['Username'] . '!';
        $respuesta['rol'] = $fila['Rol'];
    } else {
        $respuesta['mensaje'] = 'Contraseña incorrecta.';
    }
} else {
    $respuesta['mensaje'] = 'Usuario no encontrado.';
}

echo json_encode($respuesta);
$conn->close();
?>