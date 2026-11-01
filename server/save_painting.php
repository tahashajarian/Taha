<?php
header('Content-Type: application/json');
require __DIR__ . '/db.php';
$response = ['success' => false, 'message' => ''];

// Must match CANVAS_WIDTH / CANVAS_HEIGHT in src/components/UI/PaintingCanvas.jsx
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;
// A full, noisy 1200x900 PNG stays well under this as base64
const MAX_PAYLOAD_BYTES = 6 * 1024 * 1024;
// Only the latest painting is shown, so only the latest is kept
const KEEP_PAINTINGS = 1;

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

    // 4. Blank canvas detection. The canvas background is transparent and the
    // default brush is white, so "blank" means every pixel is transparent.
    // Shrink to a thumbnail (averaging keeps thin strokes visible) and scan it
    // fully instead of sampling a few random pixels.
    $width = imagesx($image);
    $height = imagesy($image);
    $thumbW = 120;
    $thumbH = 90;
    $thumb = imagecreatetruecolor($thumbW, $thumbH);
    imagealphablending($thumb, false);
    imagesavealpha($thumb, true);
    imagefill($thumb, 0, 0, imagecolorallocatealpha($thumb, 0, 0, 0, 127));
    imagecopyresampled($thumb, $image, 0, 0, 0, 0, $thumbW, $thumbH, $width, $height);

    $blank = true;
    for ($y = 0; $y < $thumbH && $blank; $y++) {
        for ($x = 0; $x < $thumbW && $blank; $x++) {
            $rgba = imagecolorsforindex($thumb, imagecolorat($thumb, $x, $y));
            // GD alpha: 0 = opaque, 127 = fully transparent
            if ($rgba['alpha'] < 120) {
                $blank = false;
            }
        }
    }

    imagedestroy($thumb);
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

    // Prune everything older than the newest KEEP_PAINTINGS rows. A failure
    // here is only logged: the painting itself was already saved.
    $oldest = $conn->query(
        "SELECT id FROM paintings ORDER BY id DESC LIMIT 1 OFFSET " . (KEEP_PAINTINGS - 1)
    );
    if ($oldest && ($row = $oldest->fetch_assoc())) {
        $prune = $conn->prepare("DELETE FROM paintings WHERE id < ?");
        if ($prune) {
            $prune->bind_param("i", $row['id']);
            if (!$prune->execute()) {
                error_log('painting prune failed: ' . $prune->error);
            }
            $prune->close();
        }
    }

    $conn->close();

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}

echo json_encode($response);
?>