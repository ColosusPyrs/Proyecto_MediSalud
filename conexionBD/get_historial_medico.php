<?php
require 'config.php';

verificar_sesion_activa();

$usuario_id = $_SESSION['usuario_id'] ?? null;

if (!$usuario_id) {
    respuesta_json(false, 'Usuario no encontrado en sesión');
}

// Obtener historial médico
$query = "SELECT 
    Alergias,
    Enfermedades_Cronicas,
    Medicamentos_Actuales,
    Cirugias_Previas,
    FamiliarActualizacion
FROM historial_medico
WHERE AfiliadoID = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param('i', $usuario_id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $historial = $resultado->fetch_assoc();
    // Convertir NULL a texto vacío
    $historial['alergias'] = $historial['Alergias'] ?? '';
    $historial['enfermedades_cronicas'] = $historial['Enfermedades_Cronicas'] ?? '';
    $historial['medicamentos_actuales'] = $historial['Medicamentos_Actuales'] ?? '';
    $historial['cirugias_previas'] = $historial['Cirugias_Previas'] ?? '';
    
    respuesta_json(true, 'Historial obtenido correctamente', $historial);
} else {
    // Si no existe historial, retornar vacío
    $historial_vacio = [
        'alergias' => '',
        'enfermedades_cronicas' => '',
        'medicamentos_actuales' => '',
        'cirugias_previas' => ''
    ];
    respuesta_json(true, 'Sin historial registrado', $historial_vacio);
}

$stmt->close();
?>