@php

header("content-type:text/plain");

ob_start();
@endphp

game:GetService("ScriptContext"):AddStarterScript(1)

pcall(function() game:GetService("InsertService"):SetFreeModelUrl("http://www.jarfeh.xyz/Game/Tools/InsertAsset.ashx?type=fm&q=%s&pg=%d&rs=%d") end)
pcall(function() game:GetService("InsertService"):SetFreeDecalUrl("http://www.jarfeh.xyz/Game/Tools/InsertAsset.ashx?type=fd&q=%s&pg=%d&rs=%d") end)

game:GetService("ScriptInformationProvider"):SetAssetUrl("http://www.jarfeh.xyz/asset/")
game:GetService("InsertService"):SetBaseSetsUrl("http://www.jarfeh.xyz/Game/Tools/InsertAsset.ashx?nsets=10&type=base")
game:GetService("InsertService"):SetUserSetsUrl("http://www.jarfeh.xyz/Game/Tools/InsertAsset.ashx?nsets=20&type=user&userid=%d")
game:GetService("InsertService"):SetCollectionUrl("http://www.jarfeh.xyz/Game/Tools/InsertAsset.ashx?sid=%d")
game:GetService("InsertService"):SetAssetUrl("http://www.jarfeh.xyz/asset/?id=%d")
game:GetService("InsertService"):SetAssetVersionUrl("http://www.jarfeh.xyz/asset/?assetversionid=%d")

@php
$data = ob_get_clean();
$signature;
$key = file_get_contents(asset("GameRBLX/PrivKey.pem"));
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "" . sprintf("%%%s%%%s", base64_encode($signature), $data);
@endphp