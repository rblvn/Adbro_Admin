<?php

session_start();
if($_SESSION["auth"] != true){
    header("HTTP/1.0 403 Forbidden");
    die;
}

$htmlFiles = glob("../../*.html");
$response = array();


foreach ($htmlFiles as $item) {
    array_push($response, basename($item));
}

echo json_encode($response);