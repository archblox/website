    @extends('layouts.app')
    @section('title')
        <title>Catalog - {{ env('APP_NAME') }}</title>
    @endsection
    @section('titlediscord')
        <meta content="Catalog - {{ env('APP_NAME') }}" property="og:title" />
    @endsection
    @section('descdiscord')
        <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
    @endsection

    @section('content')
        <h1 id="usernameframe">Catalog</h1>
        <p>currently being worked on..</p>
    @endsection