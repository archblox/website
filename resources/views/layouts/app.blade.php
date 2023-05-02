<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @yield('title')
    <meta charset="utf-8">
    @yield('titlediscord')
    @yield('descdiscord')
    <meta content="https://archblox.com" property="og:url" />
    <meta content="https://archblox.com/img/MORBLOXlogo.png" property="og:image" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <link rel="apple-touch-icon" href="{{ asset('img/MORBLOX.png') }}" />
    <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('img/MORBLOX.png') }}">
    <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('img/MORBLOX.png') }}">
    <link rel="apple-touch-startup-image" href="{{ asset('img/MORBLOXsplash.png') }}" />
    <meta name="viewport" content="width=device-width, viewport-fit=cover, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <script src="{{ asset('js/main.js?id=' . Str::random(8)) }}"></script>
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <script src="{{ asset('js/darkmode.js?id=' . Str::random(8)) }}"></script>
    @auth
    @switch (Auth::user()->settings->theme)
    @case(6)
    <script>
            getDarkMode();
    </script>
    @break
    @case(5)
    <meta content="#3690df" data-react-helmet="true" name="theme-color" />
    <link href="{{ asset('css/appdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/classicappdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(4)
    <meta content="#5082ed" data-react-helmet="true" name="theme-color" />
    <link href="{{ asset('css/classicapp.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(3)
    <meta content="#1952A6" data-react-helmet="true" name="theme-color" />
    <link href="{{ asset('css/appdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(2)
    <meta content="#0074bd" data-react-helmet="true" name="theme-color" />
    <link href="{{ asset('css/2018.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @default
    <meta content="#1952A6" data-react-helmet="true" name="theme-color" />
    @endswitch
    @else
    <script>
            getDarkMode();
    </script>
    @endauth
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
    <script src="{{ asset('js/detect.js?id=' . Str::random(8)) }}" defer></script>
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
            @guest
                <a id="logo_full" href="{{ route('index') }}"><img alt="ARCHBLOX Logo" class="btn-logo" src="{{ asset('img/MORBLOXlogo.png') }}"/></a>
                <a id="logo_small" href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/MORBLOXlogoshort.png') }}"/></a>
            @else
                <a id="logo_full" href="{{ route('home') }}"><img alt="ARCHBLOX Logo" class="btn-logo" src="{{ asset('img/MORBLOXlogo.png') }}"/></a>
                <a id="logo_small" href="{{ route('home') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/MORBLOXlogoshort.png') }}"/></a>
            @endguest
            <div id="NewRedesign" class="navbarbuttoncontainer NavigationRedesign">
                <ul id="ctl00_cphBanner_ctl00_MenuUL">
                <li><a class="navbarbutton" id="smallbtn5" href="{{ route('games') }}">Games</a></li>
                <li><a class="navbarbutton" id="smallbtn4" href="{{ route('catalog') }}">Catalog</a></li>
                <li><a class="navbarbutton" id="smallbtn0" onclick="openStudioPopup()">Build</a></li>
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
                    <div class="HeaderDivider"></div>
                    <div class="arkotcontainer"><img class="arkoticon_navbar" alt="{{ Auth::user()->morbux }}" src="{{ asset('img/arkot.png') }}">
                        <p>
                            @php
                                $n = Auth::user()->morbux;
                                if ($n < 1000000) {
                                    // Anything less than a million
                                    $n_format = number_format($n);
                                } else if ($n < 1000000000) {
                                    // Anything less than a billion
                                    $n_format = number_format($n / 1000000, 3) . 'M';
                                } else {
                                    // At least a billion
                                    $n_format = number_format($n / 1000000000, 3) . 'B';
                                }
                                echo $n_format
                            @endphp
                        </p>
                    </div>
                    <div class="HeaderDivider"></div>
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
            <a class="smallnavbarbutton" href="{{ route('avatar') }}">Avatar</a>
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

    @section('popup_content')

    <div class="popupcontainer_studio" id="invisible">
        <div class="popup" style="width: 390px">
            <h2 id="heading">Launching ARCHBLOX Studio...</h2>
            <br>
            <img style="height: 7%;width: 62px;"     
            @auth
            @switch (Auth::user()->settings->theme)
            @case(4)
            src="{{ asset('img/iosload.gif') }}"
            @break
            @case(5)
            src="{{ asset('img/iosload.gif') }}"
            @break
            @default
            src="{{ asset('img/archbloxload.gif') }}"
            @break
            @endswitch
            @else
            src="{{ asset('img/archbloxload.gif') }}"
            @endauth
            >
            <br>
            <br>
            <p>Don't have ARCHBLOX Studio installed?</p>
            <a href="{{ route('download') }}"><button style="height: 40px;width: 80%;" class="greenbutton">Click here to download ARCHBLOX Studio</button></a>
            <br>
            <br>
            <button class="redbutton" style="height: 40px;width: 80%;" onclick="closeStudioPopup()">Close</button>
        </div>
    </div>

    <div class="popupcontainer_client" id="invisible">
        <div class="popup" style="width: 390px">
            <h2 id="heading">Launching ARCHBLOX...</h2>
            <br>
            <img style="height: 7%;width: 62px;"  
            @auth
            @switch (Auth::user()->settings->theme)
            @case(4)
            src="{{ asset('img/iosload.gif') }}"
            @break
            @case(5)
            src="{{ asset('img/iosload.gif') }}"
            @break
            @default
            src="{{ asset('img/archbloxload.gif') }}"
            @break
            @endswitch
            @else
            src="{{ asset('img/archbloxload.gif') }}"
            @endauth
            >
            <br>
            <br>
            <p>Don't have ARCHBLOX installed?</p>
            <a href="{{ route('download') }}"><button style="height: 40px;width: 80%;" class="greenbutton">Click here to download ARCHBLOX</button></a>
            <br>
            <br>
            <button class="redbutton" style="height: 40px;width: 80%;" onclick="closeClientPopup()">Close</button>
        </div>
    </div>

    <div class="content">
        @yield('content')
    </div>
    <div id="footer">
        @if (!Auth::guest() && Auth::user()->isAdmin())
        <p><strong>{{ App\Models\User::count() }}</strong> users registered | <strong>{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subMinute()->toDateTimeString())->count(); }}</strong>
            users are online</p>
        <br>
        @endif
        <p><a href="{{ route('blog') }}">Blog</a> <a href="https://github.archblox.com">Github</a> <a href="https://twitter.archblox.com">Twitter</a> <a href="https://classic.archblox.com">Classic</a> <a href="https://status.archblox.com">Status</a> <a href="https://help.archblox.com">Help</a> <a href="https://discord.gg/invite/nudzQ7hkWY">Discord</a></p>
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company.</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body>

</html>