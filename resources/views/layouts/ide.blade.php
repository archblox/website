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
    <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('img/MORBLOX.png') }}">
    <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('img/MORBLOX.png') }}">
    <link rel="apple-touch-startup-image" href="{{ asset('img/MORBLOXsplash.png') }}" />
    <meta name="viewport" content="width=device-width, viewport-fit=cover, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link href="{{ asset('css/app.css?id=e5Az527Gb1') }}" rel="stylesheet">
    <script>
        var a=document.getElementsByTagName("a");
        for(var i=0;i<a.length;i++)
        {
            a[i].onclick=function()
            {
                window.location=this.getAttribute("href");
                return false
            }
        }
    </script>
    <script src="{{ asset('js/detect_small.js') }}" defer></script>
</head>

<body>
    @yield('alert')
    <div class="iphone-sidebar">
        <p><img src="https://archblox.com/img/MORBLOXlogo.png" width="50%"> Studio</p>
        @guest
        <a href="{{ route('login') }}">Log In</a>
        @else
        <p class="nonbolded">{{ Auth::user()->name }}</p>
            <br>
            <a style="color: white;" href="#">My Games</a>
            <br>
            <a style="color: white;" href="#">My Assets</a>
            @endguest
    </div>
    <div class="iphone-content">
        @yield('content')
    </div>
</body>

</html>