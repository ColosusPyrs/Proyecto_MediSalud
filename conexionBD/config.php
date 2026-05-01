<?php
// config.php - Configuración de BD MySQL en InfinityFree

session_start();

// ===== DATOS DE CONEXIÓN A INFINITYFREE =====
$host = 'sql301.infinityfree.com';
$user = 'if0_41785041';
$password = 'xUmZWXATUpwYIi';
$database = 'if0_41785041_medisalud_ars';
$port = 3306;

// ===== CONEXIÓN A BD MYSQL =====
$conn = new mysqli($host, $user, $password, $database, $port);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['exito' => false, 'mensaje' => 'Error de conexión a la BD: ' . $conn->connect_error]));
}

// Establecer charset UTF-8
$conn->set_charset("utf8mb4");

// ===== FUNCIONES ÚTILES =====

/**
 * Limpiar datos de entrada
 */
function limpiar($dato) {
    global $conn;
    return $conn->real_escape_string(trim($dato));
}

/**
 * Hashear contraseña con BCRYPT
 */
function hashear_password($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
}

/**
 * Verificar contraseña
 */
function verificar_password($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Retornar respuesta JSON
 */
function respuesta_json($exito, $mensaje, $datos = null) {
    header('Content-Type: application/json; charset=utf-8');
    $respuesta = [
        'exito' => $exito,
        'mensaje' => $mensaje
    ];
    if ($datos !== null) {
        $respuesta['datos'] = $datos;
    }
    echo json_encode($respuesta);
    exit;
}

/**
 * Validar email
 */
function validar_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Validar cédula (formato básico)
 */
function validar_cedula($cedula) {
    return preg_match('/^\d{3}-\d{7}-\d{1}$/', $cedula);
}

/**
 * Obtener usuario de la sesión
 */
function obtener_usuario_sesion() {
    return isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true ? $_SESSION : null;
}

/**
 * Verificar si usuario está logueado
 */
function verificar_sesion_activa() {
    if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
        respuesta_json(false, 'Sesión no activa. Por favor inicia sesión.');
    }
}

?>