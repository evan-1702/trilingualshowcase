<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/BlogPost.php';
require_once __DIR__ . '/../config/SecurityConfig.php';

class BlogController {
    private BlogPost $blogModel;
    
    public function __construct() {
        $this->blogModel = new BlogPost();
    }
    
    public function getPublishedPosts(): void {
        try {
            $language = $_GET['language'] ?? 'fr';
            $posts = $this->blogModel->getPublishedPosts($language);
            header('Content-Type: application/json');
            echo json_encode($posts);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch blog posts']);
        }
    }
    
    public function getAllPosts(): void {
        try {
            $posts = $this->blogModel->getAllPosts();
            header('Content-Type: application/json');
            echo json_encode($posts);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch blog posts']);
        }
    }
    
    public function createPost(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['title']) || empty($input['content'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                return;
            }
            
            $data = [
                'title' => SecurityConfig::validateInput($input['title']),
                'slug' => $this->generateSlug($input['title']),
                'content' => SecurityConfig::validateInput($input['content']),
                'excerpt' => isset($input['excerpt']) ? SecurityConfig::validateInput($input['excerpt']) : null,
                'featured_image' => isset($input['featured_image']) ? SecurityConfig::validateInput($input['featured_image']) : null,
                'language' => $input['language'] ?? 'fr',
                'status' => $input['status'] ?? 'draft',
                'author_id' => 1
            ];
            
            $id = $this->blogModel->createPost($data);
            
            header('Content-Type: application/json');
            echo json_encode(['id' => $id, 'message' => 'Blog post created successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create blog post']);
        }
    }
    
    public function updatePost(int $id): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $data = [];
            if (isset($input['title'])) {
                $data['title'] = SecurityConfig::validateInput($input['title']);
                $data['slug'] = $this->generateSlug($input['title']);
            }
            if (isset($input['content'])) $data['content'] = SecurityConfig::validateInput($input['content']);
            if (isset($input['excerpt'])) $data['excerpt'] = SecurityConfig::validateInput($input['excerpt']);
            if (isset($input['featured_image'])) $data['featured_image'] = SecurityConfig::validateInput($input['featured_image']);
            if (isset($input['language'])) $data['language'] = $input['language'];
            if (isset($input['status'])) $data['status'] = $input['status'];
            
            $success = $this->blogModel->updatePost($id, $data);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Blog post updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Blog post not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update blog post']);
        }
    }
    
    public function deletePost(int $id): void {
        try {
            $success = $this->blogModel->deletePost($id);
            
            if ($success) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Blog post deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Blog post not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete blog post']);
        }
    }
    
    private function generateSlug(string $title): string {
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        return trim($slug, '-');
    }
}
?>