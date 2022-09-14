@extends('layouts.loggedout')
@section('title')
<title>Terms of Service - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Terms of Service - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h1>Terms of Service</h1>
<p>Welcome to ARCHBLOX! Before playing, you'll need to know the rules to make sure you know what you can and can't do
    here.</p>
<br>
<h2>Our Rules</h2>
<h5>At the end of every rule there is a "()" section containing what the punishment is for breaking that rule.</h5>
<p>&#x2022; Swearing is fine, but please do not say any racial or homophobic slurs. (Ban for few days, Termination)</p>
<p>&#x2022; Do not upload NSFW/NSFL content to ARCHBLOX, or post links to that contents. (Termination)</p>
<p>&#x2022; You must be over the age of 13 to play ARCHBLOX. (Termination)</p>
<p>&#x2022; Don't mini-mod, or pretend to be a ARCHBLOX Developer or Administrator. (Warning, Ban for few days)</p>
<p>&#x2022; Do not scam other users for their ARKOTs. (Ban for few days, Termination)</p>
<p>&#x2022; Do not harass other users. (Ban for few days, Termination)</p>
<p>&#x2022; Do not make accounts for the purpose of breaking rules. (Termination)</p>
<p>&#x2022; Exploiting is NOT allowed, unless you are testing it in your own game. (Termination)</p>
<p>&#x2022; Don't impersonate other users. (Termination)</p>
<p>&#x2022; Don't make accounts named "MORBLOX" or "ARCHBLOX". (Name Change)</p>
<p>&#x2022; Do not ban evade. (Termination)</p>
<p>&#x2022; Don't spam. (Warning, Ban for few days)</p>
<p>&#x2022; Getting banned from the discord server will result in a ban on the site as well.</p>
<br>
<h2>Asset Moderation</h2>
<p>If we believe that any of your assets is breaking the rules, we will remove or change that Asset as required, and
    then take action onto your ARCHBLOX account.</p>
<br>
@endsection