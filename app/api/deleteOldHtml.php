<?php

$oldFile = "../../" . $_POST["name"] . ".html";

if (file_exists($oldFile)){
    unlink($oldFile);
} else {
    header("HTTP/1.0 400 Bad Request");
}