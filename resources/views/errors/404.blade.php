@extends('layouts.loggedout')
@section('title')
<title>404 - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="404 - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h2>404 | Page Not Found <button style="width: fit-content;"  class="greybutton" onclick="window.history.back();">Back</button> </h2>
<p>Aw man, look at what you have done. You've made Luigi mad!</p>
<p>Why don't you go back a page for us before Luigi destroys us all.</p>
<img alt="Angry Luigi" src="{{ asset('img/error.png') }}" width="100%" height="300px">
@endsection