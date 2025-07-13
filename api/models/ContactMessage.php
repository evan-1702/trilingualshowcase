<?php
declare(strict_types=1);

class ContactMessage extends BaseModel {
    protected string $table = 'contact_messages';
    
    public function __construct() {
        parent::__construct();
    }
    
    public function createMessage(array $data): int {
        return $this->create($data);
    }
    
    public function getAllMessages(): array {
        $stmt = $this->db->query("SELECT * FROM {$this->table} ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }
}
?>