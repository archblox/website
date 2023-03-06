@extends('layouts.loggedout')
@section('title')
<title>405 - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="405 - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('extras')
<script src="{{ asset('js/403.js') }}"></script>
@endsection
@section('contentloggedout')
<h2>405 | Method Not Allowed <button style="width: fit-content;"  class="redbutton" onclick="alert('Do not attempt to leave.'); remove(this);">FUCK GO BACK</button></h2>
<p>What have you done.</p>
<p>Luigi: YOU CANNOT ESCAPE. YOU WILL BE DESTROYED IN <span id="timeElement">5</span></p>
<img alt="Angry Luigi" src="{{ asset('img/error.png') }}" width="100%" height="300px">
@endsection