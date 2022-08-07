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
        <div class="content_special" style="flex-wrap: wrap">
            <div class="catalogitem">
                <img src="{{ asset('img/reviewpending.png') }}">
                <p>Item Name</p>
                <p class="arkotlabel">ARK$</p><p> 30</p>
            </div>
        </div>
    @endsection