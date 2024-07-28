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

// Get the image data from the POST request
$image_data = $_POST['image_data'];

// Insert the image data into the database
$sql = "INSERT INTO paintings (image_data) VALUES ('$image_data')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>