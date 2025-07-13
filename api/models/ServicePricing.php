<?php
declare(strict_types=1);

class ServicePricing extends BaseModel {
    protected string $table = 'service_pricing';
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getAllServices(): array {
        $stmt = $this->db->query("SELECT * FROM {$this->table} ORDER BY id");
        return $stmt->fetchAll();
    }
    
    public function createService(array $data): int {
        return $this->create($data);
    }
    
    public function updateService(int $id, array $data): bool {
        return $this->update($id, $data);
    }
    
    public function deleteService(int $id): bool {
        return $this->delete($id);
    }
}
?>