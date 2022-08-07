<!DOCTYPE html>
<html lang="en-us">

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
<form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none">
                @csrf
</form>
    <br>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}"
                width="200" height="40" /></a>
        <p id="morbin">We're Still Morbin'</p>
    </div>
    <div class="content_signup">
        <p class="warningtext">Your account isn't actually terminated. This is just a test page.</p>
        <br>
        <h1>Account Deleted</h1> <!-- Ban Type Goes here (Warning, [day number] Day Ban, Account Deleted, Account Disabled) -->
        <p><strong>Action taken on:</strong> 01/01/1970 12:00 AM</p> <!-- Timestamp -->
        <p><strong>Reason:</strong> liking the iphone 6</p> <!-- Reason -->
        <p><strong>Moderator Note:</strong> i like men</p> <!-- Moderator Note -->
        <p>If you would like to appeal, please <a href="https://discord.gg/nudzQ7hkWY">join our discord server.</a></p> <!-- If not banned from the server -->
        <!-- <p>You are unable to appeal your ban.</p> --> <!-- If banned from the server -->
        <!-- <p>To reactivate your account, click the button below.</p> --> <!-- If account is disabled only -->
        <p>Your account will be fully deleted in 3 months.</p> <!-- If account is disabled/terminated only, show time remaining. -->
        <!-- <a><button class="greybutton">Reactivate Account</button></a> --> <!-- Show this button once the ban time period is over, the account is disabled or it is a warn -->
        <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();"><button class="redbutton">Log out</button></a> <!-- Show this button only if the account is terminated, or is currently in the ban time period.  -->
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company. We're still Morbin'!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body>

</html>
