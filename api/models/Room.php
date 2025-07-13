<?php
declare(strict_types=1);

class Room extends BaseModel {
    protected string $table = 'rooms';
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getAllRooms(): array {
        $stmt = $this->db->query("SELECT * FROM {$this->table} ORDER BY id");
        $rooms = $stmt->fetchAll();
        
        foreach ($rooms as &$room) {
            if ($room['images']) {
                $room['images'] = json_decode($room['images'], true);
            }
        }
        
        return $rooms;
    }
    
    public function getRoomById(int $id): ?array {
        $room = $this->findById($id);
        if ($room && $room['images']) {
            $room['images'] = json_decode($room['images'], true);
        }
        return $room;
    }
    
    public function createRoom(array $data): int {
        if (isset($data['images']) && is_array($data['images'])) {
            $data['images'] = json_encode($data['images']);
        }
        return $this->create($data);
    }
    
    public function getRoomPricing(int $roomId): array {
        $stmt = $this->db->prepare("SELECT * FROM room_pricing WHERE room_id = ?");
        $stmt->execute([$roomId]);
        return $stmt->fetchAll();
    }
    
    public function getRoomSchedule(int $roomId): array {
        $stmt = $this->db->prepare("SELECT * FROM room_schedule WHERE room_id = ?");
        $stmt->execute([$roomId]);
        return $stmt->fetchAll();
    }
    
    public function createRoomPricing(array $data): int {
        $stmt = $this->db->prepare("INSERT INTO room_pricing (room_id, service_name, price, duration, currency, language) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['room_id'],
            $data['service_name'],
            $data['price'],
            $data['duration'] ?? '1 nuit',
            $data['currency'] ?? 'EUR',
            $data['language'] ?? 'fr'
        ]);
        return $this->db->lastInsertId();
    }
    
    public function updateRoomPricing(int $id, array $data): bool {
        $setParts = [];
        $params = [];
        
        foreach ($data as $key => $value) {
            $setParts[] = "{$key} = ?";
            $params[] = $value;
        }
        
        if (empty($setParts)) return false;
        
        $params[] = $id;
        $sql = "UPDATE room_pricing SET " . implode(', ', $setParts) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }
    
    public function deleteRoomPricing(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM room_pricing WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>