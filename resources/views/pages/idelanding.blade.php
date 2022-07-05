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
<button class="greenbutton">Create a Game</button>
<p>You haven't made any games yet!</p>
@endsection