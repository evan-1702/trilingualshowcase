<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class User extends BaseModel {
    protected string $table = 'users';
    
    public function getUserByUsername(string $username): ?array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE username = ?");
        $stmt->execute([$username]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    public function createUser(string $username, string $password): int {
        $userData = [
            'username' => SecurityConfig::validateInput($username),
            'password' => SecurityConfig::hashPassword($password),
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->create($userData);
    }
    
    public function authenticateUser(string $username, string $password): ?array {
        $user = $this->getUserByUsername($username);
        
        if ($user && SecurityConfig::verifyPassword($password, $user['password'])) {
            unset($user['password']); // Never return password hash
            return $user;
        }
        
        return null;
    }
    
    public function updateLastLogin(int $userId): bool {
        return $this->update($userId, [
            'last_login' => date('Y-m-d H:i:s')
        ]);
    }
}