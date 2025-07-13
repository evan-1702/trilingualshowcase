<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/ServicePricing.php';

class ServiceController {
    private ServicePricing $servicePricingModel;
    
    public function __construct() {
        $this->servicePricingModel = new ServicePricing();
    }
    
    public function getAllServicePricing(): void {
        try {
            $services = $this->servicePricingModel->getAllServices();
            header('Content-Type: application/json');
            echo json_encode($services);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch service pricing']);
        }
    }
    
    public function createServicePricing(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['serviceName']) || empty($input['price'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                return;
            }
            
            $data = [
                'service_name' => SecurityConfig::validateInput($input['serviceName']),
                'description' => isset($input['description']) ? SecurityConfig::validateInput($input['description']) : null,
                'price' => (float)$input['price'],
                'currency' => 'EUR',
                'language' => 'fr'
            ];
            
            $id = $this->servicePricingModel->createService($data);
            
            header('Content-Type: application/json');
            echo json_encode(['id' => $id, 'message' => 'Service pricing created successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create service pricing']);
        }
    }
    
    public function updateServicePricing(int $id): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $data = [];
            if (isset($input['serviceName'])) $data['service_name'] = SecurityConfig::validateInput($input['serviceName']);
            if (isset($input['description'])) $data['description'] = SecurityConfig::validateInput($input['description']);
            if (isset($input['price'])) $data['price'] = (float)$input['price'];
            
            $success = $this->servicePricingModel->updateService($id, $data);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Service pricing updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Service pricing not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update service pricing']);
        }
    }
    
    public function deleteServicePricing(int $id): void {
        try {
            $success = $this->servicePricingModel->deleteService($id);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Service pricing deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Service pricing not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete service pricing']);
        }
    }
}
?>