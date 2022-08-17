@php
ob_start();
$PlaceID = addslashes($_GET["PlaceID"]);
@endphp
game:Load("http://morblox.us/asset?id=@php echo $PlaceID @endphp")
@php
$data = ob_get_clean();
$signature;
$key = file_get_contents(asset('GameRBLX/PrivKey.pem'));
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "" . sprintf("%%%s%%%s", base64_encode($signature), $data);
@endphp