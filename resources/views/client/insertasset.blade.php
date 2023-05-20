@php    
	//header("location:" . $file);
    if(isset($_GET['nsets'])){
        $nsets = (int)$_GET["nsets"];
    } else {
        $nsets = 0;
    }
    if(isset($_GET['type'])){
        $type = (string)$_GET["type"];
    } else {
        $type = "";
    }
    if(isset($_GET['userid'])){
        $userid = (int)$_GET["userid"];
    } else {
        $userid = 0;
    }
    if(isset($_GET['sid'])){
        $sid = (int)$_GET["sid"];
    } else {
        $sid = 0;
    }
    if ($nsets == 20 && $type == "user") {
        header("content-type:text/xml");
        $file = "http://jarfeh.xyz/stamper/base/{$userid}.xml";
        readfile($file);
    } else if ($sid != 0 || $type == "0") {
        header("content-type:text/xml");
        $file = "http://jarfeh.xyz/stamper/sid/{$sid}.xml";
        readfile($file);
    }
@endphp