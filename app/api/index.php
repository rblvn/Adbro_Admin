<?php

$htmlFiles = glob("../../*.html");
$response = array();


foreach ($htmlFiles as $item){
    array_push($response, basename($item));

}

echo json_encode($response);