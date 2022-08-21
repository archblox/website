@extends('layouts.idenosidebar')
@section('title')
<title>419 - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="419 - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection
@section('content')
<h2>419 | Page Expired</h2>
<p><button style="width: fit-content;"  class="greybutton" onclick="window.history.back();">Back</button></p>
<p>This means that you took too long to enter in information or there is an issue with a form.</p>
<p>If you keep on getting this error, please contact the Developers via Discord or Messages.</p>
@endsection