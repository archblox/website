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
        @if ($data['user'])
            <div id="SearchContainer">
                <ul>
                    <li>
                        <h3><a
                                href="{{ route('profile', App\Models\User::where('name', $data['invited_by'])->first()->id) }}">{{ $data['invited_by'] }}</a>
                        </h3>
                    </li>
                    <ul>
                        <li><a href="{{ route('profile', $data['user']->id) }}">{{ $data['user']->name }}</a></li>
                        <ul>
                            @foreach ($data['children'] as $child)
                                <li><a href="{{ route('profile', $child->id) }}">{{ $child->name }}</a></li>
                            @endforeach
                        </ul>
                    </ul>
                </ul>
            </div>
        @endif
        @if (!request()->has('q'))
            <h5>Enter a username or ID.</h5>
        @elseif (!$data['user'])
            <h5>No user was found, check if you entered the correct details.</h5>
        @endif
    </div>
@endsection
