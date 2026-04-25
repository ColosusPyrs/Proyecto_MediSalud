<?php
// Datos de conexión (ajusta según tu entorno en Laragon)
$host = "localhost";       // Servidor de la BD
$user = "root";            // Usuario (por defecto en Laragon suele ser root)
$password = "";            // Contraseña (vacía en Laragon por defecto)
$dbname = "sistema_seguro_salud_ars"; // Nombre de la BD

// Crear conexión
$conn = new mysqli($host, $user, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Opcional: configurar charset para evitar problemas con acentos/ñ
$conn->set_charset("utf8");
?>