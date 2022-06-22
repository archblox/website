<!DOCTYPE html>
<html lang="en-us">

<head>
    <title>{{ env('APP_NAME') }} - It's MORBLOX time.</title>
    <meta content="It's MORBLOX time." property="og:title" />
    <meta content="MORBLOX is a work in progress revival." property="og:description" />
    <meta content="https://thomasluigi07.github.io/MORBLOX-WEBSITE/" property="og:url" />
    <meta content="https://thomasluigi07.github.io/MORBLOX-WEBSITE/MORBLOXlogo.png" property="og:image" />
    <meta content="#4b4b4b" data-react-helmet="true" name="theme-color" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <link rel="apple-touch-icon" href="MORBLOX.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-startup-image" href="MORBLOXSplash.png" />
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
        <h1>Welcome to MORBLOX!</h1>
        <p>MORBLOX is a Work-In-Progress revival.</p>
        <ul></ul>
        <a href="{{ route('login') }}">Log In</a>
        <a href="{{ route('register') }}">Sign Up</a>
        <ul></ul>
        <p id="morblox" class="invisible">Want to check out the published site? <a href="https://morblox.us">Click
                here!</a></p>
        <p id="discord">Also, <a href="https://discord.gg/nudzQ7hkWY">Join our Discord!</a></p>
        <ul></ul>
        <h2>DEBUG SETTINGS BELOW!</h2>
        <p>Feel free to toy around with these, before they're gone forever!</p>
        <ul></ul>
        <h3>Page Links</h3>
        <a href="{{ route('home') }}">Home</a>
        <a href="games.html">Games</a>
        <a href="profile.html">Profile</a>
        <a href="404.html">404</a>
        <a href="logout.html">Logout</a>
        <ul></ul>
        <h3>Set LocalStorage Data</h3>
        <ul></ul>
        <form>
            <input id="UsernameSet" type="text" name="username" placeholder="Enter a Username">
            <button class="bluebutton" id="SaveButton">Save to LocalStorage...</button>
            <p id="UsernameContainer">Saved Username:</p>
        </form>
        <ul></ul>
    </div>
    <div id="footer_signup">
        <p>MORBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin
            time!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body>

</html>
