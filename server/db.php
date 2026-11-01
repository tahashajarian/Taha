<?php
// Shared connection helper. Credentials live in config.php (gitignored).
function painting_db() {
    $configPath = __DIR__ . '/config.php';
    if (!is_file($configPath)) {
        throw new Exception('Server is not configured');
    }
    $config = require $configPath;

    mysqli_report(MYSQLI_REPORT_OFF);
    $conn = new mysqli($config['host'], $config['user'], $config['password'], $config['database']);
    if ($conn->connect_error) {
        error_log('painting db connect failed: ' . $conn->connect_error);
        throw new Exception('Database unavailable');
    }
    return $conn;
}
