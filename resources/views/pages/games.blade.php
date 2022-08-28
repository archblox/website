@extends('layouts.app')
@section('title')
    <title>Games - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
    <meta content="Games - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection

@section('content')
<h1>Games</h1>
<br>
<p>Note that this page does not support joining yet. If you would like to join your own game that you are currently hosting, <a onclick="openClientPopup('localhost','53640',null,'join')">click here</a>.</p>
<br>
<div class="content_special" style="flex-wrap: wrap; justify-content: space-around;">
    <div id="game1">
        <a href="{{ route('gamespage')}}"><img class="gamethumbnail_small"></a>
        <a href="{{ route('gamespage')}}">Natural Disaster Survival</a> 
        <p>By <a href="{{ route('profile', 1) }}">ARCHBLOX</a></p>
    </div>
</div>
@endsection