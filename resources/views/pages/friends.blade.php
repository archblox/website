@extends('layouts.app')
@section('title')
<title>Friends - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Friends - {{env('APP_NAME')}}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection

@section('content')
<h1 id="usernameframe">Friends</h1>
<a href="#" class="tab_selected">All Friends</a>
<a href="#" class="tab">Pending Requests</a>
<br>
<br>
<form method="GET" action="{{ route('users') }}">
    <p><input type="text" id="q" name="q" placeholder="Enter a Username..." value="{{ request()->q }}">
        <button class="greybutton" type="submit">Search</button>
    </p>
</form>
<br>
<div class="content_special" id="FriendsContainer" style="flex-wrap: wrap;">
    <div class="FriendsContainerBox" id="FriendsContainerBox1">
        <div id="FriendsContainerBox1ImageContainer">
            <a href=""><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                    height="100%"></a>
        </div>
        <div id="FriendsContainerBox1TextContainer">
            <a href="" id="FeedContainerBox1Username">BallsGamer123</a>
            <p>"I'm new to ARCHBLOX!"</p>
            <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
            <br>
            <button class="redbutton">Unfriend</button>
        </div>
    </div>
    <div class="FriendsContainerBox" id="FriendsContainerBox1">
        <div id="FriendsContainerBox1ImageContainer">
            <a href=""><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                    height="100%"></a>
        </div>
        <div id="FriendsContainerBox1TextContainer">
            <a href="" id="FeedContainerBox1Username">BallsGamer123</a>
            <p>"I'm new to ARCHBLOX!"</p>
            <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
            <br>
            <button class="redbutton">Unfriend</button>
        </div>
    </div>
    <div class="FriendsContainerBox" id="FriendsContainerBox1">
        <div id="FriendsContainerBox1ImageContainer">
            <a href=""><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                    height="100%"></a>
        </div>
        <div id="FriendsContainerBox1TextContainer">
            <a href="" id="FeedContainerBox1Username">BallsGamer123</a>
            <p>"I'm new to ARCHBLOX!"</p>
            <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
            <br>
            <button class="redbutton">Unfriend</button>
        </div>
    </div>
</div>

<br>
@endsection