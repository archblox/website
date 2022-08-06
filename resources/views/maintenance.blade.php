<!DOCTYPE html>
<html lang="en-us" style="background-image: none; background-color: #000000">

<head>
    <title>{{ env('APP_NAME') }}</title>
    <meta charset="utf-8">
    <meta content="ARCHBLOX" property="og:title" />
    <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
    <meta content="https://archblox.com" property="og:url" />
    <meta content="https://archblox.com/img/MORBLOXlogo.png" property="og:image" />
    <meta content="#4b4b4b" data-react-helmet="true" name="theme-color" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <link rel="apple-touch-icon" href="{{ asset('img/MORBLOX.png') }}" />
    <link rel="apple-touch-startup-image" href="{{ asset('img/MORBLOXsplash.png') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
</head>

<body>
    <h1 style="color: #ffffff">Oh Noes! ARCHBLOX is currently under maintenance.</h1>
    <p style="color: #ffffff">ARCHBLOX will be back as soon as we can fix it.</p>
    <br>
    <p style="color: #ffffff">Impaitient? <a href="https://discord.gg/nudzQ7hkWY">Join our Discord Server</a> for status updates.</p>
    <br>
    <br>
    <p><button class="greybutton">A</button><button class="greybutton">R</button><button class="greybutton">C</button><button class="greybutton">H</button><button class="greybutton">B</button><button class="greybutton">L</button><button class="greybutton">O</button><button class="greybutton">X</button><input type="text"><button class="greenbutton">Enter</button></p>
</body>

</html>
