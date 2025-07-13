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
            // Add pricing for each room
            foreach ($rooms as &$room) {
                $room['pricing'] = $this->roomModel->getRoomPricing($room['id']);
            }
            header('Content-Type: application/json');
            echo json_encode($rooms);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch rooms with pricing']);
        }
    }
    
    public function createRoomPricing(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['roomId']) || empty($input['serviceName']) || empty($input['price'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                return;
            }
            
            $data = [
                'room_id' => (int)$input['roomId'],
                'service_name' => SecurityConfig::validateInput($input['serviceName']),
                'price' => (float)$input['price'],
                'duration' => isset($input['duration']) ? SecurityConfig::validateInput($input['duration']) : '1 nuit',
                'currency' => 'EUR',
                'language' => 'fr'
            ];
            
            $id = $this->roomModel->createRoomPricing($data);
            
            header('Content-Type: application/json');
            echo json_encode(['id' => $id, 'message' => 'Room pricing created successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create room pricing']);
        }
    }
    
    public function updateRoomPricing(int $id): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $data = [];
            if (isset($input['roomId'])) $data['room_id'] = (int)$input['roomId'];
            if (isset($input['serviceName'])) $data['service_name'] = SecurityConfig::validateInput($input['serviceName']);
            if (isset($input['price'])) $data['price'] = (float)$input['price'];
            if (isset($input['duration'])) $data['duration'] = SecurityConfig::validateInput($input['duration']);
            
            $success = $this->roomModel->updateRoomPricing($id, $data);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Room pricing updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Room pricing not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update room pricing']);
        }
    }
    
    public function deleteRoomPricing(int $id): void {
        try {
            $success = $this->roomModel->deleteRoomPricing($id);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Room pricing deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Room pricing not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete room pricing']);
        }
    }
}
?>