@extends('layouts.idenosidebar')
@section('title')
<title>{{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="{{env('APP_NAME')}}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="Currently under maintenance." property="og:description" />
@endsection

@section('content')
<h1 style="color: #ffffff">Oh Noes! ARCHBLOX is currently under maintenance.</h1>
<p style="color: #ffffff">ARCHBLOX will be back soon, so please be patient.</p>
<br>
<p style="color: #ffffff">Impatient? <a href="https://discord.gg/nudzQ7hkWY">Join our Discord Server</a> for status updates.</p>
@if (Auth::check() && Auth::user()->isAdmin())
<br>
<p>Since you are an admin, you may access the main site during maintenance.</p>
<strong>Note that some features may be broken during this period.</strong>
<br>
<a href="{{ route('admin_index') }}"><button class="bluebutton">Open Admin Panel</button></a>
<a href="{{ route('home') }}"><button class="greybutton">Open Main Site</button></a>
@endif
@endsection