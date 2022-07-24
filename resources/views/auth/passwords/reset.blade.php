<!DOCTYPE html>
<html lang="en-us">

<head>
    <title>Reset Password - {{ env('APP_NAME') }}</title>
    <meta charset="utf-8">
    <meta content="Reset Password - ARCHBLOX" property="og:title" />
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
    <link href="{{ asset('css/app.css?id=e5Az527Gb1') }}" rel="stylesheet">
</head>

<body>
    <br>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}"
                width="200" height="40" /></a>
        <p id="morbin">We're Still Morbin'</p>
    </div>
    <div class="content_signup">
    <h1>Reset Password</h1>
    <p>Passwords must be 8 or more characters, with 1 capital letter, 1 symbol and 1 number.</p><br>
    <form method="POST" action="{{ route('password.update') }}">
        @csrf

        <input type="hidden" name="token" value="{{ $token }}">

        <h3>Email Address</h3>
        <input id="email" type="email" name="email" value="{{ $email ?? old('email') }}" required autocomplete="email"
            autofocus>

        @error('email')
            <span class="warningtext" role="alert">
                <br><strong>{{ $message }}</strong>
            </span>
        @enderror

        <h3>New Password</h3>
        <input id="password" type="password" name="password" required autocomplete="new-password"
            placeholder="Enter your new password">

        @error('password')
            <span class="warningtext" role="alert">
                <br><strong>{{ $message }}</strong>
            </span>
        @enderror

        <h3>Confirm New Password</h3>
        <input id="password-confirm" type="password" name="password_confirmation" required autocomplete="new-password"
            placeholder="Confirm your new password">
        <br><br>

        <button type="submit" onClick="this.form.submit();this.disabled=true">
            Reset Password
        </button>
    </form>
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company. We're still Morbin'!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body>

</html>
