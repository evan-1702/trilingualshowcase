<?php
declare(strict_types=1);

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Configure session
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_secure', '0'); // Set to 1 for HTTPS
ini_set('session.use_strict_mode', '1');
session_start();

// CORS Headers
header('Access-Control-Allow-Origin: http://localhost:5000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

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
        
    case $path === '/admin/service-pricing' && $requestMethod === 'GET':
        require_once __DIR__ . '/controllers/ServiceController.php';
        $controller = new ServiceController();
        $controller->getAllServicePricing();
        break;
        
    // Schedule Admin
    case $path === '/admin/schedule' && $requestMethod === 'GET':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ScheduleController.php';
        $controller = new ScheduleController();
        $controller->getAllSchedules();
        break;
        
    case $path === '/admin/schedule' && $requestMethod === 'POST':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ScheduleController.php';
        $controller = new ScheduleController();
        $controller->createSchedule();
        break;
        
    case preg_match('/^\/admin\/schedule\/(\d+)$/', $path, $matches) && $requestMethod === 'PUT':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ScheduleController.php';
        $controller = new ScheduleController();
        $controller->updateSchedule((int)$matches[1]);
        break;
        
    case preg_match('/^\/admin\/schedule\/(\d+)$/', $path, $matches) && $requestMethod === 'DELETE':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ScheduleController.php';
        $controller = new ScheduleController();
        $controller->deleteSchedule((int)$matches[1]);
        break;
        
    // Contact Messages Admin
    case $path === '/admin/contact-messages' && $requestMethod === 'GET':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ContactController.php';
        $controller = new ContactController();
        $controller->getAllMessages();
        break;
        
    // Blog Admin
    case $path === '/admin/blog' && $requestMethod === 'GET':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/BlogController.php';
        $controller = new BlogController();
        $controller->getAllPosts();
        break;
        
    case $path === '/admin/blog' && $requestMethod === 'POST':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/BlogController.php';
        $controller = new BlogController();
        $controller->createPost();
        break;
        
    case preg_match('/^\/admin\/blog\/(\d+)$/', $path, $matches) && $requestMethod === 'PUT':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/BlogController.php';
        $controller = new BlogController();
        $controller->updatePost((int)$matches[1]);
        break;
        
    case preg_match('/^\/admin\/blog\/(\d+)$/', $path, $matches) && $requestMethod === 'DELETE':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/BlogController.php';
        $controller = new BlogController();
        $controller->deletePost((int)$matches[1]);
        break;
        
    // FAQ Admin
    case $path === '/admin/faq' && $requestMethod === 'GET':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/FaqController.php';
        $controller = new FaqController();
        $controller->getAllItems();
        break;
        
    case $path === '/admin/faq' && $requestMethod === 'POST':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/FaqController.php';
        $controller = new FaqController();
        $controller->createItem();
        break;
        
    case preg_match('/^\/admin\/faq\/(\d+)$/', $path, $matches) && $requestMethod === 'PUT':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/FaqController.php';
        $controller = new FaqController();
        $controller->updateItem((int)$matches[1]);
        break;
        
    case preg_match('/^\/admin\/faq\/(\d+)$/', $path, $matches) && $requestMethod === 'DELETE':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/FaqController.php';
        $controller = new FaqController();
        $controller->deleteItem((int)$matches[1]);
        break;
        
    // Room Pricing Admin
    case $path === '/admin/room-pricing' && $requestMethod === 'POST':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/RoomController.php';
        $controller = new RoomController();
        $controller->createRoomPricing();
        break;
        
    case preg_match('/^\/admin\/room-pricing\/(\d+)$/', $path, $matches) && $requestMethod === 'PUT':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/RoomController.php';
        $controller = new RoomController();
        $controller->updateRoomPricing((int)$matches[1]);
        break;
        
    case preg_match('/^\/admin\/room-pricing\/(\d+)$/', $path, $matches) && $requestMethod === 'DELETE':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/RoomController.php';
        $controller = new RoomController();
        $controller->deleteRoomPricing((int)$matches[1]);
        break;
        
    // Service Pricing Admin
    case $path === '/admin/service-pricing' && $requestMethod === 'POST':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ServiceController.php';
        $controller = new ServiceController();
        $controller->createServicePricing();
        break;
        
    case preg_match('/^\/admin\/service-pricing\/(\d+)$/', $path, $matches) && $requestMethod === 'PUT':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ServiceController.php';
        $controller = new ServiceController();
        $controller->updateServicePricing((int)$matches[1]);
        break;
        
    case preg_match('/^\/admin\/service-pricing\/(\d+)$/', $path, $matches) && $requestMethod === 'DELETE':
        require_once __DIR__ . '/middleware/AuthMiddleware.php';
        AuthMiddleware::requireAuth();
        require_once __DIR__ . '/controllers/ServiceController.php';
        $controller = new ServiceController();
        $controller->deleteServicePricing((int)$matches[1]);
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