@extends('layouts.app')
@section('title')
    <title>Games - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
    <meta content="Games - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection

@section('alert')
<div style="font-size: 12px;"class="alert warning visible ontop"><b>NOTICE:</b> When playing any old Roblox client, Use a sandbox (like <a href="https://sandboxie-plus.com/downloads/">Sandboxie</a> or <a href="https://learn.microsoft.com/en-us/windows/security/threat-protection/windows-sandbox/windows-sandbox-overview">Windows Sandbox</a>) or a VM (that <b>doesn't</b> have host disk access). Old Roblox clients are known to have security vunerabilities, so run them at your own risk.</div>
@endsection

@section('content')
<div class="PageTitleBar">
    <h1>Games</h1>
    <div>
        <input type="text" placeholder="Search" title="Search Catalog Items Box">
        <button style="height: 22px;" class="greybutton">Search</button>
    </div>
</div>
<div class="content_special">
    <div class="content_special" style="width: 15%;flex-wrap: wrap; justify-content: flex-start">
        <p>Sidebar</p>
    </div>
<div class="content_special" style="width: 85%;flex-wrap: wrap; justify-content: flex-start">
    <div class="gameitem">
        <a href="{{ route('gamepage')}}"><img class="gamethumbnail_small"></a>
        <br>
        <a href="{{ route('gamepage')}}">Natural Disaster Survival</a> 
        <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
    </div>
    <div class="gameitem">
        <a href="{{ route('thomasgame')}}"><img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_small"></a>
        <br>
        <a href="#">dummy place</a> 
        <p>By <a href="{{ route('thomasgame')}}">Thomas</a></p>
    </div>
    <div class="gameitem">
        <a href="#"><img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_small"></a>
        <br>
        <a href="#">PLACEHOLDER</a> 
        <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
    </div>
    <div class="gameitem">
        <a href="#"><img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_small"></a>
        <br>
        <a href="#">PLACEHOLDER</a> 
        <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
    </div>
    <div class="gameitem">
        <a href="#"><img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_small"></a>
        <br>
        <a href="#">PLACEHOLDER</a> 
        <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
    </div>
    <div class="gameitem">
        <a href="#"><img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_small"></a>
        <br>
        <a href="#">PLACEHOLDER</a> 
        <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
    </div>
    <div class="gameitem">
        <a href="#"><img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_small"></a>
        <br>
        <a href="#">PLACEHOLDER</a> 
        <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
    </div>
    <div class="gameitem">
        <a href="#"><img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_small"></a>
        <br>
        <a href="#">PLACEHOLDER</a> 
        <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
    </div>
</div>
</div>
@endsection