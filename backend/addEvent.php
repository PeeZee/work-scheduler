<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

header('Content-Type: application/json');

echo json_encode(["status" => "success", "message" => "Event added"]);

?>
