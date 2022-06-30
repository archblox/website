<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @yield('title')
    <meta charset="utf-8">
    <meta content="Morblox" property="og:title" />
    <meta content="MORBLOX is a work in progress revival." property="og:description" />
    <meta content="https://morblox.us" property="og:url" />
    <meta content="https://morblox.us/img/MORBLOXlogo.png" property="og:image" />
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
    <div class="navbar">
        <a id="logo_full" href="{{ route('home') }}"><img alt="MORBLOX Logo"
                src="{{ asset('img/MORBLOXlogo.png') }}" width="200" height="40" /></a>
        <a id="logo_small" class="invisible" href="{{ route('home') }}"><img alt="MORBLOX Logo"
                src="{{ asset('img/MORBLOXlogoshort.png') }}" width="45" height="40" /></a>
        <div class="navbarbuttoncontainer">
            <a class="navbarbutton" id="smallbtn5" href="#">Games</a>
            <a class="navbarbutton" id="smallbtn4" href="#">Catalog</a>
            <a class="navbarbutton" id="smallbtn0" href="#">Build</a>
            <a class="navbarbutton" id="smallbtn1" href="#">Forum</a>
            <a class="navbarbutton" id="smallbtn2"
                href="@guest {{ route('login') }}
@else
{{ route('profile', Auth::id()) }} @endguest">Profile</a>
            <a class="navbarbutton" id="smallbtn3" href="{{ route('settings') }}">Settings</a>
        </div>
        @guest
            <div id="navbarlogincontainer">
                <p><a href="{{ route('register') }}">Sign Up</a> or <a href="{{ route('login') }}">Log In</a>
            </div>
        @else
            <div id="navbarsignedincontainer">
                <p class="nonbolded" id="navbarusername">Logged in as: {{ Auth::user()->name }} <a
                        href="{{ route('logout') }}"
                        onclick="event.preventDefault();
                    document.getElementById('logout-form').submit();">Log
                        out...</a></p>
            </div>

            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none">
                @csrf
            </form>
        @endguest
    </div>
    <div class="smallnav">
        <div class="smallnavbarbuttoncontainer">
            <a class="smallnavbarbutton" href="#">Friends</a>
            <a class="smallnavbarbutton" href="#">Avatar</a>
            <a class="smallnavbarbutton" href="#">Transactions</a>
            <a class="smallnavbarbutton" href="{{ route('users') }}">Users</a>
            @if (!Auth::guest() && Auth::user()->isAdmin())
                <a class="smallnavbarbutton" href="{{ route('admin_index') }}">Admin</a>
            @endif
        </div>
    </div>
    @yield('alert')

    <div class="content">
        @yield('content')
    </div>
    <div id="footer">
        <p>MORBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin
            time!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a>
        </p>
    </div>
</body>

</html>
