<?php
ob_start();
ini_set('user_agent', 'Roblox/WinInet'); // required for some audios

$id = (int)($_GET["id"] ?? die(json_encode(["message" => "Error handling your request."])));
$version = isset($_GET["version"]) ? filter_var($_GET["version"], FILTER_SANITIZE_NUMBER_INT, FILTER_NULL_ON_FAILURE) : -1;


if (file_exists($_SERVER["DOCUMENT_ROOT"] . "/asset/" . $id)){
    $file = file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/asset/" . $id);
}else{
    header("Location: https://assetdelivery.roblox.com/v1/asset/?id=$id&version=$version");
    die();
}
?>