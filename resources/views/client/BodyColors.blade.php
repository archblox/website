@php
header("content-type:text/plain");
$userId = addslashes($_GET["userId"]);
if ($userId == 0) { 
    $headcolor = 2;
    $leftarmcolor = 1003;
    $leftlegcolor = 1003;
    $rightarmcolor = 1003;
    $rightlegcolor = 1003;
    $torsocolor = 1003;
} else {
    $headcolor = 11;
    $leftarmcolor = 11;
    $leftlegcolor = 1003;
    $rightarmcolor = 11;
    $rightlegcolor = 1003;
    $torsocolor = 1003;
}
//TODO: add avatar system 
@endphp
<?xml version="1.0" encoding="utf-8" ?>
<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.archblox.com/archblox.xsd" version="4">
    <External>null</External>
    <External>nil</External>
    <Item class="BodyColors">
        <Properties>
            <int name="HeadColor">@php echo $headcolor @endphp</int>
            <int name="LeftArmColor">@php echo $leftarmcolor @endphp</int>
            <int name="LeftLegColor">@php echo $leftlegcolor @endphp</int>
            <string name="Name">Body Colors</string>
            <int name="RightArmColor">@php echo $rightarmcolor @endphp</int>
            <int name="RightLegColor">@php echo $rightlegcolor @endphp</int>
            <int name="TorsoColor">@php echo $torsocolor @endphp</int>
            <bool name="archivable">true</bool>
        </Properties>
    </Item>
</roblox>