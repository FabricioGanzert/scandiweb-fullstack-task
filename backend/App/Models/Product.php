<?php
namespace App\Models;

use PDO;

class Product extends AbstractModel {

    public function setTable(): void {
        $this->table = 'products';
    }

    // Define the relationship to the Category model (if needed)
    public function category() {
        // Adjust this method if needed. For example, if your product's category is stored in the "category" field,
        // you might query the categories table by matching the name.
        $stmt = $this->pdo->prepare("SELECT * FROM categories WHERE name = ?");
        $stmt->execute([$this->category]);
        return $stmt->fetchObject(Category::class);
    }
        
    // Retrieve all attributes for this product as Attribute objects
    public function attributes() {
        $stmt = $this->pdo->prepare("SELECT * FROM attributes WHERE product_id = ?");
        $stmt->execute([$this->id]);
        return $stmt->fetchAll(PDO::FETCH_CLASS, Attribute::class);
    }

    // Retrieve detailed price information for this product
    public function prices() {
        $stmt = $this->pdo->prepare("SELECT * FROM prices WHERE product_id = ?");
        $stmt->execute([$this->id]);
        $priceRows = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        return array_map(function($price) {
            return [
                "amount"   => (float)$price['amount'],
                "currency" => [
                    "label"      => $price['currency_label'],
                    "symbol"     => $price['currency_symbol'],
                    "__typename" => "Currency"
                ],
                "__typename" => $price['__typename']  // expected to be "Price"
            ];
        }, $priceRows);
    }

    // Retrieve all gallery image URLs for this product
    public function gallery() {
        $stmt = $this->pdo->prepare("SELECT image_url FROM gallery WHERE product_id = ?");
        $stmt->execute([$this->id]);
        // Fetch only the image_url column as an array of strings
        return $stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
    }

    // Retrieve availability status (inStock)
    public function inStock() {
        $stmt = $this->pdo->prepare("SELECT inStock FROM products WHERE id = ?");
        $stmt->execute([$this->id]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $row ? (bool)$row['inStock'] : false;
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

    public static function allProducts() {
        $instance = new self();
        return $instance->all();        
    }

    public function findProduct($id) {
        return $this->find($id);
    }


}
?>
