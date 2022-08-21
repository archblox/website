@extends('layouts.loggedout')
@section('title')
<title>404 - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="404 - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection
@section('contentloggedout')
<h2>419 Page Expired</h2>
<p>This means that you took too long to enter in information or there is an issue with a form.</p>
<p>Please reload the page. If you keep on getting this error, please contact the Developers via Discord or Messages.</p>
@endsection