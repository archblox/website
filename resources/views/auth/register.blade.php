<!DOCTYPE html>
<html lang="en-us">

<head>
    <title>Register - {{ env('APP_NAME') }}</title>
    <meta charset="utf-8">
    <meta content="Register - ARCHBLOX" property="og:title" />
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
    <br>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}"
            width="200" height="40" /></a>
        <p id="morbin">We're Still Morbin'</p>
    </div>
    <div class="content_signup">
        <h1>Welcome to ARCHBLOX!</h1>
        <p>Have an account already? <a href="{{ route('login') }}">Click here</a> to log in.</p>
        <br>
        <p>Before entering anything, please read the <a href="{{ route('privacy') }}">Privacy Policy</a> and the <a
                href="{{ route('tos') }}">Terms of Service</a>.</p>
        <br>
        <form method="POST" action="{{ route('register') }}">
            @csrf
            <h3>Username</h3>
            <input id="name" type="text" placeholder="Enter a username!" name="name"
                value="{{ old('name') }}" required autocomplete="name" autofocus>
            <p>Usernames must be 3-20 characters, and must not break the rules.</p>
            @error('name')
                <div class="invalid-feedback" style="color:red">
                    <strong>{{ $message }}</strong>
                </div>
            @enderror
            <br>
            <h3>E-Mail Address</h3>
            <input id="email" type="email" name="email" value="{{ old('email') }}" required
                autocomplete="email">
            @error('email')
                <div class="invalid-feedback" style="color:red">
                    <strong>{{ $message }}</strong>
                </div>
            @enderror
            <h3>Confirm E-Mail Address</h3>
            <input id="email-confirm" type="email" name="email_confirmation" value="{{ old('email_confirmation') }}"
                required autocomplete="email">
            @error('email_confirmation')
                <div class="invalid-feedback" style="color:red">
                    <strong>{{ $message }}</strong>
                </div>
            @enderror
            <br>
            <h3>Date of Birth</h3>
            <input id="dob" type="date" name="dob" value="{{ old('dob') }}" required>
            @error('dob')
                <div class="invalid-feedback" style="color:red">
                    <strong>{{ $message }}</strong>
                </div>
            @enderror
            <br>
            <h3>Password</h3>
            <input id="password" type="password" name="password" required autocomplete="password">
            <p>Don't reuse passwords, and don't use a simple one!</p>
            <p>Passwords must be 8 or more characters, with 1 capital letter, 1 symbol and 1 number.</p>
            <p class="important">Don't forget your password! Passwords are currently non-recoverable.</p>
            @error('password')
                <div class="invalid-feedback" style="color:red">
                    <strong>{{ $message }}</strong>
                </div>
            @enderror
            <br>
            <h3>Invite Key</h3>
            <input id="key" type="text" name="key" placeholder="Invite Key" value="{{ old('key') }}"
                required>
            @error('key')
                <div class="invalid-feedback" style="color:red">
                    <strong>Incorrect invite key.</strong>
                </div>
            @enderror
            <p>An Invite Key is required to sign up. You can obtain one from a person that has played ARCHBLOX.</p>
            <p>Don't beg for keys.</p>
            <br>
            <button class="greenbutton">Sign Up!</button>
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin time!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>      
    </div id="footer">
</body>

</html>
