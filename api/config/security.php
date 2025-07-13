<?php
declare(strict_types=1);

class SecurityConfig {
    
    public static function init(): void {
        // Security headers
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Content-Security-Policy: default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: https:;');
        
        // CORS for frontend
        $allowedOrigins = [
            $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000',
            $_ENV['PRODUCTION_URL'] ?? ''
        ];
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        
        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
    
    public static function validateInput(string $input): string {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
    
    public static function validateEmail(string $email): bool {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_ARGON2ID);
    }
    
    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
    
    public static function generateToken(int $length = 32): string {
        return bin2hex(random_bytes($length));
    }
    
    public static function rateLimitCheck(string $ip, int $maxRequests = 100, int $timeWindow = 3600): bool {
        $key = "rate_limit_$ip";
        $requests = apcu_fetch($key) ?: 0;
        
        if ($requests >= $maxRequests) {
            return false;
        }
        
        apcu_store($key, $requests + 1, $timeWindow);
        return true;
    }
}