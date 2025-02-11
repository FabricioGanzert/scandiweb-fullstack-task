<?php

namespace App\Core;

use PDO;
use PDOException;

class Database {
    private $pdo;
    private $config;

    public function __construct() {
        $this->config = require '../config/config.php';
    }

    public function connect() {
        if ($this->pdo === null) {
            try {
                $dsn = "mysql:host={$this->config['database']['host']};dbname={$this->config['database']['dbname']};charset={$this->config['database']['charset']}";
                $this->pdo = new PDO($dsn, $this->config['database']['username'], $this->config['database']['password']);
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Database connection failed: " . $e->getMessage());
            }
        }
        return $this->pdo;
    }
}

?>