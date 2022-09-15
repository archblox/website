@php

header("content-type:text/plain");

ob_start();
@endphp

game:GetService("ScriptContext"):AddStarterScript(1)

pcall(function() game:GetService("InsertService"):SetFreeModelUrl("http://www.morblox.us/Game/Tools/InsertAsset.ashx?type=fm&q=%s&pg=%d&rs=%d") end)
pcall(function() game:GetService("InsertService"):SetFreeDecalUrl("http://www.morblox.us/Game/Tools/InsertAsset.ashx?type=fd&q=%s&pg=%d&rs=%d") end)

game:GetService("ScriptInformationProvider"):SetAssetUrl("http://www.morblox.us/Asset/")
game:GetService("InsertService"):SetBaseSetsUrl("http://www.morblox.us/Game/Tools/InsertAsset.ashx?nsets=10&type=base")
game:GetService("InsertService"):SetUserSetsUrl("http://www.morblox.us/Game/Tools/InsertAsset.ashx?nsets=20&type=user&userid=%d")
game:GetService("InsertService"):SetCollectionUrl("http://www.morblox.us/Game/Tools/InsertAsset.ashx?sid=%d")
game:GetService("InsertService"):SetAssetUrl("http://www.morblox.us/Asset/?id=%d")
game:GetService("InsertService"):SetAssetVersionUrl("http://www.morblox.us/Asset/?assetversionid=%d")

@php
$data = ob_get_clean();
$signature;
$key = file_get_contents(asset("GameRBLX/PrivKey.pem"));
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "" . sprintf("%%%s%%%s", base64_encode($signature), $data);
@endphp