@extends('layouts.loggedout')
@section('title')
<title>429 - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="429 - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h2>429 | Too Many Requests <button style="width: fit-content;"  class="greybutton" onclick="window.history.back();">Back</button></h2>
<p>You've tried to do something too many times. Please try again in a few minutes.</p>
@endsection