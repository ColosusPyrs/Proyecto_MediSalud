<?php
require 'config.php';

verificar_sesion_activa();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respuesta_json(false, 'Método no permitido');
}

$usuario_id = $_SESSION['usuario_id'] ?? null;

if (!$usuario_id) {
    respuesta_json(false, 'Usuario no encontrado en sesión');
}

// Recibir datos JSON
$datos = json_decode(file_get_contents('php://input'), true);

if (!$datos) {
    respuesta_json(false, 'Datos inválidos');
}

$telefono = limpiar($datos['telefono'] ?? '');
$alergias = limpiar($datos['alergias'] ?? '');
$enfermedades = limpiar($datos['enfermedades'] ?? '');
$medicamentos = limpiar($datos['medicamentos'] ?? '');
$cirugias = limpiar($datos['cirugias'] ?? '');

// Validar teléfono
if (!empty($telefono) && !preg_match('/^[\d\-\+\s]+$/', $telefono)) {
    respuesta_json(false, 'Teléfono inválido');
}

// Actualizar datos del afiliado
$query_afiliado = "UPDATE afiliado SET Telefono = ? WHERE AfiliadoID = ?";
$stmt = $conn->prepare($query_afiliado);
$stmt->bind_param('si', $telefono, $usuario_id);

if (!$stmt->execute()) {
    respuesta_json(false, 'Error al actualizar datos personales: ' . $stmt->error);
}

// Actualizar o crear historial médico
$query_historial = "UPDATE historial_medico 
    SET Alergias = ?, 
        Enfermedades_Cronicas = ?, 
        Medicamentos_Actuales = ?, 
        Cirugias_Previas = ?
    WHERE AfiliadoID = ?";

$stmt_historial = $conn->prepare($query_historial);
$stmt_historial->bind_param('ssssi', $alergias, $enfermedades, $medicamentos, $cirugias, $usuario_id);

if (!$stmt_historial->execute()) {
    respuesta_json(false, 'Error al actualizar historial médico: ' . $stmt_historial->error);
}

respuesta_json(true, 'Perfil actualizado correctamente');

$stmt->close();
$stmt_historial->close();
?>