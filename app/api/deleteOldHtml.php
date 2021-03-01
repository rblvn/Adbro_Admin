<?php

$_POST = json_decode(file_get_contents('php://input'), true);

$oldFile = "../../" . $_POST["name"];

if (file_exists($oldFile)){
    unlink($oldFile);
} else {
    header("HTTP/1.0 400 Bad Request");
}