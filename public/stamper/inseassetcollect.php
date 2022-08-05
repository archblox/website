<?php

    $url = explode("?", $_SERVER['REQUEST_URI']);
    $id = $url[1];
    //echo($id);
    $file = "http://roblox.com/Game/Tools/InsertAsset.ashx?" . $id;
    header("location:" . $file);

?>