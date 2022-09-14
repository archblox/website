@extends('layouts.app')
@section('title')
<title>Blog - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Blog - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('content')
<iframe src="https://archblox.blogspot.com" title="ARCHBLOX Blog" style="border:none;" seamless sandbox></iframe>
@endsection