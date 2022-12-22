@extends('layouts.app')
@section('title')
<title>Home - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Home - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection

@section('content')
<h1 id="usernameframe">Hello, {{ Auth::user()->name }}!</h1>
<br>
<div class="content_special">
    <div id="feed">
        <h2>My Feed</h2>
        <br>
        <form action="{{ route('feed_post') }}" method="POST">
            @csrf
            <p style="display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;;">
                <input id="FeedBox" type="text" name="status" placeholder="What are you up to?" style="width: 80%;"
                    value="{{ old('status') }}">
                <button style="width: 20%;height: 28px;margin-left: 10px;" class="greybutton" id="FeedButton"
                    type="submit" alt="Post it!, Button"
                    onClick="this.form.submit();this.disabled=true;this.innerText='Posting…';">Share</button>
            </p>
            @if ($errors->any())
            <span alt="Error: {{ $errors->first() }}" class="warningtext">{{ $errors->first() }}</span>
            @endif
            @if (session()->has('success'))
            <span style="color:green">{{ session()->get('success') }}</span>
            @endif
        </form>
        <br>
        <div id="FeedContainer">
            @foreach ($posts as $post)
            <div class="FeedContainerBox" id="FeedContainerBox1">
                <div class="FeedContainerBoxImageContainer" id="FeedContainerBox1ImageContainer">
                    <a href="{{ route('profile', $post->user->id) }}"><img alt="A image of {{ $post->user->name }}"
                            src="{{ asset('img/defaultrender.png') }}" width="60px" height="60px"></a>
                </div>
                <div class="FeedContainerBoxTextContainer" id="FeedContainerBox1TextContainer">
                    <a alt="{{ $post->user->name }} says" href="{{ route('profile', $post->user->id) }}"
                        id="FeedContainerBox1Username">{{ $post->user->name }}</a>
                    <p id="FeedContainerBox1Text" style="word-wrap:break-word;max-width:400px">
                        "{{ $post->status }}"</p>
                    @if (!Auth::user()->settings->time_preference_24hr)
                    <p id="FeedContainerBox1Timestamp" alt="">
                        {{ $post->created_at->format('F d, Y h:i A') }}</p>
                    @else
                    <p id="FeedContainerBox1Timestamp" alt="">
                        {{ $post->created_at->format('F d, Y H:i') }}</p>
                    @endif
                </div>
            </div>
            @endforeach
            @if ($posts->isEmpty())
            <p>No news about your friends... want to know what your friends are up to?</p>
            <a href="{{ route('games')}}">make some friends now.</a>
            @endif
        </div>
        {{ $posts->links() }}
    </div>
    <div id="gamesframe">
        <div class="content_special" style="justify-content: center;">
            <h2>Friends ({{ Auth::user()->getFriendsCount() }})</h2>
            @if (Auth::user()->getFriendsCount() > 0)
            <a alt="View All, button" href="{{ route('friends') }}" style="margin-left: 5px"> <button class="bluebutton"
                    style="margin-top: 5px">View
                    All</button></a>
            @endif
        </div>
        <br>
        <div class="friendslist">
            @if (Auth::user()->getFriendsCount() > 0)
            <div id="profilefriendcontainer" class="content_special"
                style="flex-wrap: wrap;justify-content: space-evenly;flex-direction: row;align-content: center;align-items: center;">
                @foreach ($friends as $friend)
                <div class="profilefriend">
                    <a href="{{ route('profile', $friend->id) }}"><img alt="Profile Image"
                            src="{{ asset('img/defaultrender.png') }}" width="150px" height="110px"></a>
                    <br>
                    <a href="{{ route('profile', $friend->id) }}" id="FeedContainerBox1Username">{{ $friend->name }}</a>
                </div>
                @endforeach
            </div>
        </div>
        @else
        <p><a href="{{ route('users')}}">Find your friends</a> on ARCHBLOX</p>
    </div>
    @endif
    <br>
    <h2>Recently Played Games</h2>
    <br>
    <div class="gamelist">
        <p>You haven't played any games recently.</p> <a href="{{ route('games')}}" class="text-link">Play Now</a>
    </div>
</div>
</div>
<br>
@endsection