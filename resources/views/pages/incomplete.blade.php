    @extends('layouts.app')
    @section('title')
        <title>Incomplete Page - {{ env('APP_NAME') }}</title>
    @endsection
    @section('titlediscord')
        <meta content="Incomplete Page - {{ env('APP_NAME') }}" property="og:title" />
    @endsection
    @section('descdiscord')
        <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
    @endsection

    @section('content')
        <h1 id="usernameframe">Incomplete Page</h1>
        <p>This page is not done yet. This page will be made soon, so please be patient.</p>
    @endsection