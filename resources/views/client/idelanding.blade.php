@extends('layouts.ide')
@section('title')
<title>Start Page</title>
@endsection
@section('titlediscord')
<meta content="Start Page - {{env('APP_NAME')}}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX" property="og:description" />
@endsection
@section('extras')
<script type="text/javascript" src="{{ asset('js/test.js') }}"></script>
<script type="text/javascript" src="//web.archive.org/web/20130702194455js_/http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js"></script>
<script type="text/javascript">window.jQuery || document.write("<script type='text/javascript' src='/js/jquery/jquery-1.7.2.min.js'><\/script>")</script>
<script type="text/javascript" src="//web.archive.org/web/20130702194455js_/http://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
<script type="text/javascript">window.Sys || document.write("<script type='text/javascript' src='/js/Microsoft/MicrosoftAjax.js'><\/script>")</script>
<script type="text/javascript" src="https://web.archive.org/web/20130702194455js_/http://jsak.roblox.com/644b0e8baae8d8db3809d69b1924ea60.js"></script>
    <script type="text/javascript">Roblox.config.externalResources = ['/js/jquery/jquery-1.7.2.min.js'];Roblox.config.paths['jQuery'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/29cf397a226a92ca602cb139e9aae7d7.js';Roblox.config.paths['Pagelets.BestFriends'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/c8acaba4214074ed4ad6f8b4a9647038.js';Roblox.config.paths['Pages.Catalog'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/c8f61a230e6ad34193b40758f1499a3d.js';Roblox.config.paths['Pages.Messages'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/b84022adb990981fb0bd838cda0f67d5.js';Roblox.config.paths['Resources.Messages'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/fb9cb43a34372a004b06425a1c69c9c4.js';Roblox.config.paths['Widgets.AvatarImage'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/b7f418a5fefacfd21f2c86b495b4698f.js';Roblox.config.paths['Widgets.DropdownMenu'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/d83d02dd89808934b125fa21c362bcb9.js';Roblox.config.paths['Widgets.GroupImage'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/3e692c7b60e1e28ce639184f793fdda9.js';Roblox.config.paths['Widgets.HierarchicalDropdown'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/e8b579b8e31f8e7722a5d10900191fe7.js';Roblox.config.paths['Widgets.ItemImage'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/facde7fc56e53e1ef9ee75203bc76bb4.js';Roblox.config.paths['Widgets.PlaceImage'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/08e1942c5b0ef78773b03f02bffec494.js';Roblox.config.paths['Widgets.Suggestions'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/a63d457706dfbc230cf66a9674a1ca8b.js';Roblox.config.paths['Widgets.SurveyModal'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/d6e979598c460090eafb6d38231159f6.js';</script>
        <script type="text/javascript">
            function editTemplateInStudio(play_placeId) { RobloxLaunch._GoogleAnalyticsCallback = function() { var isInsideRobloxIDE = 'website'; if (Roblox && Roblox.Client && Roblox.Client.isIDE && Roblox.Client.isIDE()) { isInsideRobloxIDE = 'Studio'; };GoogleAnalyticsEvents.FireEvent(['Edit Location', 'Guest', isInsideRobloxIDE]);GoogleAnalyticsEvents.FireEvent(['Edit', 'Guest', '']); };  Roblox.Client.WaitForRoblox(function() { RobloxLaunch.StartGame('https://web.archive.org/web/20130702194455/http://www.roblox.com//Game/edit.ashx?PlaceID='+play_placeId+'&upload=', 'edit.ashx', 'https://web.archive.org/web/20130702194455/https://www.roblox.com//Login/Negotiate.ashx', 'FETCH', true); }); }
        </script>
@endsection
@section('content')
@guest
<p>Please <a href="{{ route('login') }}">Log In</a> to continue.</p>
@else
<div class="container">
    <div class="main">
        <div id="TemplatesView" class="welcome-content-area">

            <h2 id="StudioGameTemplates">GAME TEMPLATES</h2>
            <div class="templates" js-data-templatetype="Basic">
                <div class="template" placeid="200">
                    <a href="" class="game-image"><img class=""
                            src="https://web.archive.org/web/20130702194455im_/http://t2ak.roblox.com/362ae9c43957047a0287f9cd2c98646c" /></a>
                </div>
                <div class="template" placeid="201">
                    <a href="" class="game-image"><img class=""
                            src="https://web.archive.org/web/20130702194455im_/http://t7ak.roblox.com/ab99a6e34406eb5e7aebd349c90ce35b" /></a>
                </div>
            </div>
        </div>
        <div id="MyProjectsView" class="welcome-content-area" style="display: none">
            <h2>My Published Projects</h2>
            <div id="AssetList">


                <div>
                    <span>You must be logged in to view your published projects!</span>
                </div>
                <script type="text/javascript">
                $('#MyProjects').click(function() {
                    $('#header-login').addClass('active');
                    $('#iFrameLogin').css('display', 'block');
                });
                </script>
            </div>
        </div>
    </div>
</div>
@endguest
@endsection