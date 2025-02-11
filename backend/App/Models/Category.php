<?php
// File: App/Models/Category.php

namespace App\Models;

use PDO;

class Category extends AbstractModel {

    public function setTable(): void {
        $this->table = 'categories';
    }

    // Retrieve related products as Product objects using the category name
    public function products() {
        $stmt = $this->pdo->prepare("SELECT * FROM products WHERE category = ?");
        $stmt->execute([$this->name]);
        return $stmt->fetchAll(PDO::FETCH_CLASS, Product::class);
    }

    public function create(array $data) {
        return parent::create($data);
    }

    public function update(int $id, array $data) {
        return parent::update($id, $data);
    }

    public function delete(int $id) {
        return parent::delete($id);
    }

    public static function allCategories() {
        $instance = new self();
        return $instance->all();
    }

    public function findCategory(int $id) {
        return $this->find($id);
    }
}
?>
