@extends('layouts.loggedout')
@section('title')
<title>{{ env('APP_NAME') }} - We're Still Morbin!</title>
@endsection
@section('titlediscord')
<meta content="{{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection
@section('contentloggedout')
<h1>Welcome to ARCHBLOX!</h1>
<p>ARCHBLOX is a Work-In-Progress revival.</p>
<br>
<p><a alt="Log In button" href="{{ route('login') }}">Log In</a> | <a alt="Sign Up button" href="{{ route('register') }}">Sign Up</a></p>
<br>
<a href="https://discord.gg/nudzQ7hkWY">Join our Discord!</a>
@endsection