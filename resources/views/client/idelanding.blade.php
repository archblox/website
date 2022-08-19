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