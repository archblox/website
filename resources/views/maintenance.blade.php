@extends('layouts.idenosidebar')
@section('title')
<title>{{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="{{env('APP_NAME')}}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX" property="og:description" />
@endsection

@section('content')
<h1 style="color: #ffffff">Oh Noes! ARCHBLOX is currently under maintenance.</h1>
<p style="color: #ffffff">ARCHBLOX will be back as soon as we can fix it.</p>
<br>
<p style="color: #ffffff">Impaitient? <a href="https://discord.gg/nudzQ7hkWY">Join our Discord Server</a> for status
    updates.</p>
<br>
<br>
<p><button class="greybutton">A</button><button class="greybutton">R</button><button class="greybutton">C</button><button class="greybutton">H</button><button class="greybutton">B</button><button class="greybutton">L</button><button class="greybutton">O</button><button class="greybutton">X</button></p>
@endsection