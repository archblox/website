@php
header("content-type:application/xml");
ob_start();
$userId = addslashes($_GET["userId"]);
$hat1 = 300;
$hat2 = 0;
$hat3 = 0;
$shirt = 306;
$pants = 305;
$shirtgraphic = 303;
$face = 307;
//TODO: add catalog + avatar system
@endphp
http://morblox.us/Asset/BodyColors.ashx?userId=@php echo $userId @endphp;http://morblox.us/asset/?id=@php echo $hat1 @endphp;http://morblox.us/asset/?id=@php echo $hat2 @endphp;http://morblox.us/asset/?id=@php echo $hat3 @endphp;http://morblox.us/asset/?id=@php echo $shirt @endphp;http://morblox.us/asset/?id=@php echo $pants @endphp;http://morblox.us/asset/?id=@php echo $shirtgraphic @endphp;http://morblox.us/asset/?id=@php echo $face @endphp