<!DOCTYPE html>
<html lang="en-us">
    <head>
        <title>{{ env('APP_NAME') }} - 403</title>
        <meta content="ARCHBLOX - 403" property="og:title"/>
        <meta content="ARCHBLOX is a work in progress revival." property="og:description"/>
        <meta content="https://archblox.com" property="og:url"/>
        <meta content="https://archblox.com/img/MORBLOXlogo.png" property="og:image"/>
        <meta content="#4b4b4b" data-react-helmet="true" name="theme-color"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
        <link rel="apple-touch-icon" href="MORBLOX.png"/>
        <link rel="apple-touch-startup-image" href="MORBLOXSplash.png"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="stylesheet" href="{{ asset('css/app.css?id=e5Az527Gb1') }}">
        <script src="{{ asset('js/403.js') }}"></script>
    </head>
    <body>
        <br>
        <div id="logo_signup">
            <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}"
                width="200" height="40" /></a>
            <p id="morbin">We're Still Morbin'</p>
        </div>
        <div class="content_signup">
            <h2>403 Forbidden</h2>
            <p>OH SHIT WHAT HAVE YOU DONE GO BACK NOW BEFORE LUIGI KILLS US ALL!!!!!!</p>
            <p>Luigi: I AM GOING TO KILL EVERYONE IN <span id="timeElement">5</span></p>
            <img alt="Angry Luigi" src="{{ asset('img/error.png') }}" width="100%" height="max-content">
        </div>
        <div id="footer_signup">
            <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin
                time!</p>
            <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
        </div>
    </body>
</html>