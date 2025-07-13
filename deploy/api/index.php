<?php
declare(strict_types=1);

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Load configuration
require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/config/security.php';
require_once __DIR__ . '/config/database.php';

// Load models
require_once __DIR__ . '/models/BaseModel.php';
require_once __DIR__ . '/models/Room.php';
require_once __DIR__ . '/models/Reservation.php';
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/CustomMessage.php';
require_once __DIR__ . '/models/FaqItem.php';
require_once __DIR__ . '/models/BlogPost.php';
require_once __DIR__ . '/models/ContactMessage.php';

// Initialize security headers
SecurityConfig::init();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialize database
try {
    Database::initializeSchema();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database initialization failed']);
    exit;
}

// Simple router
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query parameters and API prefix
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/api', '', $path);

// Route the request
switch (true) {
    // Rooms
    case $path === '/rooms' && $requestMethod === 'GET':
        require_once __DIR__ . '/controllers/RoomController.php';
        $controller = new RoomController();
        $controller->getAllRooms();
        break;
        
    case preg_match('/^\/rooms\/(\d+)\/pricing$/', $path, $matches) && $requestMethod === 'GET':
        require_once __DIR__ . '/controllers/RoomController.php';
        $controller = new RoomController();
        $controller->getRoomPricing((int)$matches[1]);
        break;
        
    case preg_match('/^\/rooms\/(\d+)\/schedule$/', $path, $matches) && $requestMethod === 'GET':
        require_once __DIR__ . '/controllers/RoomController.php';
        $controller = new RoomController();
        $controller->getRoomSchedule((int)$matches[1]);
        break;
        
    // Custom Messages
    case $path === '/custom-messages' && $requestMethod === 'GET':
        require_once __DIR__ . '/controllers/CustomMessageController.php';
        $controller = new CustomMessageController();
        $controller->getActiveMessages();
        break;
        
    // Reservations
    case $path === '/reservations' && $requestMethod === 'POST':
        require_once __DIR__ . '/controllers/ReservationController.php';
        $controller = new ReservationController();
        $controller->createReservation();
        break;
        
    // Admin Authentication
    case $path === '/admin/login' && $requestMethod === 'POST':
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new AuthController();
        $controller->login();
        break;
        
    case $path === '/admin/logout' && $requestMethod === 'POST':
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new AuthController();
        $controller->logout();
        break;
        
    // Admin Routes (protected)
    case $path === '/admin/reservations' && $requestMethod === 'GET':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ReservationController.php';
        $controller = new ReservationController();
        $controller->getAllReservations();
        break;
        
    case $path === '/admin/daily-stats' && $requestMethod === 'GET':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ReservationController.php';
        $controller = new ReservationController();
        $controller->getDailyStats();
        break;
        
    // Blog
    case $path === '/blog' && $requestMethod === 'GET':
        require_once __DIR__ . '/controllers/BlogController.php';
        $controller = new BlogController();
        $controller->getPublishedPosts();
        break;
        
    // FAQ
    case $path === '/faq' && $requestMethod === 'GET':
        require_once __DIR__ . '/controllers/FaqController.php';
        $controller = new FaqController();
        $controller->getAllItems();
        break;
        
    // Service Pricing
    case $path === '/service-pricing' && $requestMethod === 'GET':
        echo json_encode([]);
        break;
        
    case $path === '/admin/room-pricing' && $requestMethod === 'GET':
        require_once __DIR__ . '/controllers/RoomController.php';
        $controller = new RoomController();
        $controller->getAllRoomsWithPricing();
        break;
        
    // Contact
    case $path === '/contact' && $requestMethod === 'POST':
        require_once __DIR__ . '/controllers/ContactController.php';
        $controller = new ContactController();
        $controller->submitMessage();
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found: ' . $path]);
        break;
}
?>