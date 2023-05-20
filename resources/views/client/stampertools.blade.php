@php
$url = explode("?", $_SERVER['REQUEST_URI']);
$redirect_linka = $url[1];
//echo($redirect_linka);
preg_match('/fmt=(.*?)&wd/', $redirect_linka, $format);
//echo $format[1];
preg_match('/wd=(.*?)&ht=/', $redirect_linka, $width);
//echo $width[1];
preg_match('/&ht=(.*?)&aid/', $redirect_linka, $height);
//echo $height[1];
$id = substr($redirect_linka, strpos($redirect_linka, "aid=") + 4);
//echo $id;
$assetimage = file_get_contents('https://assetgame.roblox.com/Thumbs/Asset.asmx/RequestThumbnail_v2?assetId=' . $id .
'&assetVersionId=0&width=' . $width . '&height=' . $height . '&imageFormat=%22' . $format
.'%22&thumbnailFormatId=296&overrideModeration=false');
//echo $text;
preg_match('/"url":"(.*?)"}}/', $assetimage, $imageurl);
//echo $imageurl[1];
//header("Location: {$imageurl[1]}");
if (!file_exists('icons/'. $id . "+" . $width[1] . "+" . $height[1])) {
$newfile = 'icons/'. $id . "+" . $width[1] . "+" . $height[1];
echo($newfile);
if ( copy($imageurl[1], $newfile) ) {
echo "Copy success!";
$downloaded = true;
}else{
echo "Copy failed.";
}
}
$textbox = ($id . "+" . $width[1] . "+" . $height[1] );
header("Location: http://www.jarfeh.xyz/stamper/icons/{$textbox}");
exit();
@endphp 