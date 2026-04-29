<?php
// config.php - Configuración de BD y sesiones

// Iniciar sesión
session_start();

// Datos de conexión a BD
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'DB_MediSalud_ARS';

// Conectar a la BD
$conn = new mysqli($host, $user, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Configurar charset
$conn->set_charset("utf8mb4");

// Función para limpiar datos
function limpiar($dato) {
    global $conn;
    return $conn->real_escape_string(trim($dato));
}

// Función para hashear contraseña
function hashear_password($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Función para verificar contraseña
function verificar_password($password, $hash) {
    return password_verify($password, $hash);
}
?>