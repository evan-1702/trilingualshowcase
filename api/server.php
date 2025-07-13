<?php
// Simple PHP development server router
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Serve API requests
if (strpos($path, '/api') === 0) {
    // Set proper headers for API responses
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    require_once __DIR__ . '/index.php';
    return true;
}

// Serve static files for frontend
$staticFile = __DIR__ . '/../dist/public' . $path;
if (file_exists($staticFile) && !is_dir($staticFile)) {
    return false; // Serve the file directly
}

// Fallback to index.html for SPA routing
if (file_exists(__DIR__ . '/../dist/public/index.html')) {
    require_once __DIR__ . '/../dist/public/index.html';
} else {
    // Development fallback
    echo "Frontend not built. Run: npm run build";
}
?>