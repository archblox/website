    @extends('layouts.app')
    @section('title')
        <title>Incomplete Page - {{ env('APP_NAME') }}</title>
    @endsection
    @section('titlediscord')
        <meta content="Incomplete Page - {{ env('APP_NAME') }}" property="og:title" />
    @endsection
    @section('descdiscord')
        <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
    @endsection

    @section('content')
        <h1 id="usernameframe">Incomplete Page</h1>
        <br>
        <p>This page is not done yet. This page will be made soon, so please be patient.</p>
        <p>Looking for the download links for the client/studio? <a href="{{ route('download') }}">Click here</a>.</p>
    @endsection