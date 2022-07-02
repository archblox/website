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
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <script src="{{ asset('js/main.js') }}"></script>
</head>

<body>
    <ul></ul>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/MORBLOXlogo.png') }}"
                width="200" height="40" /></a>
        <p id="morbin">We're Still Morbin'</p>
    </div>
    <div class="content_signup">
        <h1>Welcome to ARCHBLOX!</h1>
        <p>ARCHBLOX is a Work-In-Progress revival.</p>
        <ul></ul>
        <a href="{{ route('login') }}">Log In</a>
        <a href="{{ route('register') }}">Sign Up</a>
        <ul></ul>
        <p id="ARCHBLOX" class="invisible">Want to check out the published site? <a href="https://archblox.com">Click
                here!</a></p>
        <p id="discord">Also, <a href="https://discord.gg/nudzQ7hkWY">Join our Discord!</a></p>
        <ul></ul>
        <ul></ul>
        <h3>User Count</h3>
        <p>There are <strong>{{ App\Models\User::count() }}</strong> users registered</p>
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin
            time!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body>

</html>
