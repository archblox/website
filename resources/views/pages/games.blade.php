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
    <div id="alert">Note that this page does not support joining yet. If you would like to play your own game that you are currently hosting, <a style="cursor: pointer;" onclick="openClientPopup('localhost','53640',null,'join')">click here</a>.</div>
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
        <a href="#"><img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_small"></a>
        <br>
        <a href="#">dummy place</a> 
        <p>By <a href="{{ route('profile', 2) }}">Thomas</a></p>
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