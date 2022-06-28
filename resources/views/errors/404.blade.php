<!DOCTYPE html>
<html lang="en-us">
    <head>
        <title>{{ env('APP_NAME') }} - 404</title>
        <meta content="morblox.us - 404" property="og:title"/>
        <meta content="MORBLOX is a work in progress revival." property="og:description"/>
        <meta content="https://morblox.us" property="og:url"/>
        <meta content="https://morblox.us/img/MORBLOXlogo.png" property="og:image"/>
        <meta content="#4b4b4b" data-react-helmet="true" name="theme-color"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
        <link rel="apple-touch-icon" href="MORBLOX.png"/>
        <link rel="apple-touch-startup-image" href="MORBLOXSplash.png"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    </head>
    <body>
        <ul></ul>
        <div id="logo_signup">
            <a href="{{ route('index') }}"><img alt="MORBLOX Logo" src="{{ asset('img/MORBLOXlogo.png') }}"
                width="200" height="40" /></a>
            <p id="morbin">It's MORBLOX time.</p>
        </div>
        <div class="content_signup">
            <h2>404 Page Not Found</h2>
            <p>Aw man, look at what you have done. You've made Luigi mad!</p>
            <p>Why don't you go back a page for us before Luigi destroys us all.</p>
            <img alt="Angry Luigi" src="{{ asset('img/error.png') }}" width="100%" height="max-content">
        </div>
        <div id="footer_signup">
            <p>MORBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin
                time!</p>
            <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
        </div>
    </body>
</html>