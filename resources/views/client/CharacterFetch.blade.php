@php
header("content-type:application/xml");
ob_start();
$userId = addslashes($_GET["userId"]);
//TODO: add catalog + avatar system
// http://morblox.us/Asset/BodyColors.ashx?userId=@php echo $userId @endphp;
@endphp