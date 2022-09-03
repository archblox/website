@extends('layouts.admin')
@section('title')
    <title>
        Admin | User List - {{ env('APP_NAME') }}</title>
    <style>
        .flex {
            display: block !important;
        }
    </style>
@endsection

@section('Body')
<div id="Body" style="width: 970px;">
<h2 class="MainHeader">
    User List
</h2>
<h5 class="SubHeader Reminder">
    Reminder, don't leak any users' date of birth or email address.
</h5>
<div class="Userlist">
<form method="GET" action="{{ route('admin_users') }}">
<div>
<input type="text" id="SearchInput" name="q" placeholder="Search" value="{{ request()->q }}">
@if (request()->query('q'))
<a href="{{ route('admin_users') }}" class="SearchCloseBtn">X</a>
@endif
<button class="btn-neutral btn-small" name="searchBy" value="name">Search by Username</button>
<button class="btn-neutral btn-small" name="searchBy" value="id">Search by ID</button>
</div>
</form>
<div class="SearchBoard">
@foreach ($users as $user)
<div class="SearchContainer">
    <div class="Thumbnail">
        <div class="UserThumbnail">
        </div>
        <a>
        @if (Cache::has('is_online_' . $user->id))
            <span class="website">
            </span>
        @else
            <span class="offline">
            </span>
        @endif
        </a>
    </div>
    <div class="UserDetails">
        <div class="text-header">
            User Details
        </div>
        <div class="Row">
            <div class="text-secondary">
                Username:
            </div>
            <a href="{{ route('profile', $user->id) }}" class="AuthenticatedUserName">
                {{ $user->name }}
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                ID:
            </div>
            <a class="text-secondary">
                {{ $user->id }}
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Email:
            </div>
            @if ($user->admin)
                <a class="text-secondary">[Redacted]</a>
            @else
                <a class="text-secondary">{{ $user->email }}</a>
            @endif
        </div>
        <div class="Row">
            <div class="text-secondary">
                DOB:
            </div>
            <a class="text-secondary">
                @if ($user->admin)
                    [Redacted]
                @else
                @guest
                {{ Carbon\Carbon::parse($user->dob)->format('d/m/Y') }}
                @else
                {{ Carbon\Carbon::parse($user->dob)->format(Auth::user()->settings->date_preference) }}
                @endguest
                @endif
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Feed Status :
            </div>
            <a class="text-secondary">
                @if (!request()->has('q'))
                    @if (!empty($user->feedposts->last()->status))
                        "{{ $user->feedposts->last()->status }}"
                    @else
                        "I'm new to ARCHBLOX!"
                    @endif
                    @if (!empty(App\Models\FeedPost::where('user_id', $user->id)->first()->status))
                        "{{ App\Models\FeedPost::where('user_id', $user->id)->orderBy('id', 'desc')->first()->status }}"
                    @else
                        "I'm new to ARCHBLOX!"
                    @endif
                @endif
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Bio :
            </div>
            <a class="text-secondary">
                {!! nl2br(e($user->blurb)) !!}
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Total Friends :
            </div>
            <a class="text-secondary">
                {{ $user->getFriendsCount() }}
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Mutual Friends :
            </div>
            <a class="text-secondary">
                {{ Auth::user()->getMutualFriendsCount($user) }}
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Total Badges :
            </div>
            <a class="text-secondary">
                {{ sizeof($user->badges) }}
            </a>
        </div>
        <div class="Row hidden">
            <div class="text-secondary">
                Place Visits :
            </div>
            <a class="text-secondary">
                TODO
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Join Date :
            </div>
            <a class="text-secondary">
                @guest
                    {{ $user->created_at->format('d/m/Y') }}
                @else
                    {{ $user->created_at->format(Auth::user()->settings->date_preference) }}
                @endguest
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Invited By
            </div>
            <a href="{{ route('profile', App\Models\User::where('id', $user->invited_by)->first()->id) }}" class="AuthenticatedUserName">
                {{ App\Models\User::where('id', $user->invited_by)->first()->name }}
            </a>
            <a href="/iphone/tree?q={{ App\Models\User::where('id', $user->invited_by)->first()->id }}&searchBy=id" title="{{ App\Models\User::where('id', $user->invited_by)->first()->name }}'s Invite Tree" class="forwardArrow AuthenticatedUserName"></a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                View
            </div>
            <a href="/iphone/tree?q={{ $user->id }}&searchBy=id" title="View invite tree from {{ $user->name }}" class="AuthenticatedUserName">
                Invite Tree
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Type:
            </div>
            <a class="text-secondary">
                @if ($user->admin)
                    Admin
                @else
                    Member
                @endif
            </a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Moderation Status:
            </div>
            <a class="text-secondary">
                Normal
            </a>
        </div>
    </div>
</div>
@endforeach
@if ($users->isEmpty())
<span class="text-error">
    Unable to find user, please check if you entered the correct information.
</span>
@endif
</div>
</div>
</div>
{{ $users->appends($_GET)->links() }}
@endsection
@section('content')
    <div id="UserList">
        <h2>User List</h2>
        <p>Remember, use your powers for good, not for evil.</p>
        <p>Please do not share a user's birth date or email address without their permission.</p>
        @if (request()->query('q'))
        <a href="{{ route('admin_users') }}" style="color:navy">Clear Search</a>
        @endif

        <form method="GET" action="{{ route('admin_users') }}">
            <div style="margin-top:10px;margin-bottom:10px;"><input type="text" id="q" name="q" placeholder="Search..." value="{{ request()->q }}"><button
                    class="bluebutton" style="margin-left:2px" name="searchBy" value="name">Search by Username</button><button class="bluebutton" style="margin-left:2px" name="searchBy" value="id">Search by ID</button></div>
        </form>
        @foreach ($users as $user)
            <div id="SearchContainer">
                <div class="ProfileContainerBox" id="ProfileContainerBox1" style="background-color: white;">
                    <div id="ProfileContainerBox1ImageContainer">
                        <img alt="Profile Image" src="https://archblox.com/img/defaultrender.png" width="60px"
                            height="100%">
                    </div>
                    <div id="ProfileContainerBox1TextContainer" style="color:black">
                        <p><strong>Username:</strong> {{ $user->name }}</p>
                        @if ($user->admin)
                            <p><strong>E-Mail:</strong> <i>Admin E-Mail Hidden</i></p>
                        @else
                            <p><strong>E-Mail:</strong> {{ $user->email }}</p>
                        @endif
                        <p><strong>ID:</strong> {{ $user->id }}</p>
                        <p><strong>DOB:</strong> {{ Carbon\Carbon::parse($user->dob)->format('d/m/Y') }}</p>
                        <p><strong>Rank:</strong>
                            @if ($user->admin)
                                Admin
                            @else
                                Member
                            @endif
                        </p>
                        <p><strong>Status:</strong> Normal</p>
                        <p><strong>Invited By:</strong> <a style="color:blue"
                                href="{{ route('profile', App\Models\User::where('id', $user->invited_by)->first()->id) }}">{{ App\Models\User::where('id', $user->invited_by)->first()->name }}</a>
                            (ID: {{ App\Models\User::where('id', $user->invited_by)->first()->id }})
                        </p>
                        <!--
                                <button class="greybutton">Check Reports For This User</button>
                                <button class="bluebutton">Edit User Data</button>
                                <button class="bluebutton">Warn/Ban History</button>
                                <button class="redbutton">Warn</button>
                                <button class="redbutton">Ban/Terminate</button>-->
                    </div>
                </div>
            </div>
        @endforeach
        @if ($users->isEmpty())
            <h5>No user was found, check if you entered the correct details.</h5>
        @endif
    </div>
    {{ $users->appends($_GET)->links() }}
@endsection
