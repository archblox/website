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
    @auth
        @switch (Auth::user()->settings->theme)
            @case(3)
            <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
            <link href="{{ asset('css/appdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
            @break
            @case(2)
                <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
                <link href="{{ asset('css/2018.css?id=' . Str::random(8)) }}" rel="stylesheet">
            @break

            @default
                <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
        @endswitch
    @else
        <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @endauth
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
        <p>ARCHBLOX will be installed to %LOCALAPPDATA%\Archblx</p>
        <p class="important">You must be logged in to join games. Use studio to log in to your account.<p>
        <br>
        <strong>Requires .NET Framework 4.0.</strong>
        <p>Windows XP/Vista v1.0</p>
        <p><a href="{{ asset('xp/ARCHBLOXLauncher_XP.exe') }}">Launcher</a> | <a href="{{ asset('xp/ARCHBLOXBootstrapper_XP.exe') }}">Studio</a></p>
        <br>
        <strong>The below downloads require Windows 7 or newer and they require .NET Core 3.1.</strong>
        <br>
        <p>ARCHBLOX Launcher v2.7</p>
        <p><a href="{{ asset('launcher/ARCHBLOXLauncher-32bit.exe') }}">32 Bit</a> | <a href="{{ asset('launcher/ARCHBLOXLauncher-64bit.exe') }}">64 Bit</a></p>
        <br>
        <p>ARCHBLOX Studio Bootstrapper v1.4</p>
        <p><a href="{{ asset('bootstrapper/ARCHBLOXBootstrapper-32bit.exe') }}">32 Bit</a> | <a href="{{ asset('bootstrapper/ARCHBLOXBootstrapper-64bit.exe') }}">64 Bit</a></p>
        <br>
        <p>Source Code</p>
        <p><a href="https://github.com/Thomasluigi07/ARCHBLOXLauncher">Launcher</a> | <a href="https://github.com/Thomasluigi07/ARCHBLOXBootstrapper">Studio Bootstrapper</a></p>
        <p><a href="https://github.com/Thomasluigi07/ARCHBLOXLauncherLegacy">Launcher (XP, Vista)</a> | <a href="https://github.com/Thomasluigi07/ARCHBLOXBootstrapperLegacy">Studio Bootstrapper (XP, Vista)</a></p>
        <br>
        <p>If you get a popup saying "Windows protected your PC", press "More info" and then press "Run anyway".</p>
        <br>
        <p>If you get a popup saying "Virus detected", open Windows Security (Windows Defender if on Windows 10 or earlier) and then press Virus & threat protection, press Manage Settings, select Add or Remove exclusions, make a folder you want to exclude and then choose that folder, install the exe there.</p>
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company. We're still Morbin'!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body> 

</html>
