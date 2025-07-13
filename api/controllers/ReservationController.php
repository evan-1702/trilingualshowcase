<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Reservation.php';
require_once __DIR__ . '/../models/Room.php';
require_once __DIR__ . '/../utils/EmailService.php';
require_once __DIR__ . '/../config/security.php';

class ReservationController {
    private Reservation $reservationModel;
    private Room $roomModel;
    private EmailService $emailService;
    
    public function __construct() {
        $this->reservationModel = new Reservation();
        $this->roomModel = new Room();
        $this->emailService = new EmailService();
    }
    
    public function createReservation(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $requiredFields = ['customer_name', 'customer_first_name', 'customer_email', 'start_date', 'end_date'];
        foreach ($requiredFields as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field {$field} is required"]);
                return;
            }
        }
        
        // Validate email
        if (!SecurityConfig::validateEmail($input['customer_email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            return;
        }
        
        // Validate dates
        $startDate = $input['start_date'];
        $endDate = $input['end_date'];
        
        if (strtotime($endDate) <= strtotime($startDate)) {
            http_response_code(400);
            echo json_encode(['error' => 'End date must be after start date']);
            return;
        }
        
        // Check room availability if specified
        if (!empty($input['room_preference'])) {
            $roomId = (int)$input['room_preference'];
            if (!$this->roomModel->getRoomAvailability($roomId, $startDate, $endDate)) {
                http_response_code(400);
                echo json_encode(['error' => 'Room not available for selected dates']);
                return;
            }
        }
        
        // Sanitize input data
        $sanitizedData = [];
        foreach ($input as $key => $value) {
            if (is_string($value)) {
                $sanitizedData[$key] = SecurityConfig::validateInput($value);
            } else {
                $sanitizedData[$key] = $value;
            }
        }
        
        try {
            $reservationId = $this->reservationModel->createReservation($sanitizedData);
            
            // Get the created reservation for email
            $reservation = $this->reservationModel->getReservation($reservationId);
            
            // Send confirmation emails
            try {
                $this->emailService->sendReservationConfirmation($reservation);
            } catch (Exception $e) {
                error_log("Email sending failed: " . $e->getMessage());
                // Don't fail the reservation if email fails
            }
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'id' => $reservationId,
                'message' => 'Reservation created successfully'
            ]);
            
        } catch (Exception $e) {
            error_log("Reservation creation failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create reservation']);
        }
    }
    
    public function getAllReservations(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        try {
            $reservations = $this->reservationModel->getAllReservations();
            echo json_encode($reservations);
        } catch (Exception $e) {
            error_log("Failed to fetch reservations: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch reservations']);
        }
    }
    
    public function updateReservationStatus(int $id): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status is required']);
            return;
        }
        
        $status = SecurityConfig::validateInput($input['status']);
        
        try {
            $success = $this->reservationModel->updateReservationStatus($id, $status);
            
            if ($success) {
                echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Reservation not found or invalid status']);
            }
        } catch (Exception $e) {
            error_log("Failed to update reservation status: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update reservation status']);
        }
    }
    
    public function getDailyStats(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        $date = $_GET['date'] ?? date('Y-m-d');
        
        try {
            $arrivals = $this->reservationModel->getDailyArrivals($date);
            $departures = $this->reservationModel->getDailyDepartures($date);
            
            echo json_encode([
                'date' => $date,
                'arrivals' => count($arrivals),
                'departures' => count($departures),
                'arrivals_list' => $arrivals,
                'departures_list' => $departures
            ]);
        } catch (Exception $e) {
            error_log("Failed to fetch daily stats: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch daily stats']);
        }
    }
}