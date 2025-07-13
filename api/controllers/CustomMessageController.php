<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/CustomMessage.php';

class CustomMessageController {
    private CustomMessage $messageModel;
    
    public function __construct() {
        $this->messageModel = new CustomMessage();
    }
    
    public function getActiveMessages(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        $language = $_GET['language'] ?? 'fr';
        
        try {
            $messages = $this->messageModel->getActiveMessagesByLanguage($language);
            echo json_encode($messages);
        } catch (Exception $e) {
            error_log("Failed to fetch custom messages: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch custom messages']);
        }
    }
}