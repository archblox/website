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
    @auth
    @switch (Auth::user()->settings->theme)
    @case(5)
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/appdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/classicappdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(4)
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/classicapp.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(3)
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/appdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(2)
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/2018.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break

    @default
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @endswitch
    @else
    <style> 
    body {
        display: none;
    }
    html {
        background: black;
    }
    </style>
    <script>        
    function getDarkMode() {
        var currentTime = new Date().getHours();
        if (6 >= currentTime || currentTime > 18) {
            var li = document.createElement('link');
            var href = "{{ asset('css/app.css?id='.Str::random(8)) }}";
            var rel = 'stylesheet';
            li.setAttribute('href', href);
            li.setAttribute('rel', rel);
            var s = document.getElementsByTagName('head')[0];
            s.appendChild(li, s);
            var li = document.createElement('link');
            var href = "{{ asset('css/appdark.css?id='.Str::random(8)) }}";
            var rel = 'stylesheet';
            li.setAttribute('href', href);
            li.setAttribute('rel', rel);
            var s = document.getElementsByTagName('head')[0];
            s.appendChild(li, s);
        } else {
            var li = document.createElement('link');
            var href = "{{ asset('css/app.css?id='.Str::random(8)) }}";
            var rel = 'stylesheet';
            li.setAttribute('href', href);
            li.setAttribute('rel', rel);
            var s = document.getElementsByTagName('head')[0];
            s.appendChild(li, s);
        }
    }
    getDarkMode()
    </script>
    <style>
    body {
        display: block !important;
    }
    </style>
    @endauth
    @yield('extras')
</head>

<body>
    <div class="BannerRedesign">
        <div id="NavigationRedesignBannerContainer" class="BannerCenterContainer">
            @auth
            @switch (Auth::user()->settings->theme)
            @case(2)
            <a id="smallnav_open"></a>
            <script>
            function third() {
                document.querySelector('.mySubmenuFixed.Redesign').classList.toggle('invisible_navbar');
            }
            document.querySelector('#smallnav_open').addEventListener('click', third);
            </script>
            @break
            @default
            @endswitch
            @endauth
            <a id="logo_full" href="{{ route('home') }}"><img alt="ARCHBLOX Logo" class="btn-logo" src="{{ asset('img/MORBLOXlogo.png') }}"/></a>
            <a id="logo_small" href="{{ route('home') }}"><img alt="ARCHBLOX Logo"
                    src="{{ asset('img/MORBLOXlogoshort.png') }}"/></a>
            <div id="NewRedesign" class="navbarbuttoncontainer NavigationRedesign">
                <ul id="ctl00_cphBanner_ctl00_MenuUL">
                <li><a class="navbarbutton" id="smallbtn5" href="{{ route('incomplete') }}">Games</a></li>
                <li><a class="navbarbutton" id="smallbtn4" href="{{ route('catalog') }}">Catalog</a></li>
                <li><a class="navbarbutton" id="smallbtn0" href="archbloxstudio://">Build</a></li>
                <li><a class="navbarbutton" id="smallbtn2" href="@guest {{ route('login') }}
    @else
    {{ route('profile', Auth::id()) }} @endguest">Profile</a></li>
                <li><a class="navbarbutton" id="smallbtn3" href="{{ route('settings') }}">Settings</a></li>
                </ul>
            </div>
            @guest
            <div id="navbarlogincontainer">
                <p><a id="HeaderSignUp" href="{{ route('register') }}">Sign Up</a><span id="HeaderOr">or</span><span id="loginSpan"><a id="headerLogin" href="{{ route('login') }}"></a></span></p>
            </div>
            @else
            <div id="HeaderLoginButton" class="RightNav">
                <div id="navbarsignedincontainer">
                    <a href="@guest {{ route('login') }} @else {{ route('profile', Auth::id()) }} @endguest">{{ Auth::user()->name }}</a>
                    <div class="arkotcontainer"><img class="arkoticon_navbar" src="{{ asset('img/arkot.png') }}">
                    <p> {{ Auth::user()->morbux }}</p>
                    </div>
                    <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">Logout</a></p>
                </div>
            </div>

            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none">
                @csrf
            </form>
            @endguest
            </div>
        </div>
    </div>
    <div class="mySubmenuFixed Redesign invisible_navbar">
        <div class="subMenu">
            <a class="smallnavbarbutton" href="{{ route('friends') }}">Friends @if (!Auth::guest() &&
                count(Auth::user()->getFriendRequests()))
                <span class="warningtext">({{ count(Auth::user()->getFriendRequests()) }})</span>
                @endif
            </a>
            <a class="smallnavbarbutton" href="{{ route('incomplete') }}">Avatar</a>
            <a class="smallnavbarbutton" href="{{ route('users') }}">Users</a>
            <a class="smallnavbarbutton" href="{{ route('inbox') }}">Messages @if (!Auth::guest() &&
                App\Models\Message::where(['sendto_id' => Auth::id(), 'read' => false])->count())
                <span
                    class="warningtext">({{ App\Models\Message::where(['sendto_id' => Auth::id(), 'read' => false])->count() }})</span>
                @endif
            </a>
            <a class="smallnavbarbutton" href="{{ route('blog') }}">Blog</a>
            @if (!Auth::guest() && Auth::user()->isAdmin())
            <a class="smallnavbarbutton" href="{{ route('admin_index') }}">Admin</a>
            @endif
        </div>
    </div>
    @yield('alert')

    @yield('custom_content')

    @yield('popup_content')
    <div class="content">
        @yield('content')
    </div>
    <div id="footer">
        @if (!Auth::guest() && Auth::user()->isAdmin())
        <p><strong>{{ App\Models\User::count() }}</strong> users registered | <strong>{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subMinute()->toDateTimeString())->count(); }}</strong>
            users are online</p>
        <br>
        @endif
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company.</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a>
        </p>
    </div>
</body>

</html>