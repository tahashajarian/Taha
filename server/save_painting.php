<?php
header('Content-Type: application/json');
require __DIR__ . '/db.php';
$response = ['success' => false, 'message' => ''];

// Must match CANVAS_WIDTH / CANVAS_HEIGHT in src/components/UI/PaintingCanvas.jsx
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;
// A full, noisy 1200x900 PNG stays well under this as base64
const MAX_PAYLOAD_BYTES = 6 * 1024 * 1024;

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("POST required");
    }

    // Validate input
    if (!isset($_POST['image_data'])) {
        throw new Exception("No image data received");
    }

    $image_data = $_POST['image_data'];

    // 1. Check for empty or oversized data
    if (empty($image_data)) {
        throw new Exception("Empty image data");
    }
    if (strlen($image_data) > MAX_PAYLOAD_BYTES) {
        throw new Exception("Image too large");
    }

    // 2. Validate base64 format
    if (!preg_match('/^data:image\/(png|jpeg);base64,/', $image_data)) {
        throw new Exception("Invalid image format");
    }

    // 3. Extract and decode image
    $base64 = preg_replace('/^data:image\/(png|jpeg);base64,/', '', $image_data);
    $binary = base64_decode($base64, true);
    if ($binary === false) {
        throw new Exception("Failed to decode image");
    }

    // Check dimensions from the header before decoding the full bitmap
    $info = getimagesizefromstring($binary);
    if ($info === false || $info[0] > MAX_WIDTH || $info[1] > MAX_HEIGHT) {
        throw new Exception("Invalid image size");
    }

    $image = imagecreatefromstring($binary);

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
    $conn = painting_db();
    $stmt = $conn->prepare("INSERT INTO paintings (image_data) VALUES (?)");
    if ($stmt === false) {
        error_log('painting prepare failed: ' . $conn->error);
        throw new Exception("Could not save painting");
    }
    $stmt->bind_param("s", $image_data);
    
    if ($stmt->execute()) {
        $response = [
            'success' => true,
            'message' => 'Painting saved successfully',
            'id' => $stmt->insert_id
        ];
    } else {
        error_log('painting insert failed: ' . $stmt->error);
        throw new Exception("Could not save painting");
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}

echo json_encode($response);
?>