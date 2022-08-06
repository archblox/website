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
<h1>Upload Model</h1>
<p>This page is disabled as you cannot currently upload models.</p>
@endsection