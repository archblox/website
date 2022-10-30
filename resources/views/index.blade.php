@extends('layouts.loggedout')
@section('title')
<title>{{ env('APP_NAME') }} - It's Archaic!</title>
@endsection
@section('titlediscord')
<meta content="{{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h1>Welcome to ARCHBLOX!</h1>
<p>ARCHBLOX is a Work-In-Progress revival.</p>
<br>
<p><a alt="Sign Up button" href="{{ route('register') }}" >Sign Up</a> or <a alt="Log In button" href="{{ route('login') }}">Login</a></p>
<br>
<span class="hyperlink"><a href="https://discord.gg/nudzQ7hkWY">Join our Discord!</a></span>
@endsection