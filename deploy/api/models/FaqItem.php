<?php
declare(strict_types=1);

class FaqItem extends BaseModel {
    protected string $table = 'faq_items';
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getAllItems(): array {
        $stmt = $this->db->query("SELECT * FROM {$this->table} ORDER BY display_order, id");
        return $stmt->fetchAll();
    }
    
    public function getItemsByLanguage(string $language): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE language = ? ORDER BY display_order, id");
        $stmt->execute([$language]);
        return $stmt->fetchAll();
    }
    
    public function createItem(array $data): int {
        return $this->create($data);
    }
}
?>