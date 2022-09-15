@php
// Splash Screens
$splash = array(
'It\'s Archaic!',
'Think. Build. Create.',
'MORBLOX never existed.',
'You make the game.',
'Memories under the arch.',
'Watch out for Archviles!',
'We\'re still Morbin\'',
'Why yes I play ARCHBLOX, how could you tell?',
'Do not sell us expensive helicopters',
'Get better at archery with ARCHBLOX!!!',
'my bitch got me a walle hat from disney land',
'We are powering laziness',
'If you can\'t beat em, join em',
'We will, we will rock you',
'I\'m a goofy goober',
'I LOVE BEING PURPLE',
'The slogan always changes!',
'Crosswoods is a great game!',
'The oldest anarchy server in minecraft.',
'Good morning U.S.A!',
'I\'ve got a feeling that it\'s gonna be a wonderful day',
'The sun in the sky has a smile on his face',
'And he\'s shining a salute to the American race',
'OOOH ARCHBLOX\'S OH YEAH',
'you know what they say all toasters toast toast',
'omg old roblox!!',
'Thomas was here!',
'C# moment!',
'Laravel moment!',
'?????????????',
'If you play, you play.',
'You die, you respawn.',
'You game... the build?',
'#announcements is an inside job',
'Buy our stocks or we\'ll buy your soul!',
'The physical equivalent to HALO, apparently',
':epic:',
'Arrrrrr! I\'m a pirate!',
'Now with 1337 viruses!',
'Are these slogans funny?',
'my dad left me',
'Never going to give you up',
'Never going to let you down.',
'Never going to run around and desert you.',
'We\'re all goofy goobers.',
'you play like an noob dont add me',
'Half-Life 3... confirmed?',
'sponge boy me bob..',
'yea mr krabs?',
'promise me you\'ll never install archblox ooghghIMFUCKING DYING',
'okay mr krabs',
'conkley is EPIC',
'skeuomorphism is awesome',
'It\'s free!',
'It\'s archtastic!'
);
@endphp

<!DOCTYPE html>
<html lang="en-us" class="loggedout">

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
    <link rel="apple-touch-startup-image" href="{{ asset('img/MORBLOXsplash.png') }}" />
    <meta name="viewport" content="width=device-width, viewport-fit=cover, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    @auth
    @switch (Auth::user()->settings->theme)
    @case(5)
    <meta content="#011130" data-react-helmet="true" name="theme-color" />
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/appdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(4)
    <meta content="#316bdf" data-react-helmet="true" name="theme-color" />
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(3)
    <meta content="#011130" data-react-helmet="true" name="theme-color" />
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/appdark.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @case(2)
    <meta content="#ffffff" data-react-helmet="true" name="theme-color" />
    <link href="{{ asset('css/app.css?id=' . Str::random(8)) }}" rel="stylesheet">
    <link href="{{ asset('css/2018.css?id=' . Str::random(8)) }}" rel="stylesheet">
    @break
    @default
    <meta content="#316bdf" data-react-helmet="true" name="theme-color" />
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

            var li = document.createElement('meta');
            var content = "#011130";
            var datareacthelmet = 'true';
            var name = "theme-color"
            li.setAttribute('content', content);
            li.setAttribute('data-react-helmet', datareacthelmet);
            li.setAttribute('name',name)
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

            var li = document.createElement('meta');
            var content = "#316bdf";
            var datareacthelmet = 'true';
            var name = "theme-color"
            li.setAttribute('content', content);
            li.setAttribute('data-react-helmet', datareacthelmet);
            li.setAttribute('name',name)
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
    <br>
    <div id="logo_signup">
        <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}" width="200"
                height="40" /></a>

        <p id="morbin">@php echo $splash[rand(0, count($splash) - 1)]; @endphp</p>
    </div>
    <div class="content_signup">
        @yield('contentloggedout')
    </div>
    <div id="footer_signup">
        @if (!Auth::guest() && Auth::user()->isAdmin())
        <p><strong>{{ App\Models\User::count() }}</strong> users registered |
            <strong>{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subMinute()->toDateTimeString())->count(); }}</strong>
            users are online
        </p>
        <br>
        @endif
        <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo or any other company.</p>
        <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>
    </div>
</body>

</html>