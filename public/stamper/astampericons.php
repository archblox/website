<?php


    $url = explode("?", $_SERVER['REQUEST_URI']);
    $id = $url[1];
    //echo($id);
    $file = "https://jarfeh.xyz/stamper/stampericons.php?" . $id;
    header("location:" . $file);

?>