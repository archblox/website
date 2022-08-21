@extends('layouts.admin')
@section('title')
    <title>
        Admin | Invite Tree - {{ env('APP_NAME') }}</title>
    <style>
        .flex {
            display: block !important;
        }

        #SearchContainer a {
            font-weight: normal !important;
        }
    </style>
@endsection

@section('Body')
    <div id="Body" style="width: 970px;">
        <h2 class="MainHeader">
            Invite Tree
        </h2>
        @if (!request()->has('q'))
            <h5 class="SubHeader">Enter a Username or ID.</h5>
        @elseif (!$user)
            <h5 class="SubHeader text-error">Unable to find user, please check if you entered the correct information.</h5>
        @endif
        <div class="Userlist">
            <form method="GET" action="{{ route('admin_tree') }}">
                <div>
                    <input type="text" id="SearchInput" name="q" placeholder="Search" value="{{ request()->q }}">
                    @if (request()->query('q'))
                        <a href="{{ route('admin_tree') }}" class="SearchCloseBtn">X</a>
                    @endif
                    <button class="btn-neutral btn-small" name="searchBy" value="name" type="submit">Search by
                        Username</button>
                    <button class="btn-neutral btn-small" name="searchBy" value="id" type="submit">Search by
                        ID</button>
                </div>
            </form>
            @if ($user)
            <a class="InvitationUserName AuthenticatedUserName" href="{{ route('profile', $user->id) }}">{{ $user->name }}</a>
            <div class="InvitationSubName">
            <h4 class="InvitationText">Invited By </h4>
            <a href="{{ route('profile', App\Models\User::where('name', $invited_by)->first()->id) }}" class="AuthenticatedUserName">{{ $invited_by }}</a>
            <h5 class="InvitationSubText">{{ $user->name }} Invited</h5>
            @foreach ($children as $child)
            <li>
            <a href="{{ route('profile', $child->id) }}" target="_blank" class="AuthenticatedUserName">{{ $child->name }}</a>
            </li>
            @endforeach
            </div>
            @endif
        </div>
    </div>
@endsection
@section('content')
    <div id="UserList">
        <h2>Invite Tree</h2>
        @if (request()->query('q'))
            <a href="{{ route('admin_tree') }}" style="color:navy">Clear Search</a>
        @endif

        <form method="GET" action="{{ route('admin_tree') }}">
            <div style="margin-top:10px;margin-bottom:10px;"><input type="text" id="q" name="q"
                    placeholder="Search..." value="{{ request()->q }}"><button class="bluebutton" style="margin-left:2px"
                    name="searchBy" value="name">Search by Username</button><button class="bluebutton"
                    style="margin-left:2px" name="searchBy" value="id">Search by ID</button></div>
        </form>
        @if ($user)
            <div id="SearchContainer">
                <h2>User Found: {{ $user->name }}</h2>
                <ul>
                    <li>
                        <h3><a href="{{ route('profile', App\Models\User::where('name', $invited_by)->first()->id) }}"
                                target="_blank">{{ $invited_by }}</a>
                        </h3>
                    </li>
                    <ul>
                        <li><a href="{{ route('profile', $user->id) }}" target="_blank">{{ $user->name }}</a></li>
                        <ul>
                            @foreach ($children as $child)
                                <li><a href="{{ route('profile', $child->id) }}" target="_blank">{{ $child->name }}</a>
                                </li>
                            @endforeach
                        </ul>
                    </ul>
                </ul>
            </div>
        @endif
        @if (!request()->has('q'))
            <h5>Enter a username or ID.</h5>
        @elseif (!$user)
            <h5>No user was found, check if you entered the correct details.</h5>
        @endif
    </div>
@endsection
