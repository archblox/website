@extends('layouts.app')
@section('title')
    <title>Users - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Users - {{env('APP_NAME')}}" property="og:title" />
@endsection

@section('content')
    @if (request()->query('q'))
        <h1 id="usernameframe">Users -
            {{ DB::table('users')->where('name', 'LIKE', '%' . request()->query('q') . '%')->count() }} found</h1>
        <a href="{{ route('users') }}" style="color:#2260DD">Clear Search</a>
    @else
        <h1 id="usernameframe">Users</h1>
    @endif
    <form method="GET" action="{{ route('users') }}">
        <p><input type="text" id="q" name="q" placeholder="Enter a Username..." value="{{ request()->q }}">
            <button class="greybutton" type="submit">Search</button>
        </p>
    </form>
    <br>
    <div id="SearchContainer">
        @foreach ($users as $user)
            <div class="ProfileContainerBox" id="ProfileContainerBox1">
                <div id="ProfileContainerBox1ImageContainer">
                    <a href="{{ route('profile', $user->id) }}"><img alt="Profile Image"
                            src="{{ asset('img/reviewpending.png') }}" width="60px" height="100%"></a>
                </div>
                <div id="ProfileContainerBox1TextContainer">
                    <a href="{{ route('profile', $user->id) }}" id="FeedContainerBox1Username">{{ $user->name }}</a>
                    <p>"I'm new to ARCHBLOX!"</p>
                    @if (Cache::has('is_online_' . $user->id))
                        <strong id="onlinestatus" class="onlinestatus_website">Website</strong>
                    @else
                        <strong id="onlinestatus" class="onlinestatus_offline">Offline - Last Online {{ Carbon\Carbon::parse($user->last_seen)->diffForHumans() }}</strong>
                    @endif
                </div>
            </div>
        @endforeach
    </div>
    <br>
    {{ $users->appends($_GET)->links() }}
@endsection
