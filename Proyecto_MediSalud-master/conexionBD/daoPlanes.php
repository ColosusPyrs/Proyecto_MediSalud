<?php
require_once "config.php"; // Importa la conexión

// Insertar un nuevo plan
function insertarPlan($nombre, $coberturaDescripcion, $tarifaEmpleado, $tarifaPatronal) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO Plan (Nombre, CoberturaDescripcion, TarifaEmpleado, TarifaPatronal) 
                            VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssdd", $nombre, $coberturaDescripcion, $tarifaEmpleado, $tarifaPatronal);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

// Obtener todos los planes
function obtenerPlanes() {
    global $conn;
    $sql = "SELECT * FROM Plan";
    $resultado = $conn->query($sql);
    $planes = [];
    while ($fila = $resultado->fetch_assoc()) {
        $planes[] = $fila;
    }
    return $planes;
}

// Obtener un plan por ID
function obtenerPlanPorID($id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM Plan WHERE PlanID = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $plan = $resultado->fetch_assoc();
    $stmt->close();
    return $plan;
}

// Actualizar un plan
function actualizarPlan($id, $nombre, $coberturaDescripcion, $tarifaEmpleado, $tarifaPatronal) {
    global $conn;
    $stmt = $conn->prepare("UPDATE Plan 
                            SET Nombre=?, CoberturaDescripcion=?, TarifaEmpleado=?, TarifaPatronal=? 
                            WHERE PlanID=?");
    $stmt->bind_param("ssddi", $nombre, $coberturaDescripcion, $tarifaEmpleado, $tarifaPatronal, $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

// Eliminar un plan
function eliminarPlan($id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM Plan WHERE PlanID = ?");
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}
?>