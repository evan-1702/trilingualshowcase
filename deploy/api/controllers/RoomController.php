<?php
declare(strict_types=1);

class RoomController {
    private Room $roomModel;
    
    public function __construct() {
        $this->roomModel = new Room();
    }
    
    public function getAllRooms(): void {
        try {
            $rooms = $this->roomModel->getAllRooms();
            header('Content-Type: application/json');
            echo json_encode($rooms);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch rooms']);
        }
    }
    
    public function getRoomPricing(int $roomId): void {
        try {
            $pricing = $this->roomModel->getRoomPricing($roomId);
            header('Content-Type: application/json');
            echo json_encode($pricing);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch room pricing']);
        }
    }
    
    public function getRoomSchedule(int $roomId): void {
        try {
            $schedule = $this->roomModel->getRoomSchedule($roomId);
            header('Content-Type: application/json');
            echo json_encode($schedule);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch room schedule']);
        }
    }
    
    public function getAllRoomsWithPricing(): void {
        try {
            $rooms = $this->roomModel->getAllRooms();
            // Add empty pricing for each room for now
            foreach ($rooms as &$room) {
                $room['pricing'] = [];
            }
            header('Content-Type: application/json');
            echo json_encode($rooms);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch rooms with pricing']);
        }
    }
}
?>