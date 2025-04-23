<?
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

header('Content-Type: application/json');

echo json_encode(["status" => "success", "message" => "Event added"]);
/*
include_once '_includes/init.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $date = $data['date'];
    $description = $data['description'];

    $query = sqlEXEC($mysqli, "INSERT INTO events (date, description) VALUES ('$date', '$description')");

    if ($query === TRUE) {
        echo json_encode(["status" => "success", "message" => "Event added"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add event"]);
    }
}*/
?>
