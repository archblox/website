@extends('layouts.ide')
@section('title')
<title>Start Page</title>
@endsection
@section('titlediscord')
<meta content="Start Page - {{env('APP_NAME')}}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX" property="og:description" />
@endsection

@section('content')
@guest
    <p>Please <a href="{{ route('login') }}">Log In</a> to continue.</p>
@else
    <h1>Welcome, {{ Auth::user()->name }}</h1>
    <!--
    <h1>My Games</h1>
    -->
    <p>You cannot currently upload places or models as the functionality for that has not been added yet.</p>
    <h2>Templates</h2>
    <a href="http://www.morblox.us/Game/edit.ashx?PlaceID=200"><button class="greenbutton">Baseplate</button></a>
    <a href="http://www.morblox.us/Game/edit.ashx?PlaceID=201"><button class="greenbutton">Flat Terrain</button></a>
@endguest     
@endsection