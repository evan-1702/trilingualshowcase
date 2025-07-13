<?php
declare(strict_types=1);

class FaqController {
    private FaqItem $faqModel;
    
    public function __construct() {
        $this->faqModel = new FaqItem();
    }
    
    public function getAllItems(): void {
        try {
            $items = $this->faqModel->getAllItems();
            header('Content-Type: application/json');
            echo json_encode($items);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch FAQ items']);
        }
    }
    
    public function createItem(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['question']) || empty($input['answer'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                return;
            }
            
            $data = [
                'question' => SecurityConfig::validateInput($input['question']),
                'answer' => SecurityConfig::validateInput($input['answer']),
                'language' => $input['language'] ?? 'fr',
                'category' => isset($input['category']) ? SecurityConfig::validateInput($input['category']) : null,
                'display_order' => (int)($input['display_order'] ?? 0),
                'is_active' => $input['is_active'] ?? true
            ];
            
            $id = $this->faqModel->createItem($data);
            
            header('Content-Type: application/json');
            echo json_encode(['id' => $id, 'message' => 'FAQ item created successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create FAQ item']);
        }
    }
    
    public function updateItem(int $id): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $data = [];
            if (isset($input['question'])) $data['question'] = SecurityConfig::validateInput($input['question']);
            if (isset($input['answer'])) $data['answer'] = SecurityConfig::validateInput($input['answer']);
            if (isset($input['language'])) $data['language'] = $input['language'];
            if (isset($input['category'])) $data['category'] = SecurityConfig::validateInput($input['category']);
            if (isset($input['display_order'])) $data['display_order'] = (int)$input['display_order'];
            if (isset($input['is_active'])) $data['is_active'] = $input['is_active'];
            
            $success = $this->faqModel->updateItem($id, $data);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'FAQ item updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'FAQ item not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update FAQ item']);
        }
    }
    
    public function deleteItem(int $id): void {
        try {
            $success = $this->faqModel->deleteItem($id);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'FAQ item deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'FAQ item not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete FAQ item']);
        }
    }
}
?>