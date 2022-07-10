@php

header("content-type:text/plain");

ob_start();
@endphp

game:GetService("ScriptContext"):AddStarterScript(1)
@php
$data = ob_get_clean();
$signature;
$key = file_get_contents(asset("GameRBLX/PrivKey.pem"));
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "" . sprintf("%%%s%%%s", base64_encode($signature), $data);
@endphp