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
        <h1>Catalog</h1>
        <div class="content_special" style="flex-wrap: wrap; justify-content: flex-start">
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Item Name</p>
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
        </div>
    @endsection