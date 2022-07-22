@extends('layouts.app')
@section('title')
    <title>{{ $data['user']->name }} - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
    <meta content="{{ $data['user']->name }} - {{ env('APP_NAME') }}" property="og:title" />
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
        @if (!Auth::guest() && Auth::id() != $data['user']->id)
            @if (Auth::user()->hasSentFriendRequestTo($data['user']))
                <button class="bluebutton" type="submit" disabled>Pending...</button>
            @elseif (Auth::user()->hasFriendRequestFrom($data['user']))
                <form action="{{ route('friend_handle', $data['user']->id) }}" method="POST">
                    @csrf
                    <button class="greenbutton" name="action" type="submit" value="accept">Accept</button>
                    <button class="redbutton" name="action" type="submit" value="decline">Decline</button>
                </form>
            @elseif (Auth::user()->isFriendWith($data['user']))
                <form action="{{ route('friend_remove', $data['user']->id) }}" method="POST"
                    style="display:inline-block">
                    @csrf
                    <button class="redbutton" type="submit">Unfriend</button>
                </form>
            @else
                <form action="{{ route('friend_add', $data['user']->id) }}" method="POST" style="display:inline-block">
                    @csrf
                    <button class="bluebutton" type="submit">Add Friend</button>
                </form>
            @endif
            <a href="#"><button class="greybutton">Message</button></a>
        @endif
    </div>
    <div class="content_special">
        <div id="profileleftcontainer">
            @if (!empty($data['user']->feedposts->last()->status))
                <address id="status" style="word-wrap:break-word">"{{ $data['user']->feedposts->last()->status }}"
                </address>
            @else
                <address id="status">"I'm new to ARCHBLOX!"</address>
            @endif
            <img alt="profile image" src="{{ asset('img/defaultrender.png') }}" width="75%">
            <div id="bio"
                style="min-width:350px;max-width:350px;text-align:center;margin:0 auto;max-height:275px;overflow-y: auto;">
                {!! nl2br(e($data['user']->blurb)) !!}</div>
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
                <a href="{{ route('incomplete') }}" style="margin-left: 5px"> <button class="bluebutton" style="margin-top: 5px">View
                        All</button></a>
            </div>
            <p>This user hasn't made any games yet!</p>
            <br>
            <div class="content_special" style="justify-content: center;">
                <h2>Friends ({{ $data['user']->getFriendsCount() }})</h2>
                @if ($data['user']->getFriendsCount() > 0)
                    <a href="{{ route('profile_friends', $data['user']->id) }}" style="margin-left: 5px"> <button
                            class="bluebutton" style="margin-top: 5px">View All</button></a>
            </div>
            @if (Auth::check() && Auth::id() != $data['user']->id && Auth::user()->getMutualFriendsCount($data['user']) > 0)
            <a href="{{ route('mutual_friends', $data['user']->id) }}" style="color:blue;font-size:12px">{{ Auth::user()->getMutualFriendsCount($data['user'])}} Mutual Friends</a>
            @endif
            <div id="profilefriendcontainer" class="content_special"
                style="flex-wrap: wrap;justify-content: space-evenly;flex-direction: row;display: inline-flex;align-content: center;align-items: center;">
                @foreach ($data['friends'] as $friend)
                    <div class="profilefriend">
                        <a href="{{ route('profile', $friend->id) }}"><img alt="Profile Image"
                                src="{{ asset('img/defaultrender.png') }}" width="150px" height="110px"></a>
                        <br>
                        <a href="{{ route('profile', $friend->id) }}"
                            id="FeedContainerBox1Username">{{ $friend->name }}</a>
                    </div>
                @endforeach
            </div>
        @else
        </div>
        <p>This user hasn't made friends with anyone!</p>
        @endif
    </div>
    </div>
    <br>
@endsection
