@extends('layouts.app')
@section('title')
    <title>Friend Requests - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <h1 id="usernameframe">Friends</h1>
    <a href="{{ route('friends') }}" class="tab">All Friends</a>
    <a href="#" class="tab_selected">Pending Requests ({{ count(Auth::user()->getFriendRequests()) }})</a>
    <br>
    <br>
    <div class="content_special" id="FriendsContainer" style="flex-wrap: wrap;">
        @foreach ($userRequests as $userReq)
            @php $user = App\Models\User::find($userReq->sender_id) @endphp
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
                    <form action="{{ route('friend_handle', $user->id) }}" method="POST">
                        @csrf
                        <button class="greenbutton" name="action" type="submit" value="accept">Accept</button>
                        <button class="redbutton" name="action" type="submit" value="decline">Decline</button>
                    </form>
                </div>
            </div>
        @endforeach
        @if (!count($userRequests))
            <p>You have no pending friend requests.</p>
        @endif
    </div>
    <br>
@endsection
