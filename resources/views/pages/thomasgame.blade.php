@extends('layouts.app')
@section('title')
    <title>dummy place - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
    <meta content="dummy place - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection

@section('content')
<div class="content_special" id="gametopcontainer">
    <div class="leftgamecontainer">
        <img style="background-image: url(/img/reviewpending.png);" class="gamethumbnail_large">
    </div>
    <div class="rightgamecontainer">
        <div>
            <h1>dummy place</h1> 
            <p>By <a href="{{ route('profile', 2) }}">Thomas</a></p>    
        </div>
        <div>
            <p>This place requires Radmin VPN.</p>
            <button onclick="openClientPopup('26.220.138.92','53640', null, 'join')" class="greenbutton" style="width: 100%;height: 50px;font-size: x-large;align-content: center;">Play</button>
        </div>
    </div>
</div>
<br>
<p>Test joining place. Will not be open forever.</p>
<br>
<div style="text-align: center;">
    <p><!--Visits: 0  | -->Created: 22/10/2022 | Last updated: 22/10/2022</p>
</div>
@endsection