@extends('layouts.app')
@section('title')
    <title>Friends - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <div class="PageTitleBar">
    <h1 id="usernameframe">Friends ({{ Auth::user()->getFriendsCount() }})</h1>
    <div>
    <a href="#" class="tab_selected">All Friends</a>
    <a href="{{ route('requests') }}" class="tab">Pending Requests ({{ count(Auth::user()->getFriendRequests()) }})</a>
    </div>
    </div>
    <br>
    <div class="content_special" id="FriendsContainer" style="flex-wrap: wrap;">
        @foreach ($userFriends as $user)
            <div class="FriendsContainerBox" id="FriendsContainerBox1">
                <div id="FriendsContainerBox1ImageContainer">
                    <a href="{{ route('profile', $user->id) }}"><img alt="Profile Image"
                            src="{{ asset('img/defaultrender.png') }}" width="60px" height="60px"></a>
                </div>
                <div class="content_special" style="justify-content: space-between; align-items: center; padding-right: 5px" id="FriendsContainerBox1TextContainer">
                    <div>
                    <a href="{{ route('profile', $user->id) }}" id="FeedContainerBox1Username">{{ $user->name }}</a>
                    @if (!empty($user->feedposts->last()->status))
                        <p>"{{ $user->feedposts->last()->status }}"</p>
                    @else
                        <p>"I'm new to ARCHBLOX!"</p>
                    @endif
                    @if (Cache::has('is_online_' . $user->id))
                        <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
                    @else
                        <strong id="onlinestatus" class="onlinestatus_offline">Offline - Last Online
                            {{ Carbon\Carbon::parse($user->last_seen)->diffForHumans() }}</strong>
                    @endif
                    </div>
                    <div>
                    <a href="/my/messages/compose?to={{ $user->name }}"><button class="greybutton">Message</button></a>
                    <form action="{{ route('friend_remove', $user->id) }}" method="POST" style="display:inline-block">
                        @csrf
                        <button class="redbutton" type="submit">Unfriend</button>
                    </form>
                    </div>
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
