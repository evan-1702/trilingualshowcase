<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/BlogPost.php';

class BlogController {
    private BlogPost $blogModel;
    
    public function __construct() {
        $this->blogModel = new BlogPost();
    }
    
    public function getPublishedPosts(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        $language = $_GET['language'] ?? 'fr';
        
        try {
            $posts = $this->blogModel->getPublishedPostsByLanguage($language);
            echo json_encode($posts);
        } catch (Exception $e) {
            error_log("Failed to fetch blog posts: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch blog posts']);
        }
    }
    
    public function getPostBySlug(string $slug): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        $language = $_GET['language'] ?? 'fr';
        
        try {
            $post = $this->blogModel->getPostBySlug($slug, $language);
            
            if ($post) {
                echo json_encode($post);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Post not found']);
            }
        } catch (Exception $e) {
            error_log("Failed to fetch blog post: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch blog post']);
        }
    }
}