<!DOCTYPE html>
<html lang="en-us">

<head>
    <title>Register - {{ env('APP_NAME') }}</title>
    <meta content="morblox.us - Sign Up" property="og:title" />
    <meta content="MORBLOX is a work in progress revival." property="og:description" />
    <meta content="https://thomasluigi07.github.io/MORBLOX-WEBSITE/" property="og:url" />
    <meta content="https://thomasluigi07.github.io/MORBLOX-WEBSITE/MORBLOXlogo.png" property="og:image" />
    <meta content="#4b4b4b" data-react-helmet="true" name="theme-color" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" href="MORBLOX.png" />
    <link rel="apple-touch-startup-image" href="MORBLOXSplash.png" />
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>

<body>
    <ul></ul>
    <ul></ul>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="MORBLOX Logo" src="{{ asset('img/MORBLOXlogo.png') }}"
            width="200" height="40" /></a>
        <p id="morbin">It's MORBLOX time.</p>
    </div>
    <div class="content_signup">
        <h1>Welcome to MORBLOX!</h1>
        <p>Have an account already? <a href="{{ route('login') }}">Click here</a> to log in.</p>
        <ul></ul>
        <p>Before entering anything, please read the <a href="privacy_signup.html">Privacy Policy</a> and the <a
                href="tos_signup.html">Terms of Service</a>.</p>
        <ul></ul>
        <form method="POST" action="{{ route('register') }}">
            @csrf
            <h3>Username</h3>
            <input id="name" type="text" placeholder="Enter a username!" name="name"
                value="{{ old('name') }}" required autocomplete="name" autofocus>
            <p>Usernames must be 3-20 characters, and must not break the rules.</p>
            @error('name')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
            <ul></ul>
            <h3>E-Mail Address</h3>
            <input id="email" type="email" name="email" value="{{ old('email') }}" required
                autocomplete="email">
            @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
            <h3>Confirm E-Mail Address</h3>
            <input id="email-confirm" type="email" name="email_confirmation" value="{{ old('email_confirmation') }}"
                required autocomplete="email">
            @error('email_confirmation')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
            <ul></ul>
            <h3>Date of Birth</h3>
            <input id="dob" type="date" name="dob" value="{{ old('dob') }}" required>
            @error('dob')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
            <ul></ul>
            <h3>Password</h3>
            <input id="password" type="password" name="password" required autocomplete="password">
            <p>Don't reuse passwords, and don't use a simple one!</p>
            <p>Passwords must be 8 or more charactes, with 1 number and 1 symbol.</p>
            @error('password')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
            <ul></ul>
            <h3>Invite Key</h3>
            <input id="key" type="text" name="key" placeholder="Invite Key" value="{{ old('key') }}"
                required>
            <p>An Invite Key is required to sign up. You can obtain one from a person that has played MORBLOX.</p>
            <p>Don't beg for keys.</p>
            <ul></ul>
            <button class="greenbutton">Sign Up!</button>
    </div>
    <div id="footer_signup">
        <p>MORBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin time!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>      
    </div id="footer">
</body>

</html>