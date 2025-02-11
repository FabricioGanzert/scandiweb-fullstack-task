<?php

namespace App\Models;

use App\Core\Database;
use PDO;
use PDOException;

#[\AllowDynamicProperties]
abstract class AbstractModel {
    protected $table;
    protected $primaryKey = 'id';
    protected $attributes = [];
    protected $pdo;

    abstract public function setTable(): void;

    public function __construct() {
        $this->pdo = (new Database())->connect();
        $this->setTable();
    }

    protected function query(string $sql, array $params = [], $fetchMode = null) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            if (stripos($sql, 'SELECT') === 0) {
                if ($fetchMode === PDO::FETCH_CLASS) {
                    return $stmt->fetchAll(PDO::FETCH_CLASS, static::class);
                }
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                return $stmt->rowCount();
            }
        } catch (PDOException $e) {
            die("Query failed: " . $e->getMessage());
        }
    }

    public function all() {
        return $this->query("SELECT * FROM {$this->table}", [], PDO::FETCH_CLASS);
    }

    public function find($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        // Fetch as the class instance of the current model
        return $stmt->fetchObject(static::class);
    }    

    public function create(array $data) {
        $columns = implode(',', array_keys($data));
        $placeholders = implode(',', array_fill(0, count($data), '?'));
        return $this->query("INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})", array_values($data));
    }

    public function update(int $id, array $data) {
        $setPart = implode(', ', array_map(fn($key) => "{$key} = ?", array_keys($data)));
        return $this->query("UPDATE {$this->table} SET {$setPart} WHERE {$this->primaryKey} = ?", array_merge(array_values($data), [$id]));
    }

    public function delete(int $id) {
        return $this->query("DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?", [$id]);
    }
}
?>
