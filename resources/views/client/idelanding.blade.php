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
    <button class="greenbutton">Create a Game (disabled)</button>
    -->
    <p>This page does not have any functionality yet other than logging in.</p>
    <p>Please press the New button in order to create a place to host.</p>
@endguest     
@endsection