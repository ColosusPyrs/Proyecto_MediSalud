<?php
require 'config.php';

verificar_sesion_activa();

$usuario_id = $_SESSION['usuario_id'] ?? null;

if (!$usuario_id) {
    respuesta_json(false, 'Usuario no encontrado en sesión');
}

// Obtener datos del afiliado (usuario)
$query = "SELECT 
    a.AfiliadoID,
    a.Nombre,
    a.Apellido,
    a.Cedula,
    a.FechaNacimiento,
    a.Genero,
    a.Email,
    a.Telefono,
    p.PlanID,
    p.Nombre AS plan_nombre,
    p.Descripcion AS plan_descripcion,
    p.CoberturaDescripcion AS cobertura_descripcion,
    p.PorcentajeCobertura AS porcentaje_cobertura,
    p.TarifaEmpleado AS tarifa_empleado,
    p.TarifaPatronal AS tarifa_patronal
FROM afiliado a
LEFT JOIN plan_salud p ON a.PlanID = p.PlanID
WHERE a.AfiliadoID = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param('i', $usuario_id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $usuario = $resultado->fetch_assoc();
    respuesta_json(true, 'Datos obtenidos correctamente', $usuario);
} else {
    respuesta_json(false, 'No se encontraron datos del usuario');
}

$stmt->close();
?>