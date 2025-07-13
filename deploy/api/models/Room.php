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
}
?>