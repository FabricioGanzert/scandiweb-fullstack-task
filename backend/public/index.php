<?php

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// public/index.php

require_once '/var/www/html/backend/vendor/autoload.php';

use App\Controller\GraphQL;

// Handle the GraphQL query
try {
    echo GraphQL::handle();
} catch (Exception $e) {
    error_log("GraphQL Execution Error: " . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);
}

?>