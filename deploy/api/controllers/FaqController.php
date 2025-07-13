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
}
?>