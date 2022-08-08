<!DOCTYPE html>
<html lang="en-us" class="loggedout">

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
    @break
    @case(4)
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
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
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <script>
    function getDarkMode() {
        var currentTime = new Date().getHours();
        if (6 >= currentTime && currentTime > 18) {} else {
            // it is night time for the user, let's force dark mode.
            var li = document.createElement('link');
            var href = "{{ asset('css/appdark.css?id='.Str::random(8)) }}";
            var rel = 'stylesheet';
            li.setAttribute('href', href);
            li.setAttribute('rel', rel);
            var s = document.getElementsByTagName('head')[0];
            s.appendChild(li, s);
        }
    }
    getDarkMode()
    </script>
    @endauth
    @yield('extras')
</head>

<body>
    <br>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}" width="200"
                height="40" /></a>
        <p id="morbin">We're Still Morbin'</p>
    </div>
    <div class="content_signup">
        @yield('contentloggedout')
    </div>
    <div id="footer_signup">
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company.
            We're still Morbin'!</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body>

</html>