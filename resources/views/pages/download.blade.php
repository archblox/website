<!DOCTYPE html>
<html lang="en-us">

<head>
    <title>Download - {{ env('APP_NAME') }}</title>
    <meta charset="utf-8">
    <meta content="Download - {{ env('APP_NAME') }}" property="og:title" />
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
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>
    <br>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}"
                width="200" height="40" /></a>
        <p id="morbin">We're Still Morbin'</p>
    </div>
    <div class="content_signup">
        <h1>Downloads</h1>
        <strong>Requires Windows 7 or newer and Microsoft .net 3.1.</strong>
        <p>ARCHBLOX will be installed to %LOCALAPPDATA%\Archblx\Versions</p>
        <br>
        <p>ARCHBLOX Launcher v2.5</p>
        <p><a href="{{ asset('launcher/ARCHBLOXLauncher-32bit.exe') }}">32 Bit</a> <a href="{{ asset('launcher/ARCHBLOXLauncher-64bit.exe') }}">64 Bit</a></p>
        <br>
        <p>ARCHBLOX Studio Bootstrapper v1.3</p>
        <p><a href="{{ asset('bootstrapper/ARCHBLOXBootstrapper-32bit.exe') }}">32 Bit</a> <a href="{{ asset('bootstrapper/ARCHBLOXBootstrapper-64bit.exe') }}">64 Bit</a></p>
        <br>
        <p>If you get a popup saying "Windows protected your PC", press "More info" and then press "Run anyway".</p>
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company. We're still Morbin'!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body> 

</html>
