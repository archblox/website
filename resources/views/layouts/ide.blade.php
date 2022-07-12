<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @yield('title')
    <meta charset="utf-8">
    @yield('titlediscord')
    @yield('descdiscord')
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
    <link href="{{ asset('css/app.css?id=z3b8JK2bff') }}" rel="stylesheet">
    <script src="{{ asset('js/main.js?id=z3b8JK2bff') }}"></script>
</head>

<body>
    @yield('alert')
    <div class="iphone-sidebar" style="color: #000000; background-color: #ffffff">
        <p><img src="https://archblox.com/img/MORBLOXlogo.png" width="50%"> Studio</p>
        <p>Logged in as: {{ Auth::user()->name }}</p>
        <br>
        <a style="color: blue;" href="#">My Games</a>
        <br>
        <a style="color: black;" href="#">My Assets</a>
    </div>
    <div class="iphone-content"
        style="padding-left: 5px; padding-right: 0px; overflow-x: hidden; position: fixed; height: 100%; color: #000000; background-color: #aaaaaa">
        @yield('content')
    </div>
</body>

</html>
