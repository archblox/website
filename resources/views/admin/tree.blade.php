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
            <ul class="SearchTree">
                <li class="Menu">
                    <div id="Invitedheader" class="invitedUser">
                        <a title="{{ $invited_by }}'s Invite Tree" href="/admin/tree?q={{ App\Models\User::where('name', $invited_by)->first()->id }}&searchBy=id">
                            <span>{{ $invited_by }}</span>
                        </a>
                        <a href="/admin/users?q={{ App\Models\User::where('name', $invited_by)->first()->id }}&searchBy=id" title="View {{ App\Models\User::where('name', $invited_by)->first()->name }}'s Details" class="userInfo"></a>
                        <a href="{{ route('profile', App\Models\User::where('name', $invited_by)->first()->id) }}" title="{{ $invited_by }}'s Profile" class="forwardArrow"></a>
                    </div>
                    <ul id="DropDown" class="TreeList">
                        <li class="subList">
                            <div id="subusernameBody" class="subUsernameContainer">
                                <a href="{{ route('profile', $user->id) }}" title="{{ $user->name }}'s Profile" class="RedirectArrow">
                                    <span>{{ $user->name }}</span>
                                </a>
                                <a href="/admin/users?q={{ $user->id }}&searchBy=id" title="View {{ $user->name }}'s Details" class="userInfo"></a>
                            </div>
                            <ul class="TreeList">
                            @foreach ($children as $child)
                                <li>
                                    <a href="/admin/tree?q={{ $child->id }}&searchBy=id" title="{{ $child->name }}'s Invite Tree">
                                        <span>{{ $child->name }}</span>
                                    </a>
                                    <a href="/admin/users?q={{ $child->id }}&searchBy=id" title="View {{ $child->name }}'s Details" class="userInfo"></a>
                                    <a href="{{ route('profile', $child->id) }}" title="{{ $child->name }}'s Profile" class="forwardArrow"></a>
                                </li>
                            @endforeach
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
            @endif
        </div>
    </div>
@endsection
