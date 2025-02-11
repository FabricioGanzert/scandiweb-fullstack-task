<?php

namespace App\Models;

class OrderItem extends AbstractModel {

    // Set the table name
    public function setTable(): void {
        $this->table = 'order_items';
    }

    // Create a new order item
    public function create(array $data) {
        return parent::create($data); // Reuse the parent create method
    }

    // Update an existing order item
    public function update(int $id, array $data) {
        return parent::update($id, $data); // Reuse the parent update method
    }

    // Delete an order item by ID
    public function delete(int $id) {
        return parent::delete($id); // Reuse the parent delete method
    }

    // Retrieve all order items
    public function allOrderItems() {
        return $this->all(); // Reuse the parent all() method
    }

    // Find an order item by ID
    public function findOrderItem(int $id) {
        return $this->find($id); // Reuse the parent find() method
    }
}
?>
