<?php
ob_start();

    function sign($data) {
        $PrivKey = file_get_contents("./PrivKey.pem");
        openssl_sign($data, $signature, $PrivKey, OPENSSL_ALGO_SHA1);
        echo sprintf("%%%s%%%s", base64_encode($signature), $data);
    }

$id = (int)($_GET["id"] ?? die(json_encode(["message" => "Error handling your request."])));
$version = isset($_GET["version"]) ? filter_var($_GET["version"], FILTER_SANITIZE_NUMBER_INT, FILTER_NULL_ON_FAILURE) : -1;


if (file_exists($_SERVER["DOCUMENT_ROOT"] . "/asset/" . $id)){
    $file = file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/asset/" . $id);
    if (isset($_GET["sign"]) == true){
        sign($file);
	}else if($id == 1){
        sign($file);
	}else if($id == 2){
		sign($file);
	}else if($id == 3){
		sign($file);
	}else if($id == 4){
		sign($file);
	}else if($id == 5){
		sign($file);
	}else if($id == 7){
		sign($file);
	}else if($id == 6){
		sign($file);
	}else if($id == 8){
        sign($file);
	}else if($id == 9){
		sign($file);
	}else if($id == 10){
		sign($file);
	}else if($id == 11){
		sign($file);
	}else if($id == 12){
		sign($file);
	}else if($id == 13){
		sign($file);
	}else if($id == 14){
        sign($file);
	}else if($id == 1000){
		sign($file);
	}else if($id == 38037265){
		sign($file);
    }else{
        echo $file;
    }
}else{
    header("Location: https://assetdelivery.roblox.com/v1/asset/?id=$id&version=$version");
    die();
}
?>