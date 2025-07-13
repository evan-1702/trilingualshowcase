<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class Reservation extends BaseModel {
    protected string $table = 'reservations';
    
    public function getAllReservations(): array {
        return $this->findAll();
    }
    
    public function getReservation(int $id): ?array {
        return $this->findById($id);
    }
    
    public function createReservation(array $data): int {
        $reservationData = [
            'customer_name' => $data['customer_name'] ?? '',
            'customer_first_name' => $data['customer_first_name'] ?? '',
            'customer_email' => $data['customer_email'] ?? '',
            'customer_phone' => $data['customer_phone'] ?? '',
            'customer_address' => $data['customer_address'] ?? '',
            'start_date' => $data['start_date'] ?? '',
            'end_date' => $data['end_date'] ?? '',
            'room_preference' => $data['room_preference'] ?? null,
            'number_of_animals' => $data['number_of_animals'] ?? 1,
            'animals' => json_encode($data['animals'] ?? []),
            'status' => 'pending',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->create($reservationData);
    }
    
    public function updateReservationStatus(int $id, string $status): bool {
        $allowedStatuses = ['pending', 'confirmed', 'cancelled'];
        if (!in_array($status, $allowedStatuses)) {
            return false;
        }
        
        return $this->update($id, [
            'status' => $status,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }
    
    public function getReservationsByDateRange(string $startDate, string $endDate): array {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table} 
            WHERE status = 'confirmed' 
            AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?))
            ORDER BY start_date ASC
        ");
        $stmt->execute([$startDate, $startDate, $endDate, $endDate]);
        return $stmt->fetchAll();
    }
    
    public function getDailyArrivals(string $date): array {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table} 
            WHERE status = 'confirmed' AND start_date = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$date]);
        return $stmt->fetchAll();
    }
    
    public function getDailyDepartures(string $date): array {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table} 
            WHERE status = 'confirmed' AND end_date = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$date]);
        return $stmt->fetchAll();
    }
    
    public function getRecentReservations(int $limit = 10): array {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table} 
            ORDER BY created_at DESC 
            LIMIT ?
        ");
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    }
}