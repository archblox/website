<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @yield('title')
    <meta charset="utf-8">
    <meta content="ARCHBLOX" property="og:title" />
    <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
    <meta content="https://archblox.com" property="og:url" />
    <meta content="https://archblox.com/img/MORBLOXlogo.png" property="og:image" />
    <meta content="#333" data-react-helmet="true" name="theme-color" />
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
    <link href="/css/AdminPanelCSS.css" rel="stylesheet">
    <link href="/css/AdminPanel.css" rel="stylesheet">
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
    <script src="{{ asset('js/detect_iphone.js') }}" defer></script>
</head>

<body class="dark-theme">
    @yield('alert')

    <div id="MasterContainer" class="AdminPanel" style="width: 100%;">
    <div id="AdminWrapper" class="Navigation">
        <div class="AdminHeader">
            <span><a href="{{ route('home') }}" title="ARCHBLOX Home" class="SiteBrand"></a></span>
            <a class="Slogan">Admin Panel</a>
            <div class="AuthenticatedUserNameWrapper">Logged in as <a class="AuthenticatedUserName" href="@guest {{ route('login') }} @else {{ route('profile', Auth::id()) }} @endguest">{{ Auth::user()->name }}</a></div>
            <div class="logoutbtn">
            <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();" class="logout AuthenticatedUserName">Logout</a>
            <span class="logoutarrow"><span>
            </div>
        </div>
        <form id="logout-form" class="hidden" action="{{ route('logout') }}" method="POST">@csrf</form>
        <div class="AdminSubHeader">
            <ul>
                <li><a class="sub-menu" href="{{ route('admin_users') }}">User List</a></li>
                <li><a class="sub-menu" href="{{ route('admin_index') }}">Status</a></li>
                <li><a class="sub-menu" href="{{ route('admin_tree') }}">Invite Tree</a></li>
            </ul>
        </div>
    </div>
    <div id="BodyWrapper">
        @yield('Body')
    </div>
    </div>
    @yield('AdminPanel')
</body>
</html>