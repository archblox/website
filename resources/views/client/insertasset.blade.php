@php    
	//header("location:" . $file);
    $nsets = (int)$_GET["nsets"];
    $type = (string)$_GET["type"];
    $userid = (int)$_GET["userid"];
    $sid = (int)$_GET["sid"];
    if ($nsets == 20 && $type == "user") {
        header("content-type:text/xml");
        $file = "http://morblox.us/stamper/base/{$userid}.xml";
        readfile($file);
    } else if ($sid != 0 && !$sid == null || $type == "0") {
        header("content-type:text/xml");
        $file = "http://morblox.us/stamper/sid/{$sid}.xml";
        readfile($file);
    } else {
        header("content-type:text/xml");
        $file = "http://morblox.us/fail.xml";
        readfile($file);
    }
@endphp