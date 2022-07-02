@extends('layouts.app')
@section('title')
<title>{{ $data['user']->name }} - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="{{ $data['user']->name }} - {{env('APP_NAME')}}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="{{ $data['user']->blurb }} | ARCHBLOX is a work in progress revival." property="og:description" />
@endsection

@section('content')
<div id="profiletopcontainer">
    <h1 id="usernameframe">{{ $data['user']->name }}</h1>
    @if (Cache::has('is_online_' . $data['user']->id))
    <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
    @else
    <strong id="onlinestatus" class="onlinestatus_offline">Offline - Last Online
        {{ Carbon\Carbon::parse($data['user']->last_seen)->diffForHumans() }}</strong>
    @endif
    <br>
    <a href="#"><button class="bluebutton">Add Friend</button></a>
    <a href="#"><button class="greybutton">Message</button></a>
</div>
<div class="content_special">
    <div id="profileleftcontainer">
        <p id="status">"I'm new to ARCHBLOX!"</p>
        <img alt="profile image" src="{{ asset('img/reviewpending.png') }}" width="75%">
        <p id="bio">{{ $data['user']->blurb }}</p>
        <br>
        <div id="stats">
            <h3>Joined: {{ $data['user']->created_at->format('d/m/Y') }}</h3>
            <h3>Place Visits: 0</h3>
        </div>
        <br>
        <h2>Role</h2>
        <div style="white-space:nowrap">
            @foreach ($data['badges'] as $badge)
            @foreach ($data['user']->badges as $user_badge)
            @if ($badge->id == $user_badge)
            <div style="width:120px;display:inline-block">
                <img src="/img/badges/{{ $badge->id }}.png" width="75px" height="75px" />
                <h3>{{ $badge->title }}</h3>
            </div>
            @endif
            @endforeach
            @endforeach
        </div>
        <br>
        <h2>Badges</h2>
        <p>This user has not collected any badges yet!</p>
    </div>
    <div id="profilerightcontainer">
        <div class="content_special" style="justify-content: center;">
            <h2>Games </h2>
            <a href="#" style="margin-left: 5px"> <button class="bluebutton" style="margin-top: 5px">View
                    All</button></a>
        </div>
        <p>This user hasn't made any games yet!</p>
        <br>
        <div class="content_special" style="justify-content: center;">
            <h2>Friends (1337)</h2>
            <a href="{{ route('friends') }}" style="margin-left: 5px"> <button class="bluebutton"
                    style="margin-top: 5px">View All</button></a>
        </div>
        <div id="profilefriendcontainer" class="content_special" style="flex-wrap: wrap; justify-content: center; flex-direction: row;">
            <div class="profilefriend">
            <a href="#"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="20%" height="100%"></a>
            <br>
            <a href="#" id="FeedContainerBox1Username">BallsGamer123</a>
            </div>
            <div class="profilefriend">
            <a href="#"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="20%" height="100%"></a>
            <br>
            <a href="#" id="FeedContainerBox1Username">BallsGamer123</a>
            </div>
            <div class="profilefriend">
            <a href="#"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="20%" height="100%"></a>
            <br>
            <a href="#" id="FeedContainerBox1Username">BallsGamer123</a>
            </div>  
        </div>
        <p>This user hasn't made friends with anyone!</p>
    </div>
</div>
<br>
@endsection