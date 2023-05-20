<?php

    $url = explode("?", $_SERVER['REQUEST_URI']);
    $id = $url[1];
    $file = "http://assetgame.jarfeh.xyz/Game/LuaWebService/HandleSocialRequest.ashx?" . $id;
    //header("location:" . $file);

?>