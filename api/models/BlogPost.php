<?php
declare(strict_types=1);

class BlogPost extends BaseModel {
    protected string $table = 'blog_posts';
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getAllPosts(): array {
        $stmt = $this->db->query("SELECT * FROM {$this->table} ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }
    
    public function getPublishedPosts(string $language = 'fr'): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE status = 'published' AND language = ? ORDER BY created_at DESC");
        $stmt->execute([$language]);
        return $stmt->fetchAll();
    }
    
    public function createPost(array $data): int {
        return $this->create($data);
    }
    
    public function updatePost(int $id, array $data): bool {
        $data['updated_at'] = date('Y-m-d H:i:s');
        return $this->update($id, $data);
    }
    
    public function deletePost(int $id): bool {
        return $this->delete($id);
    }
}
?>