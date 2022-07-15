@extends('layouts.ide')
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
<h1>My Games</h1>
<button class="greenbutton">Create a Game (disabled)</button>
<p>This page does not have any functionality yet other than logging in.</p>
<p>Please press the New button in order to create a place to host.</p>
@endsection