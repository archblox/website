@extends('layouts.admin')
@section('title')
    <title>Admin | User List - {{ env('APP_NAME') }}</title>
@endsection

@section('Body')
<div id="Body" style="width: 970px;">
<h2 class="MainHeader">
    User List
</h2>
<h5 class="SubHeader Reminder">
    DO NOT LEAK ANY USER INFORMATION. DOING SO WILL GET YOU BANNED.
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
            <span class="online" title="Online">
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
            @if (!empty($user->id))
            @if (!empty($user->name))
            <a href="{{ route('profile', $user->id) }}" title="{{ $user->name }}'s profile" class="AuthenticatedUserName">
                {{ $user->name }}
            </a>
            @else
            <a title="N/A" class="info-error">
                N/A
            </a>
            @endif
            @unless (request()->query('q'))
            @if (!empty($user->name))
            <a href="/admin/users?q={{ $user->id }}&searchBy=id" title="{{ $user->name }}'s Details" class="AuthenticatedUserName userInfo"></a>
            @else
            <a href="/admin/users?q={{ $user->id }}&searchBy=id" title="N/A" class="AuthenticatedUserName userInfo"></a>
            @endif
            @endunless
            @if (!empty($user->name))
            <a href="/admin/tree?q={{ $user->id }}&searchBy=id" title="{{ $user->name }}'s Invite Tree" class="forwardArrow AuthenticatedUserName"></a>
            @else
            <a href="/admin/tree?q={{ $user->id }}&searchBy=id" title="N/A" class="forwardArrow AuthenticatedUserName"></a>
            @endif
            @else
            <a title="N/A" class="info-error">
                N/A
            </a>
            @endif
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
            @if (!empty($user->id))
            <div class="text-secondary">
                {{ $user->id }}
            </div>
            @else
            <div class="info-error">
                N/A
            </div>
            @endif
        </div>
        <div class="Row">
            <div class="text-secondary">
                Email:
            </div>
            @if ($user->admin)
                <div class="text-secondary info-hidden">[Hidden]</div>
            @else
                @if (!empty($user->email))
                <div class="text-secondary info-email">{{ $user->email }}</div>
                @else
                <div class="text-secondary info-error">N/A</div>
                @endif
            @endif
        </div>
        <div class="Row">
            <div class="text-secondary">
                DOB:
            </div>
            @if ($user->admin)
                <div class="text-secondary info-hidden">[Hidden]</div>
            @else
            @if (!empty($user->dob))
            @guest
                <div class="text-secondary">{{ Carbon\Carbon::parse($user->dob)->format('d/m/Y') }}</div>
            @else
                <div class="text-secondary">{{ Carbon\Carbon::parse($user->dob)->format(Auth::user()->settings->date_preference) }}</div>
            @endguest
            @else
                 <div class="info-error">N/A</div>
            @endif
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
            @if (!empty($user->blurb))
            <div class="text-secondary">
                {!! nl2br(e($user->blurb)) !!}
            </div>
            @else
            <div class="info-error">
                N/A
            </div>
            @endif
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
        <div class="Row">
            <div class="text-secondary">
                Join Date:
            </div>
            @if (!empty($user->created_at))
            <div class="text-secondary">
                @guest
                    {{ $user->created_at->format('d/m/Y') }}
                @else
                    {{ $user->created_at->format(Auth::user()->settings->date_preference) }}
                @endguest
            </div>
            @else
            <div class="info-error">
                N/A
            </div>
            @endif
        </div>
        @unless (Cache::has('is_online_' . $user->id))
        <div class="Row">
            <div class="text-secondary">
                Last Seen:
            </div>
            <div class="text-secondary">
                {{ Carbon\Carbon::parse($user->last_seen)->diffForHumans() }}
            </div>
        </div>
        @endunless
        <div class="Row">
            <div class="text-secondary">
                Invited By
            </div>
            @if (!empty($user->id))
            @if (!empty(App\Models\User::where('id', $user->invited_by)->first()->id))
            <a href="{{ route('profile', App\Models\User::where('id', $user->invited_by)->first()->id) }}" title="{{ App\Models\User::where('id', $user->invited_by)->first()->name }}'s Profile" class="AuthenticatedUserName">
                {{ App\Models\User::where('id', $user->invited_by)->first()->name }}
            </a>
            @unless (request()->query('q'))
            <a href="/admin/users?q={{ App\Models\User::where('id', $user->invited_by)->first()->id }}&searchBy=id" title="View {{ App\Models\User::where('id', $user->invited_by)->first()->name }}'s Details" class="AuthenticatedUserName userInfo"></a>
            @endunless
            <a href="/admin/tree?q={{ App\Models\User::where('id', $user->invited_by)->first()->id }}&searchBy=id" title="{{ App\Models\User::where('id', $user->invited_by)->first()->name }}'s Invite Tree" class="forwardArrow AuthenticatedUserName"></a>
            @else
            <div title="N/A" class="info-error">
                N/A
            </div>
            @endif
            @endif
        </div>
        <div class="Row">
            <div class="text-secondary">
                Type:
            </div>
            <div class="text-secondary">
                @if ($user->admin)
                    Admin
                @else
                    User
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
    Unable to get user information, please make sure the information you provided is correct.
</span>
@endif
</div>
</div>
</div>
{{ $users->appends($_GET)->links() }}
@endsection
@section('AdminPanel')
<div class="NewAdminPanel">
        <nav class="Admin-Navigation">
            <div class="Header">
                <a href="{{ route('home') }}" title="ARCHBLOX Home" class="PanelLogo"></a>
                <span class="SubSlogan" noselect>Admin Panel</span>
               <div class="usernamecontainer">
                    <a class="stext" noselect>Hi </a>
                    <a class="stext clickabletext" href="@guest {{ route('login') }} @else {{ route('profile', Auth::id()) }} @endguest">{{ Auth::user()->name }}</a>
               </div>
            </div>
            <ul class="SubHeader">
                <li class="sub-menu"><a class="menu" href="{{ route('admin_users') }}" active>Users</a></li>
                <li class="sub-menu"><a class="menu" href="{{ route('admin_index') }}">Dashboard</a></li>
                <li class="sub-menu"><a class="menu" href="{{ route('admin_tree') }}">Invites</a></li>
            </ul>
        </nav>
        <div class="AdminContainer">
        </div>
</div>
@endsection