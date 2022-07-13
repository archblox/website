<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @yield('title')
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
    <link href="{{ asset('css/app.css?id=e5Az527Gb1') }}" rel="stylesheet">
    <script src="{{ asset('js/main.js?id=z3b8JK2bff') }}"></script>
</head>

<body>
    @yield('alert')

    <div class="iphone-sidebar">
        <img src="https://archblox.com/img/MORBLOXlogo.png" width="50%">
        <p>Admin Panel</p>
        <p>Logged in as: {{ Auth::user()->name }}</p>
        <br>
        <a href="{{ route('admin_users') }}">User List</a>
        <br>
        <a>Invite Tree</a>
        <br><br>
        <a href="{{ route('home') }}"><span style="font-size:20px">←</span> Return to Main Site</a>
    </div>
    <div class="iphone-content"
        style="padding-left: 5px; padding-right: 0px; overflow-x: hidden; position: fixed; height: 100%; color: black;">
        @yield('content')
    </div>
</body>

</html>
