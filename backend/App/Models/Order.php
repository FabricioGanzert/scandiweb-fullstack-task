<?php
namespace App\Models;

use PDO;

class Order extends AbstractModel {

    // We'll store the last inserted order ID here.
    public $id;

    // Set the table name
    public function setTable(): void {
        $this->table = 'orders';
    }

    // Create a new order and store the inserted ID.
    public function create(array $data) {
        $columns = implode(',', array_keys($data));
        $placeholders = implode(',', array_fill(0, count($data), '?'));
    
        $stmt = $this->pdo->prepare("INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})");
        $stmt->execute(array_values($data));
    
        // Retrieve and store the last inserted ID and data
        $this->id = $this->pdo->lastInsertId();
        $this->total_amount = $data['total_amount'] ?? null;
        $this->created_at = $data['created_at'] ?? null;
    
        return $this;
    }

    // Update an existing order
    public function update(int $id, array $data) {
        return parent::update($id, $data);
    }

    // Delete an order by ID
    public function delete(int $id) {
        return parent::delete($id);
    }

    // Retrieve all orders
    public function allOrders() {
        return $this->all();
    }

    // Find an order by ID
    public function findOrder(int $id) {
        return $this->find($id);
    }

    // Retrieve the order items for this order
    public function orderItems() {
        return $this->query("SELECT * FROM order_items WHERE order_id = ?", [$this->id]);
    }

    public function findWithItems($id) {
        // Fetch the order
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        $orderData = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if (!$orderData) {
            return null;
        }
    
        // Create an Order instance and set its properties
        $this->id = $orderData['id'];
        $this->total_amount = $orderData['total_amount'];
        $this->created_at = $orderData['created_at'];
    
        // Fetch order items
        $stmt = $this->pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmt->execute([$id]);
        $orderData['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Attach items directly to the object for GraphQL compatibility
        $this->items = $orderData['items'];
    
        return $this;
    }   

    // Return the order's ID.
    public function id() {
        return $this->id;
    }
}
?>
