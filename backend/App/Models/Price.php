<?php

namespace App\Models;

class Price extends AbstractModel {

    // Set the table name
    public function setTable(): void {
        $this->table = 'prices';
    }

    // Create a new price entry
    public function create(array $data) {
        return parent::create($data); // Reuse the parent create method
    }

    // Update an existing price
    public function update(int $id, array $data) {
        return parent::update($id, $data); // Reuse the parent update method
    }

    // Delete a price by ID
    public function delete(int $id) {
        return parent::delete($id); // Reuse the parent delete method
    }

    // Retrieve all prices
    public function allPrices() {
        return $this->all(); // Reuse the parent all() method
    }

    // Find a price by ID
    public function findPrice(int $id) {
        return $this->find($id); // Reuse the parent find() method
    }
}
?>
