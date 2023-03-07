@extends('layouts.loggedout')
@section('title')
<title>500 - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="500 - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h2>500 | Internal Server Error <button style="width: fit-content;"  class="greybutton" onclick="window.history.back();">Back</button></h2>
<p>Please go back and try again. If it still does not work, contact one of the developers.</p>
@auth
<br />
<p>Please report this error with your USERID: {{ Auth::id() }}</p>
@endauth
@endsection