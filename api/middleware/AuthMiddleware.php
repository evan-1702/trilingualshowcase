<?php
declare(strict_types=1);

class AuthMiddleware {
    
    public static function requireAuth(): void {
        // Session is already started in index.php
        
        // Debug session data
        error_log("Session data: " . print_r($_SESSION, true));
        
        if (!isset($_SESSION['admin_id']) || !isset($_SESSION['admin_username'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Authentication required', 'session_id' => session_id()]);
            exit;
        }
        
        // Check session timeout (24 hours)
        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 86400)) {
            session_destroy();
            http_response_code(401);
            echo json_encode(['error' => 'Session expired']);
            exit;
        }
        
        $_SESSION['last_activity'] = time();
    }
    
    public static function createSession(array $user): void {
        // Session is already started in index.php
        session_regenerate_id(true);
        
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];
        $_SESSION['last_activity'] = time();
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    public static function destroySession(): void {
        // Session is already started in index.php
        session_destroy();
    }
    
    public static function validateCSRF(string $token): bool {
        // Session is already started in index.php
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }
}