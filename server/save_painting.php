<?php
header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

// Database credentials
$servername = "127.0.0.1";
$username = "h215195_taha";
$password = "jJ1-hI2-eX1_cF5_";
$dbname = "h215195_db";

try {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Validate input
    if (!isset($_POST['image_data'])) {
        throw new Exception("No image data received");
    }

    $image_data = $_POST['image_data'];

    // 1. Check for empty data
    if (empty($image_data)) {
        throw new Exception("Empty image data");
    }

    // 2. Validate base64 format
    if (!preg_match('/^data:image\/(png|jpeg);base64,/', $image_data)) {
        throw new Exception("Invalid image format");
    }

    // 3. Extract and decode image
    $base64 = preg_replace('/^data:image\/(png|jpeg);base64,/', '', $image_data);
    $image = imagecreatefromstring(base64_decode($base64));
    
    if ($image === false) {
        throw new Exception("Failed to decode image");
    }

    // 4. Blank canvas detection
    $width = imagesx($image);
    $height = imagesy($image);
    $blank = true;
    
    // Check 20 random pixels
    for ($i = 0; $i < 20 && $blank; $i++) {
        $x = rand(0, $width - 1);
        $y = rand(0, $height - 1);
        $color = imagecolorat($image, $x, $y);
        $rgba = imagecolorsforindex($image, $color);
        
        if ($rgba['red'] < 250 || $rgba['green'] < 250 || $rgba['blue'] < 250) {
            $blank = false;
        }
    }
    
    imagedestroy($image);
    
    if ($blank) {
        throw new Exception("Cannot save blank/white canvas");
    }

    // 5. Secure database insertion
    $stmt = $conn->prepare("INSERT INTO paintings (image_data) VALUES (?)");
    $stmt->bind_param("s", $image_data);
    
    if ($stmt->execute()) {
        $response = [
            'success' => true,
            'message' => 'Painting saved successfully',
            'id' => $stmt->insert_id
        ];
    } else {
        throw new Exception("Database error: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
}

echo json_encode($response);
?>