<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class CustomMessage extends BaseModel {
    protected string $table = 'custom_messages';
    
    public function getActiveMessagesByLanguage(string $language): array {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table} 
            WHERE is_active = 1 AND language = ? 
            ORDER BY display_order ASC, created_at DESC
        ");
        $stmt->execute([$language]);
        return $stmt->fetchAll();
    }
    
    public function getAllCustomMessages(): array {
        return $this->findAll();
    }
    
    public function createCustomMessage(array $data): int {
        $messageData = [
            'title' => $data['title'] ?? '',
            'content' => $data['content'] ?? '',
            'type' => $data['type'] ?? 'info',
            'language' => $data['language'] ?? 'fr',
            'is_active' => $data['is_active'] ?? true,
            'display_order' => $data['display_order'] ?? 0,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->create($messageData);
    }
    
    public function updateCustomMessage(int $id, array $data): bool {
        $updateData = [];
        
        $allowedFields = ['title', 'content', 'type', 'language', 'is_active', 'display_order'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }
        
        if (empty($updateData)) {
            return false;
        }
        
        $updateData['updated_at'] = date('Y-m-d H:i:s');
        return $this->update($id, $updateData);
    }
}