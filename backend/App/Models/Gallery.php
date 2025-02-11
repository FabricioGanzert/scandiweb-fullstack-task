<?php

namespace App\Models;

class Gallery extends AbstractModel {

    // Set the table name
    public function setTable(): void {
        $this->table = 'gallery';
    }

    // Create a new image entry in the gallery
    public function create(array $data) {
        return parent::create($data); // Reuse the parent create method
    }

    // Update an existing gallery image
    public function update(int $id, array $data) {
        return parent::update($id, $data); // Reuse the parent update method
    }

    // Delete a gallery image by ID
    public function delete(int $id) {
        return parent::delete($id); // Reuse the parent delete method
    }

    // Retrieve all gallery images for a product
    public function allGallery() {
        return $this->all(); // Reuse the parent all() method
    }

    // Find a gallery image by ID
    public function findGallery(int $id) {
        return $this->find($id); // Reuse the parent find() method
    }
}
?>
