<?php
// Database connection settings
$host = "localhost";
$username = "root";
$password = "";
$database = "student_registration";

// Create connection
$conn = mysqli_connect($host, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Optional: set charset to avoid text issues
mysqli_set_charset($conn, "utf8");
?>