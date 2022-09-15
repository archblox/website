@extends('layouts.app')
@section('title')
    <title>{{ $user->name }} - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
    <meta content="{{ $user->name }} - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="'@if (!empty($user->feedposts->last()->status)) {{ $user->feedposts->last()->status }} @else I'm new to ARCHBLOX!@endif'" property="og:description" />
@endsection

@section('content')
    <div class="PageTitleBar" style="align-content: flex-end; align-items: flex-end;">
        <div>
        <h1 id="usernameframe">{{ $user->name }}</h1>
        @if ($user->settings->changed_name)
            <h4>Previous Username: {{ $user->settings->old_name }}</h4>
        @endif
        @if (Cache::has('is_online_' . $user->id))
            <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
        @else
            <strong id="onlinestatus" class="onlinestatus_offline">Offline - Last Online
                {{ Carbon\Carbon::parse($user->last_seen)->diffForHumans() }}</strong>
        @endif
        </div>
        <div>
        @if (!Auth::guest() && Auth::id() != $user->id)
            @if (Auth::user()->hasSentFriendRequestTo($user))
                <button class="bluebutton" type="submit" disabled>Pending...</button>
            @elseif (Auth::user()->hasFriendRequestFrom($user))
                <form action="{{ route('friend_handle', $user->id) }}" method="POST">
                    @csrf
                    <button class="greenbutton" name="action" type="submit" value="accept">Accept</button>
                    <button class="redbutton" name="action" type="submit" value="decline">Decline</button>
                </form>
            @elseif (Auth::user()->isFriendWith($user))
                <form action="{{ route('friend_remove', $user->id) }}" method="POST" style="display:inline-block">
                    @csrf
                    <button class="redbutton" type="submit">Unfriend</button>
                </form>
            @else
                <form action="{{ route('friend_add', $user->id) }}" method="POST" style="display:inline-block">
                    @csrf
                    <button class="bluebutton" type="submit">Add Friend</button>
                </form>
            @endif
            @switch($user->settings->message_preference)
                @case(2)
                    <a href="/my/messages/compose?to={{ $user->name }}"><button class="greybutton" type="button">Message</button></a>
                    @break
                @case(1)
                    @if (Auth::user()->isFriendWith($user))
                        <a href="/my/messages/compose?to={{ $user->name }}"><button class="greybutton">Message</button></a>
                    @else
                        <a href="#"><button class="greybutton" disabled>Message</button></a>
                    @endif
                    @break
                @default
                    <a href="#"><button class="greybutton" disabled>Message</button></a>
            @endswitch
        @endif
        </div>
    </div>
    <br>
    <div class="content_special">
        <div id="profileleftcontainer">
            @if (!empty($user->feedposts->last()->status))
                <address id="status" style="word-wrap:break-word">"{{ $user->feedposts->last()->status }}"
                </address>
            @else
                <address id="status">"I'm new to ARCHBLOX!"</address>
            @endif
            <img alt="profile image" src="{{ asset('img/defaultrender.png') }}" width="75%">
            <div id="bio"
                style="min-width:350px;max-width:350px;text-align:center;margin:0 auto;max-height:275px;overflow-y: auto;">
                {!! nl2br(e($user->blurb)) !!}</div>
            <br>
            <div id="stats">
                @guest
                    <h3>Joined: {{ $user->created_at->format('d/m/Y') }}</h3>
                @else
                    <h3>Joined: {{ $user->created_at->format(Auth::user()->settings->date_preference) }}</h3>
                @endguest
                <h3>Place Visits: 0</h3>
            </div>
            <br>
            <h2>ARCHBLOX Badges</h2>
            <div class="badges">
                @foreach ($badges as $badge)
                    @foreach ($user->badges as $user_badge)
                        @if ($badge->id == $user_badge)
                            <div class="badgecontainer">
                                <img alt="{{ $badge->description }}" src="/img/badges/{{ $badge->id }}.png" width="75px" height="75px" />
                                <h4>{{ $badge->title }}</h4>
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
                <!--<a href="route('incomplete')" style="margin-left: 5px"> <button class="bluebutton"
                        style="margin-top: 5px">View
                        All</button></a>-->
            </div>
            <p>This user hasn't made any games yet!</p>
            <br>
            <div class="content_special" style="justify-content: center;">
                <h2>Friends ({{ $user->getFriendsCount() }})</h2>
                @if ($user->getFriendsCount() > 0)
                    <a href="{{ route('profile_friends', $user->id) }}" style="margin-left: 5px"> <button
                            class="bluebutton" style="margin-top: 5px">View All</button></a>
            </div>
            @if (Auth::check() && Auth::id() != $user->id && Auth::user()->getMutualFriendsCount($user) > 0)
                <a href="{{ route('mutual_friends', $user->id) }}"
                    style="color:blue;font-size:12px">{{ Auth::user()->getMutualFriendsCount($user) }} Mutual
                    Friends</a>
            @endif
            <div id="profilefriendcontainer" class="content_special"
                style="flex-wrap: wrap;justify-content: space-evenly;flex-direction: row;display: inline-flex;align-content: center;align-items: center;">
                @foreach ($friends as $friend)
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
