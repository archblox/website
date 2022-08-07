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
<a alt="Log In button" href="{{ route('login') }}">Log In</a>
<a alt="Sign Up button" href="{{ route('register') }}">Sign Up</a>
<br>
<p id="ARCHBLOX" class="invisible">Want to check out the published site? <a href="https://archblox.com">Click
        here!</a></p>
<p id="discord">Also, <a href="https://discord.gg/nudzQ7hkWY">Join our Discord!</a></p>
<br>
<br>
<h3>User Count</h3>
<p>There are <strong>{{ App\Models\User::count() }}</strong> users registered</p>
@endsection