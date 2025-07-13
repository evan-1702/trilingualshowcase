<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../config/security.php';

class AuthController {
    private User $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    public function login(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['username']) || empty($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }
        
        $username = SecurityConfig::validateInput($input['username']);
        $password = $input['password'];
        
        try {
            $user = $this->userModel->authenticateUser($username, $password);
            
            if ($user) {
                // Update last login
                $this->userModel->updateLastLogin($user['id']);
                
                // Create session
                AuthMiddleware::createSession($user);
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username']
                    ],
                    'csrf_token' => $_SESSION['csrf_token']
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Login failed']);
        }
    }
    
    public function logout(): void {
        try {
            AuthMiddleware::destroySession();
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        } catch (Exception $e) {
            error_log("Logout error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Logout failed']);
        }
    }
    
    public function checkAuth(): void {
        session_start();
        
        if (isset($_SESSION['admin_id']) && isset($_SESSION['admin_username'])) {
            echo json_encode([
                'authenticated' => true,
                'user' => [
                    'id' => $_SESSION['admin_id'],
                    'username' => $_SESSION['admin_username']
                ]
            ]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
    }
}