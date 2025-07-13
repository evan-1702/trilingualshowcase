<?php
declare(strict_types=1);

class RoomSchedule extends BaseModel {
    protected string $table = 'room_schedule';
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getAllSchedules(): array {
        $stmt = $this->db->query("
            SELECT rs.*, r.name as room_name 
            FROM {$this->table} rs 
            LEFT JOIN rooms r ON rs.room_id = r.id 
            ORDER BY rs.start_date DESC
        ");
        return $stmt->fetchAll();
    }
    
    public function getSchedulesByRoom(int $roomId): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE room_id = ? ORDER BY start_date");
        $stmt->execute([$roomId]);
        return $stmt->fetchAll();
    }
    
    public function createSchedule(array $data): int {
        return $this->create($data);
    }
    
    public function updateSchedule(int $id, array $data): bool {
        return $this->update($id, $data);
    }
    
    public function deleteSchedule(int $id): bool {
        return $this->delete($id);
    }
}
?>