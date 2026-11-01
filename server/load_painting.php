<?php
require __DIR__ . '/db.php';

try {
  $conn = painting_db();
} catch (Exception $e) {
  http_response_code(503);
  die("");
}

// Fetch the latest painting from the database
$sql = "SELECT image_data FROM paintings ORDER BY id DESC LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
  // Output the latest image data
  $row = $result->fetch_assoc();
  echo $row['image_data'];
} else {
  echo "";
}

$conn->close();
?>
