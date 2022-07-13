@extends('layouts.app')
@section('title')
    <title>Home - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
    <meta content="Home - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection

@section('content')
    <h1 id="usernameframe">Hello, {{ Auth::user()->name }}!</h1>
    <br>
    <div class="content_special">
        <div id="feed">
            <h2>My Feed</h2>
            <br>
            <p style="display: flex;">
                <input id="FeedBox" type="text" placeholder="Say something..." style="width: 80%;">
                <button style="width: 20%;height: 28px;margin-left: 10px;" class="greybutton" id="FeedButton">Post it!</button>
            </p>
            <br>
            <div id="FeedContainer">
                <div class="FeedContainerBox" id="FeedContainerBox1">
                    <div class="FeedContainerBoxImageContainer" id="FeedContainerBox1ImageContainer">
                        <a href="#"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}"
                                width="60px" height="100%"></a>
                    </div>
                    <div class="FeedContainerBoxTextContainer" id="FeedContainerBox1TextContainer">
                        <a href="#" id="FeedContainerBox1Username">Placeholder</a>
                        <p id="FeedContainerBox1Text">"This is a placeholder for future My Feed posts."</p>
                        <p id="FeedContainerBox1Timestamp">July 13, 2022 01:42 AM</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="gamesframe">
            <div class="content_special" style="justify-content: center;">
                <h2>Friends ({{ Auth::user()->getFriendsCount() }})</h2>
                @if (Auth::user()->getFriendsCount() > 0)
                    <a href="{{ route('friends') }}" style="margin-left: 5px"> <button class="bluebutton"
                            style="margin-top: 5px">View
                            All</button></a>
                @endif
            </div>
            <br>
            <br>
            <div class="friendslist">
                @if (Auth::user()->getFriendsCount() > 0)
                    <div id="profilefriendcontainer" class="content_special"
                        style="flex-wrap: nowrap;justify-content: space-evenly;flex-direction: row;display: inline-flex;align-content: center;align-items: center;">
                        @foreach ($friends as $friend)
                            <div class="profilefriend">
                                <a href="{{ route('profile', $friend->id) }}"><img alt="Profile Image"
                                        src="{{ asset('img/iosload.gif') }}" width="150px" height="110px"></a>
                                <br>
                                <a href="{{ route('profile', $friend->id) }}"
                                    id="FeedContainerBox1Username">{{ $friend->name }}</a>
                            </div>
                        @endforeach
                    </div>
            </div>
        @else
            <p>You don't have any friends yet!</p>
        @endif
            <br>
            <h2>Recently Played</h2>
            <br>
            <div class="gamelist">
                <p>You haven't played any games yet!</p>
            </div>
            <br>
        </div>
    </div>
    <br>
@endsection
