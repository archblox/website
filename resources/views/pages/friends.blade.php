@extends('layouts.app')
@section('title')
    <title>Friends - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <h1 id="usernameframe">Friends</h1>
    <a href="#" class="tab_selected">All Friends</a>
    <a href="{{ route('requests') }}" class="tab">Pending Requests ({{ count(Auth::user()->getFriendRequests()) }})</a>
    <br>
    <!--
    <form method="GET" action="{{ route('friends') }}">
        <p><input type="text" id="q" name="q" placeholder="Enter a Username..." value="{{ request()->q }}">
            <button class="greybutton" type="submit">Search</button>
        </p>
    </form>-->
    <br>
    <div class="content_special" id="FriendsContainer" style="flex-wrap: wrap;">
        @foreach ($userFriends as $user)
            <div class="FriendsContainerBox" id="FriendsContainerBox1">
                <div id="FriendsContainerBox1ImageContainer">
                    <a href="{{ route('profile', $user->id) }}"><img alt="Profile Image"
                            src="{{ asset('img/iosload.gif') }}" width="60px" height="100%"></a>
                </div>
                <div id="FriendsContainerBox1TextContainer">
                    <a href="{{ route('profile', $user->id) }}" id="FeedContainerBox1Username">{{ $user->name }}</a>
                    <p>"I'm new to ARCHBLOX!"</p>
                    @if (Cache::has('is_online_' . $user->id))
                        <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
                    @else
                        <strong id="onlinestatus" class="onlinestatus_offline">Offline - Last Online
                            {{ Carbon\Carbon::parse($user->last_seen)->diffForHumans() }}</strong>
                    @endif
                    <br>
                    <form action="{{ route('friend_remove', $user->id) }}" method="POST" style="display:inline-block">
                        @csrf
                        <button class="redbutton" type="submit">Unfriend</button>
                    </form>
                </div>
            </div>
        @endforeach
        @if (!count($userFriends))
            <p>You haven't made friends with anyone yet.</p>
        @endif
        {{ $userFriends->links() }}
    </div>
    <br>
@endsection
