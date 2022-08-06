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
<p style="color: #ffffff">Impaitient? <a href="https://discord.gg/nudzQ7hkWY">Join our Discord Server</a> for status
    updates.</p>
<br>
<br>
<p><button class="bluebutton">A</button><button class="bluebutton">R</button><button class="bluebutton">C</button><button class="bluebutton">H</button><button class="bluebutton">B</button><button class="bluebutton">L</button><button class="bluebutton">O</button><button class="bluebutton">X</button></p>
@endsection