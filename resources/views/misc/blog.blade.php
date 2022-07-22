<!DOCTYPE html>
<html lang="en-us" style="height: 100%;
    width: 100%;">

<head>
    <title>Blog - {{ env('APP_NAME') }}</title>
    <meta charset="utf-8">
    <meta content="Blog - {{ env('APP_NAME') }}" property="og:title" />
    <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
    <meta content="https://archblox.com" property="og:url" />
    <meta content="https://archblox.com/img/MORBLOXlogo.png" property="og:image" />
    <meta content="#4b4b4b" data-react-helmet="true" name="theme-color" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <link rel="apple-touch-icon" href="{{ asset('img/MORBLOX.png') }}" />
    <link rel="apple-touch-startup-image" href="{{ asset('img/MORBLOXsplash.png') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
</head>

<body style="height: 100%; margin: 0; width: 100%; overflow: hidden;">
    <div class="navbar">
        <a id="logo_full" href="{{ route('home') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/MORBLOXlogo.png') }}"
                width="200" height="40" /></a>
        <a id="logo_small" class="invisible" href="{{ route('home') }}"><img alt="ARCHBLOX Logo"
                src="{{ asset('img/MORBLOXlogoshort.png') }}" width="45" height="40" /></a>
        <div class="navbarbuttoncontainer">
            <a class="navbarbutton" id="smallbtn5" href="{{ route('incomplete') }}">Games</a>
            <a class="navbarbutton" id="smallbtn4" href="{{ route('incomplete') }}">Catalog</a>
            <a class="navbarbutton" id="smallbtn0" href="{{ route('incomplete') }}">Build</a>
            <a class="navbarbutton" id="smallbtn2" href="@guest {{ route('login') }}
@else
{{ route('profile', Auth::id()) }} @endguest">Profile</a>
            <a class="navbarbutton" id="smallbtn3" href="{{ route('settings') }}">Settings</a>
        </div>
        @guest
        <div id="navbarlogincontainer">
            <p><a href="{{ route('register') }}">Sign Up</a> or <a href="{{ route('login') }}">Log In</a></p>
        </div>
        @else
        <div id="navbarsignedincontainer">
            <p class="nonbolded" id="navbarusername">{{ Auth::user()->name }} | <a href="{{ route('logout') }}" onclick="event.preventDefault();
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
            <a class="smallnavbarbutton" href="{{ route('friends') }}">Friends @if (!Auth::guest() &&
                count(Auth::user()->getFriendRequests())) <span
                    class="warningtext">({{ count(Auth::user()->getFriendRequests()) }})</span> @endif</a>
            <a class="smallnavbarbutton" href="{{ route('incomplete') }}">Avatar</a>
            <a class="smallnavbarbutton" href="{{ route('users') }}">Users</a>
            @if (!Auth::guest() && Auth::user()->isAdmin())
            <a class="smallnavbarbutton" href="{{ route('admin_index') }}">Admin</a>
            @endif
        </div>
    </div>
    @yield('alert')
    <iframe src="https://archblox.blogspot.com" title="ARCHBLOX Blog" width="100%" height="100%"
        style="border:none;"></iframe>
</body>

</html>