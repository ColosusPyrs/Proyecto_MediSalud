<?php
require 'config.php';

// Recibir datos del formulario
$nombre = isset($_POST['nombre']) ? limpiar($_POST['nombre']) : '';
$apellido = isset($_POST['apellido']) ? limpiar($_POST['apellido']) : '';
$cedula = isset($_POST['cedula']) ? limpiar($_POST['cedula']) : '';
$email = isset($_POST['email']) ? limpiar($_POST['email']) : '';
$usuario = isset($_POST['usuario']) ? limpiar($_POST['usuario']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Respuesta JSON
$respuesta = array('exito' => false, 'mensaje' => '');

// Validaciones básicas
if (empty($nombre) || empty($apellido) || empty($cedula) || empty($email) || empty($usuario) || empty($password)) {
    $respuesta['mensaje'] = 'Todos los campos son obligatorios.';
    echo json_encode($respuesta);
    exit;
}

if (strlen($password) < 6) {
    $respuesta['mensaje'] = 'La contraseña debe tener al menos 6 caracteres.';
    echo json_encode($respuesta);
    exit;
}

// Verificar si el usuario ya existe
$query_check = "SELECT UsuarioID FROM usuario WHERE Username = '$usuario' OR Email = '$email'";
$resultado_check = $conn->query($query_check);

if ($resultado_check->num_rows > 0) {
    $respuesta['mensaje'] = 'El usuario o email ya está registrado.';
    echo json_encode($respuesta);
    exit;
}

// Hashear contraseña
$password_hasheada = hashear_password($password);

// Obtener RolID del rol 'Paciente'
$query_rol = "SELECT RolID FROM rol WHERE Nombre = 'Paciente'";
$resultado_rol = $conn->query($query_rol);
$fila_rol = $resultado_rol->fetch_assoc();
$rol_id = $fila_rol['RolID'];

// Insertar usuario en la tabla usuario
$query_usuario = "INSERT INTO usuario (Username, Email, PasswordHash, RolID, Estado) 
                  VALUES ('$usuario', '$email', '$password_hasheada', $rol_id, 'Activo')";

if ($conn->query($query_usuario)) {
    $usuario_id = $conn->insert_id;
    
    // Insertar afiliado en la tabla afiliado
    $query_afiliado = "INSERT INTO afiliado (Cedula, Nombre, Apellido, FechaNacimiento, Genero, Email, PlanID, Estado) 
                       VALUES ('$cedula', '$nombre', '$apellido', '2000-01-01', 'M', '$email', 1, 'Activo')";
    
    if ($conn->query($query_afiliado)) {
        $respuesta['exito'] = true;
        $respuesta['mensaje'] = 'Registro exitoso. Redirigiendo...';
    } else {
        $respuesta['mensaje'] = 'Error al crear perfil: ' . $conn->error;
    }
} else {
    $respuesta['mensaje'] = 'Error al registrar: ' . $conn->error;
}

echo json_encode($respuesta);
$conn->close();
?>