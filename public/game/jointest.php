<?php

header("content-type:text/plain");

$username = addslashes($_GET["username"]);
$ip = addslashes($_GET["ip"]);
$port = addslashes($_GET["port"]);
$id = addslashes($_GET["id"]);


ob_start();
?>

{"ClientPort":0,"MachineAddress":"<?php echo $ip; ?>","ServerPort":<?php echo $port; ?>,"PingUrl":"","PingInterval":120,"UserName":"<?php echo $username; ?>","SeleniumTestMode":false,"UserId":<?php echo $id; ?>,"SuperSafeChat":false,"CharacterAppearance":"http://morblox.us/Asset/CharacterFetch.ashx","ClientTicket":"0ksaysdaddy","GameId":"00000000-0000-0000-0000-000000000000","PlaceId":1818,"MeasurementUrl":"","WaitingForCharacterGuid":"4d8dfc8d-cd68-4ed7-8adc-efebaba40f58","BaseUrl":"http://morblox.us/","ChatStyle":"ClassicAndBubble","VendorId":0,"ScreenShotInfo":"","VideoInfo":"<?xml version=\"1.0\"?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:media=\"http://search.yahoo.com/mrss/\" xmlns:yt=\"http://gdata.youtube.com/schemas/2007\"><media:group><media:title type=\"plain\"><![CDATA[ROBLOX Place]]></media:title><media:description type=\"plain\"><![CDATA[ For more games visit http://www.roblox.com]]></media:description><media:category scheme=\"http://gdata.youtube.com/schemas/2007/categories.cat\">Games</media:category><media:keywords>ROBLOX, video, free game, online virtual world</media:keywords></media:group></entry>","CreatorId":0,"CreatorTypeEnum":"User","MembershipType":"None","AccountAge":300000000,"CookieStoreFirstTimePlayKey":"rbx_evt_ftp","CookieStoreFiveMinutePlayKey":"rbx_evt_fmp","CookieStoreEnabled":true,"IsRobloxPlace":true,"GenerateTeleportJoin":false,"IsUnknownOrUnder13":false,"SessionId":"","DataCenterId":0,"UniverseId":0,"BrowserTrackerId":0,"UsePortraitMode":false,"FollowUserId":0,"characterAppearanceId":1}

<?php
$data = ob_get_clean();
$signature;
$key = file_get_contents("../GameRBLX/PrivKey.pem");
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "--rbxsig" . sprintf("%%%s%%%s", base64_encode($signature), $data);
?>