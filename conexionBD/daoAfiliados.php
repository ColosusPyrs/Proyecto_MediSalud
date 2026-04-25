<?php
require_once "config.php"; // Importa la conexión

// Insertar un nuevo afiliado
function insertarAfiliado($cedula, $nombre, $apellido, $fechaNacimiento, $direccion, $telefono, $email, $planID, $imagenPath) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO Afiliados (Cedula, Nombre, Apellido, FechaNacimiento, Direccion, Telefono, Email, PlanID, ImagenPath) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssis", $cedula, $nombre, $apellido, $fechaNacimiento, $direccion, $telefono, $email, $planID, $imagenPath);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

// Obtener todos los afiliados
function obtenerAfiliados() {
    global $conn;
    $sql = "SELECT * FROM Afiliados";
    $resultado = $conn->query($sql);
    $afiliados = [];
    while ($fila = $resultado->fetch_assoc()) {
        $afiliados[] = $fila;
    }
    return $afiliados;
}

// Obtener un afiliado por ID
function obtenerAfiliadoPorID($id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM Afiliados WHERE AfiliadoID = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $afiliado = $resultado->fetch_assoc();
    $stmt->close();
    return $afiliado;
}

// Actualizar datos de un afiliado
function actualizarAfiliado($id, $cedula, $nombre, $apellido, $fechaNacimiento, $direccion, $telefono, $email, $planID, $imagenPath) {
    global $conn;
    $stmt = $conn->prepare("UPDATE Afiliados 
                            SET Cedula=?, Nombre=?, Apellido=?, FechaNacimiento=?, Direccion=?, Telefono=?, Email=?, PlanID=?, ImagenPath=? 
                            WHERE AfiliadoID=?");
    $stmt->bind_param("sssssssis", $cedula, $nombre, $apellido, $fechaNacimiento, $direccion, $telefono, $email, $planID, $imagenPath);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

// Eliminar un afiliado
function eliminarAfiliado($id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM Afiliados WHERE AfiliadoID = ?");
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}
?>