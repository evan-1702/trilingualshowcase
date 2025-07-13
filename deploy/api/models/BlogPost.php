<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class BlogPost extends BaseModel {
    protected string $table = 'blog_posts';
    
    public function getPublishedPostsByLanguage(string $language): array {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table} 
            WHERE status = 'published' AND language = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$language]);
        return $stmt->fetchAll();
    }
    
    public function getPostBySlug(string $slug, string $language): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table} 
            WHERE slug = ? AND language = ? AND status = 'published'
        ");
        $stmt->execute([$slug, $language]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    public function getAllBlogPosts(): array {
        return $this->findAll();
    }
    
    public function createBlogPost(array $data): int {
        $postData = [
            'title' => $data['title'] ?? '',
            'slug' => $data['slug'] ?? '',
            'excerpt' => $data['excerpt'] ?? '',
            'content' => $data['content'] ?? '',
            'language' => $data['language'] ?? 'fr',
            'status' => $data['status'] ?? 'draft',
            'featured_image' => $data['featured_image'] ?? '',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->create($postData);
    }
    
    public function updateBlogPost(int $id, array $data): bool {
        $updateData = [];
        
        $allowedFields = ['title', 'slug', 'excerpt', 'content', 'language', 'status', 'featured_image'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }
        
        if (empty($updateData)) {
            return false;
        }
        
        $updateData['updated_at'] = date('Y-m-d H:i:s');
        return $this->update($id, $updateData);
    }
}