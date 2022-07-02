<!DOCTYPE html>
<html lang="en-us">

<head>
    <title>Login - {{ env('APP_NAME') }}</title>
    <meta charset="utf-8">
    <meta content="Login - ARCHBLOX" property="og:title" />
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
    <ul></ul>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/MORBLOXlogo.png') }}"
                width="200" height="40" /></a>
        <p id="morbin">We're Still Morbin'</p>
    </div>
    <div class="content_signup">
        <h1>Welcome back!</h1>
        <p>Don't have an account? <a href="{{ route('register') }}">Click here</a> to sign up.</p>
        <ul></ul>

        <form method="POST" action="{{ route('login') }}">
            @csrf
            <h3>Username/E-Mail Address</h3>
            <input id="login" type="text" name="login" value="{{ old('login') }}" required autofocus>
            @if ($errors->has('name') || $errors->has('email'))
                <span style="color:red" role="alert">
                    <strong>{{ $errors->first('name') ?: $errors->first('email') }}</strong>
                </span>
            @endif
            <h3>Password</h3>
            <input id="password" type="password" name="password" required autocomplete="current-password">
            @error('password')
                <span style="color:red" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
            <ul></ul>
            <input style="width:5%;margin-bottom:15px" type="checkbox" name="remember" id="remember"
                {{ old('remember') ? 'checked' : '' }}>

            <label class="form-check-label" for="remember">
                {{ __('Remember Me') }}
            </label>
            <button type="submit" class="greenbutton">Log in!</button>
            @if (Route::has('password.request'))
                <ul></ul>
                <a class="btn btn-link" href="{{ route('password.request') }}"
                    style="text-align:center;display:block;width:90%">
                    {{ __('Forgot Your Password?') }}
                </a>
            @endif
        </form>
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin
            time!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a>
        </p>
    </div id="footer">
</body>

</html>
