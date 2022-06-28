@extends('layouts.app')
@section('title')
    <title>{{ $data['user']->name }} - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <div id="profiletopcontainer">
        <h1 id="usernameframe">{{ $data['user']->name }}</h1>
        @if (Cache::has('is_online_' . $data['user']->id))
            <p id="onlinestatus" class="onlinestatus_website">Website</p>
        @else
            <p id="onlinestatus" class="onlinestatus_offline">Offline</p>
        @endif
    </div>
    <div id="content_special">
        <div id="profileleftcontainer">
            <p id="status">"I'm new to MORBLOX!"</p>
            <img alt="profile image" src="{{ asset('img/reviewpending.png') }}" width="75%">
            <p id="bio">{{ $data['user']->blurb }}</p>
            <ul></ul>
            <div id="stats">
                <h3>Joined: {{ $data['user']->created_at->format('d/m/Y') }}</h3>
                <p>(day/month/year)</p>
                <h3>Place Visits: 0</h3>
            </div>
            <ul></ul>
            <h2>MORBLOX Badges</h2>
            <div style="white-space:nowrap">
                @foreach ($data['badges'] as $badge)
                    @foreach ($data['user']->badges as $user_badge)
                        @if ($badge->id == $user_badge)
                        <div style="width:120px;display:inline-block">
                            <img src="/img/badges/{{ $badge->id }}.png" width="75px" height="75px" />
                            <h3>{{ $badge->title }}</h3>
                        </div>
                        @endif
                    @endforeach
                @endforeach
            </div>
            <ul></ul>
            <h2>Game Badges</h2>
            <p>This user has not collected any game badges yet!</p>
        </div>
        <div id="profilerightcontainer">
            <h2>Games</h2>
            <p>This user hasn't made any games yet!</p>
            <ul></ul>
            <h2>Friends</h2>
            <p>This user hasn't made friends with anyone!</p>
        </div>
        <ul></ul>
    </div>
@endsection
