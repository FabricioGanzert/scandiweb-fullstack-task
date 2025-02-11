<?php

namespace App\Models;

class Attribute extends AbstractModel {

    // Set the table name
    public function setTable(): void {
        $this->table = 'attributes';
    }

    // Retrieve all attribute items for this attribute
    public function items() {
        return $this->query("SELECT * FROM attribute_items WHERE attribute_id = ?", [$this->id]);
    }

    // Create a new attribute
    public function create(array $data) {
        return parent::create($data); // Reuse the parent create method
    }

    // Update an existing attribute
    public function update(int $id, array $data) {
        return parent::update($id, $data); // Reuse the parent update method
    }

    // Delete an attribute by ID
    public function delete(int $id) {
        return parent::delete($id); // Reuse the parent delete method
    }

    // Retrieve all attributes
    public function allAttributes() {
        return $this->all(); // Reuse the parent all() method
    }

    // Find an attribute by ID
    public function findAttribute(int $id) {
        return $this->find($id); // Reuse the parent find() method
    }
}
?>
