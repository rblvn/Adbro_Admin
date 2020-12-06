<?php

$newFile = "../../" . $_POST["name"] . ".html";

echo $newFile;

if(file_exists($newFile)){
    header("HTTP/1.0 400 Bad Request");
} else {
    fopen($newFile, "w");
}