@extends('layouts.loggedout')
@section('title')
<title>500 - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="500 - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection
@section('contentloggedout')
<h2>500 Internal Server Error</h2>
<p>Please go back and try again. If it still does not work, contact one of the developers.</p>
@endsection