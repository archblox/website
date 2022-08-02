<!DOCTYPE html>
<html lang="en-us">

<head>
    <title>{{ env('APP_NAME') }} - We're Still Morbin'</title>
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
    <br>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}"
                width="200" height="40" /></a>
        <p id="morbin">We're Still Morbin'</p>
    </div>
    <div class="content_signup">
        <h1>Ban Type Goes here (Warning, [day number] Day Ban, Account Terminated)</h1>
        <p>Timestamp</p>
        <p><strong>Moderator Note:</strong> bla bla bla this is some text xd!.</p>
        <p>If you would like to appeal, please join our discord server.</p>
        <button class="greybutton">Re-Activate my account</button>
        <button class="greybutton">Log out</button>
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company. We're still Morbin'!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body>

</html>
