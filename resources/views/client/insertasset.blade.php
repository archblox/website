@php    
	//header("location:" . $file);
    $nsets = (int)$_GET["nsets"];
    $type = (string)$_GET["type"];
    $userid = (int)$_GET["userid"];
    $sid = (int)$_GET["sid"];
    //http://roblox.com/Game/Tools/InsertAsset.ashx?nsets=20&type=user&userid=11744447
    if ($nsets == 20 && $type == "user")
    {
        header("content-type:text/xml");
        $file = "http://morblox.us/stamper/base/{$userid}.xml";
        readfile($file);
        //
        //header("location:" . "http://morblox.us/stamper/base/{$userid}.xml");
    } elseif ($sid != 0 && $type == "0")
    {
        header("content-type:text/xml");
        $file = "http://morblox.us/stamper/sid/{$sid}.xml";
        readfile($file);
    } else
        header("content-type:text/xml");
        $file = "http://morblox.us/fail.xml";
        readfile($file);
    }
@endphp