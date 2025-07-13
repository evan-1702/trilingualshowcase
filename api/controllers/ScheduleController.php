<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/RoomSchedule.php';
require_once __DIR__ . '/../config/SecurityConfig.php';

class ScheduleController {
    private RoomSchedule $scheduleModel;
    
    public function __construct() {
        $this->scheduleModel = new RoomSchedule();
    }
    
    public function getAllSchedules(): void {
        try {
            $schedules = $this->scheduleModel->getAllSchedules();
            header('Content-Type: application/json');
            echo json_encode($schedules);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch schedules']);
        }
    }
    
    public function createSchedule(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['roomId']) || empty($input['startDate']) || empty($input['endDate']) || empty($input['status'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                return;
            }
            
            $data = [
                'room_id' => (int)$input['roomId'],
                'start_date' => SecurityConfig::validateInput($input['startDate']),
                'end_date' => SecurityConfig::validateInput($input['endDate']),
                'status' => SecurityConfig::validateInput($input['status']),
                'guest_info' => isset($input['guestInfo']) ? SecurityConfig::validateInput($input['guestInfo']) : null
            ];
            
            $id = $this->scheduleModel->createSchedule($data);
            
            header('Content-Type: application/json');
            echo json_encode(['id' => $id, 'message' => 'Schedule created successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create schedule']);
        }
    }
    
    public function updateSchedule(int $id): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $data = [];
            if (isset($input['roomId'])) $data['room_id'] = (int)$input['roomId'];
            if (isset($input['startDate'])) $data['start_date'] = SecurityConfig::validateInput($input['startDate']);
            if (isset($input['endDate'])) $data['end_date'] = SecurityConfig::validateInput($input['endDate']);
            if (isset($input['status'])) $data['status'] = SecurityConfig::validateInput($input['status']);
            if (isset($input['guestInfo'])) $data['guest_info'] = SecurityConfig::validateInput($input['guestInfo']);
            
            $success = $this->scheduleModel->updateSchedule($id, $data);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Schedule updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Schedule not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update schedule']);
        }
    }
    
    public function deleteSchedule(int $id): void {
        try {
            $success = $this->scheduleModel->deleteSchedule($id);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Schedule deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Schedule not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete schedule']);
        }
    }
}
?>