@extends('layouts.app')
@section('title')
    <title>Natural Disaster Survival - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
    <meta content="Natural Disaster Survival - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection

@section('alert')
<div class="alert warning visible ontop">Note that this page does not support joining yet. If you would like to play your own game that you are currently hosting, <a style="cursor: pointer;" onclick="openClientPopup('localhost','53640',null,'join')">click here</a>.</a> instead.</div>
@endsection

@section('content')
<div class="content_special" id="gametopcontainer">
    <div class="leftgamecontainer">
        <img class="gamethumbnail_large">
    </div>
    <div class="rightgamecontainer">
        <div>
            <h1>Natural Disaster Survival</h1> 
            <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
        </div>
        <div style="width: 100%;">
            <button onclick="openClientPopup('localhost','53640','temp.rbxl','hostandjoin')" class="greenbutton" style="width: 70%; height: 50px; font-size: x-large; margin-top: 115px; align-content: center;">Host &amp; Play</button>
            <button onclick="openClientPopup(null,'53640','temp.rbxl','host')" class="greenbutton" style="width: 27%;height: 50px;margin-top: 0px;font-size: x-large;align-content: center;">Host</button>
        </div>
    </div>
</div>
<br>
<p>Natural Disaster Survival is a game where you survive disasters.</p>
<br>
<div style="text-align: center;">
    <p><!--Visits: 0  | -->Created: 28/8/2022 | Last updated: 22/10/2022</p>
</div>
@endsection