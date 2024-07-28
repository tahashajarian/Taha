<?php
$servername = "127.0.0.1";
$username = "h215195_taha";
$password = "jJ1-hI2-eX1_cF5_";
$dbname = "h215195_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Fetch the latest painting from the database
$sql = "SELECT image_data FROM paintings ORDER BY id DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // Output the latest image data
  $row = $result->fetch_assoc();
  echo $row['image_data'];
} else {
  echo "";
}

$conn->close();
?>