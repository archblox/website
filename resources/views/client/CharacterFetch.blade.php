@php
header("content-type:application/xml");
ob_start();
$userId = addslashes($_GET["userId"]);
//TODO: add catalog + avatar system
@endphp
http://morblox.us/Asset/BodyColors.ashx?userId=@php echo $userId @endphp;http://morblox.us/asset/?id=300