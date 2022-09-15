@extends('layouts.admin')
@section('title')
    <title>
        Admin | User List - {{ env('APP_NAME') }}
    </title>
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
            <span class="website" title="Online">
            </span>
        @else
            <span class="offline" title="Offline">
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
            <a href="@if (!empty($user->id)) {{ route('profile', $user->id) }} @else # @endif" title="@if (!empty($user->name)) {{ $user->name }}'s profile @else N/A @endif" class="AuthenticatedUserName">
                @if (!empty($user->name)) {{ $user->name }} @else N/A @endif
            </a>
            @unless (request()->query('q'))
            <a href="/admin/users?q=@if (!empty($user->id)) {{ $user->id }}@else N/A @endif&searchBy=id" title="@if (!empty($user->name)) {{ $user->name }}@else N/A @endif's Details" class="AuthenticatedUserName userInfo"></a>
            @endunless
            <a href="/admin/tree?q=@if (!empty($user->id)) {{ $user->id }}@else N/A @endif&searchBy=id" title="@if (!empty($user->name)) {{ $user->name }}@else N/A @endif's Invite Tree" class="forwardArrow AuthenticatedUserName"></a>
        </div>
        @if ($user->settings->changed_name)
        <div class="Row">
            <div class="text-secondary">
                Previus Username:
            </div>
            <div class="text-secondary">
                {{ $user->settings->old_name }}
            </div>
        </div>
        @endif
        <div class="Row">
            <div class="text-secondary">
                ID:
            </div>
            <div class="text-secondary">
                @if (!empty($user->id)) {{ $user->id }}@else N/A @endif
            </div>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Email:
            </div>
            @if ($user->admin)
                <div class="text-secondary hidden-info">[Hidden]</div>
            @else
                @if (!empty($user->email)) {{ $user->email }}@else N/A @endif
            @endif
        </div>
        <div class="Row">
            <div class="text-secondary">
                DOB:
            </div>
            @if ($user->admin)
                <div class="text-secondary hidden-info">[Hidden]</div>
            @else
            @guest
                @if (!empty($user->dob)) <div class="text-secondary">{{ Carbon\Carbon::parse($user->dob)->format('d/m/Y') }}</div> @else N/A @endif
            @else
                @if (!empty($user->dob)) <div class="text-secondary">{{ Carbon\Carbon::parse($user->dob)->format(Auth::user()->settings->date_preference) }}</div> @else N/A @endif
            @endguest
            @endif
        </div>
        <div class="Row">
            <div class="text-secondary">
                Feed Status:
            </div>
            <div class="text-secondary">
                @if (!empty($user->feedposts->last()->status))
                    "{{ $user->feedposts->last()->status }}"
                @else
                    "I'm new to ARCHBLOX!"
                @endif
            </div>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Bio :
            </div>
            <div class="text-secondary">
                @if (!empty($user->blurb)) {!! nl2br(e($user->blurb)) !!} @else N/A @endif
            </div>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Total Friends:
            </div>
            <div class="text-secondary">
                {{ $user->getFriendsCount() }}
            </div>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Mutual Friends:
            </div>
            <div class="text-secondary">
                {{ Auth::user()->getMutualFriendsCount($user) }}
            </div>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Friend Requests:
            </div>
            <div class="text-secondary">
                {{ count(Auth::user()->getFriendRequests()) }}
            </div>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Total Badges:
            </div>
            <div class="text-secondary">
                {{ sizeof($user->badges) }}
            </div>
        </div>
        <div class="Row hidden">
            <div class="text-secondary">
                Place Visits:
            </div>
            <div class="text-secondary">
                TODO
            </div>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Join Date:
            </div>
            <div class="text-secondary">
                @guest
                    @if (!empty($user->created_at))  {{ $user->created_at->format('d/m/Y') }}  @else N/A @endif
                @else
                    @if (!empty($user->created_at))  {{ $user->created_at->format(Auth::user()->settings->date_preference) }}  @else N/A @endif
                @endguest
            </div>
        </div>
        <div class="Row">
            @unless (Cache::has('is_online_' . $user->id))
            <div class="text-secondary">
                Last Seen:
            </div>
            <div class="text-secondary">
                {{ Carbon\Carbon::parse($user->last_seen)->diffForHumans() }}
            </div>
            @endunless
        </div>
        <div class="Row">
            <div class="text-secondary">
                Invited By
            </div>
            <a href="@if (!empty($user->id))   {{ route('profile', App\Models\User::where('id', $user->invited_by)->first()->id) }} @else # @endif" class="AuthenticatedUserName">
                @if (!empty($user->id))   {{ App\Models\User::where('id', $user->invited_by)->first()->name }}  @else N/A @endif
            </a>
            @unless (request()->query('q'))
            <a href="/admin/users?q={{ App\Models\User::where('id', $user->invited_by)->first()->id }}&searchBy=id" title="View {{ App\Models\User::where('id', $user->invited_by)->first()->name }}'s Details" class="AuthenticatedUserName userInfo"></a>
            @endunless
            <a href="/admin/tree?q={{ App\Models\User::where('id', $user->invited_by)->first()->id }}&searchBy=id" title="{{ App\Models\User::where('id', $user->invited_by)->first()->name }}'s Invite Tree" class="forwardArrow AuthenticatedUserName"></a>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Type:
            </div>
            <div class="text-secondary">
                @if ($user->admin)
                    Admin
                @else
                    Member
                @endif
            </div>
        </div>
        <div class="Row">
            <div class="text-secondary">
                Moderation Status:
            </div>
            <div class="text-secondary">
                Normal
            </div>
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
