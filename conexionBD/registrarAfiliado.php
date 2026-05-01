<?php
require_once "daoAfiliados.php";
require_once "config.php"; // conexión directa para insertar usuario

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validar campos obligatorios
    if (empty($_POST["cedula"]) || empty($_POST["nombre"]) || empty($_POST["apellido"]) || empty($_POST["usuario"]) || empty($_POST["password"])) {
        echo "Todos los campos obligatorios deben completarse.";
        exit;
    }

    // Datos del afiliado
    $cedula   = $_POST["cedula"];
    $nombre   = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    $fechaNacimiento = isset($_POST["fechaNacimiento"]) ? $_POST["fechaNacimiento"] : null;
    $direccion       = isset($_POST["direccion"]) ? $_POST["direccion"] : "";
    $telefono        = isset($_POST["telefono"]) ? $_POST["telefono"] : "";
    $email           = isset($_POST["email"]) ? $_POST["email"] : "";
    $planID          = isset($_POST["planID"]) ? $_POST["planID"] : 1; // valor por defecto
    $imagenPath      = ""; // omitimos imagen

    // Insertar afiliado
    $resultadoAfiliado = insertarAfiliado($cedula, $nombre, $apellido, $fechaNacimiento, $direccion, $telefono, $email, $planID, $imagenPath);

    // Datos del usuario
    $usuario  = $_POST["usuario"];
    $password = $_POST["password"];
    $passwordHash = password_hash($password, PASSWORD_DEFAULT); // encriptar contraseña

    // Insertar usuario en tabla Usuario
    $stmt = $conn->prepare("INSERT INTO Usuario (Username, PasswordHash, Rol) VALUES (?, ?, ?)");
    $rol = "Afiliado"; // rol fijo
    $stmt->bind_param("sss", $usuario, $passwordHash, $rol);
    $resultadoUsuario = $stmt->execute();
    $stmt->close();

    if ($resultadoAfiliado && $resultadoUsuario) {
        // Redirigir al login
        header("Location: login.html");
        exit;
    } else {
        echo "Error al registrar: " . $conn->error;
    }
} else {
    echo "Acceso inválido.";
}
?>