<?php
// Version déploiement 100% PHP - PAS DE NODE.JS requis
declare(strict_types=1);

// Configuration pour hébergement
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Démarrage de session sécurisée
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_only_cookies', 1);

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Servir l'API
if (strpos($requestUri, '/api') === 0) {
    // Headers CORS pour le frontend
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($requestMethod === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
    
    // Charger l'API PHP
    require_once __DIR__ . '/api/index.php';
    exit;
}

// Servir les fichiers statiques du frontend
$staticFile = __DIR__ . '/dist' . $requestUri;
if (file_exists($staticFile) && !is_dir($staticFile)) {
    // Déterminer le type MIME
    $extension = pathinfo($staticFile, PATHINFO_EXTENSION);
    $mimeTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon'
    ];
    
    if (isset($mimeTypes[$extension])) {
        header('Content-Type: ' . $mimeTypes[$extension]);
    }
    
    readfile($staticFile);
    exit;
}

// Fallback vers index.html pour SPA routing
if (file_exists(__DIR__ . '/dist/index.html')) {
    header('Content-Type: text/html');
    readfile(__DIR__ . '/dist/index.html');
} else {
    http_response_code(404);
    echo "Site non trouvé. Veuillez compiler le frontend avec : npm run build";
}
?>