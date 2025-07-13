<?php
declare(strict_types=1);

class ContactController {
    private ContactMessage $contactModel;
    
    public function __construct() {
        $this->contactModel = new ContactMessage();
    }
    
    public function submitMessage(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $requiredFields = ['name', 'email', 'message'];
            foreach ($requiredFields as $field) {
                if (empty($input[$field])) {
                    http_response_code(400);
                    echo json_encode(['error' => "Field {$field} is required"]);
                    return;
                }
            }
            
            if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid email format']);
                return;
            }
            
            $data = [
                'name' => SecurityConfig::validateInput($input['name']),
                'email' => SecurityConfig::validateInput($input['email']),
                'subject' => SecurityConfig::validateInput($input['subject'] ?? ''),
                'message' => SecurityConfig::validateInput($input['message'])
            ];
            
            $messageId = $this->contactModel->createMessage($data);
            
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'id' => $messageId]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to submit message']);
        }
    }
}
?>