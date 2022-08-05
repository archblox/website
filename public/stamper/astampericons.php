<?php


    $url = explode("?", $_SERVER['REQUEST_URI']);
    $id = $url[1];
    //echo($id);
    $file = "https://morblox.us/stamper/stampericons.php?" . $id;
    header("location:" . $file);

?>