<?php
// Simple PHP development server router
$uri = $_SERVER['REQUEST_URI'];

// Serve API requests
if (strpos($uri, '/api') === 0) {
    require_once __DIR__ . '/index.php';
    return true;
}

// Serve static files for frontend
$staticFile = __DIR__ . '/../dist/public' . $uri;
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