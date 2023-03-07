@extends('layouts.app')
@section('title')
    <title>Friend Requests - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <div class="PageTitleBar">
    <h1 id="usernameframe">Friend Requests</h1>
    <div>
    <a href="{{ route('friends') }}" class="tab">All Friends</a>
    <a href="#" class="tab_selected">Pending Requests ({{ count(Auth::user()->getFriendRequests()) }})</a>
    </div>
    </div>
    <br>
    <div class="content_special" id="FriendsContainer" style="flex-wrap: wrap;">
        @foreach ($userRequests as $userReq)
            @php $user = App\Models\User::find($userReq->sender_id) @endphp
            @if (!empty($user))
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
                    @endif                    @if (Cache::has('is_online_' . $user->id))
                        <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
                    @else
                        <strong id="onlinestatus" class="onlinestatus_offline">Offline - Last Online
                            {{ Carbon\Carbon::parse($user->last_seen)->diffForHumans() }}</strong>
                    @endif
                    </div>
                    <div>
                    <form action="{{ route('friend_handle', $user->id) }}" method="POST">
                        @csrf
                        <button class="greenbutton" name="action" type="submit" value="accept">Accept</button>
                        <button class="redbutton" name="action" type="submit" value="decline">Decline</button>
                    </form>
                    </div>
                </div>
            </div>
            @endif
        @endforeach
        @if (!count($userRequests))
            <p>You have no pending friend requests.</p>
        @endif
    </div>
    <br>
@endsection
