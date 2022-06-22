@extends('layouts.app')
@section('title')
    <title>{{ $user->name }} - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
<div id="profiletopcontainer">
    <h1 id="usernameframe">{{ $user->name }}</h1>
    <p id="onlinestatus" class="onlinestatus_website">Website</p>
</div>
<div id="content_special">
    <div id="profileleftcontainer">
        <p id="status">"I'm new to MORBLOX!"</p>
        <img alt="profile image" src="{{ asset('img/reviewpending.png') }}" width="75%">
        <p id="bio">{{ $user->blurb }}</p>
        <ul></ul>
        <div id="stats">
            <h3>Joined: {{ $user->created_at->format('d/m/Y') }}</h3>
            <p>(day/month/year)</p>
            <h3>Place Visits: 0</h3>
        </div>
        <ul></ul>
        <h2>MORBLOX Badges</h2>
        <p>This user has not collected any MORBLOX badges yet!</p>
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
