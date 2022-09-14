@extends('layouts.loggedout')
@section('title')
<title>{{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="{{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<p class="warningtext">Your account isn't actually terminated. This is just a test page.</p>
<br>
<h1>Account Deleted</h1> <!-- Ban Type Goes here (Warning, [day number] Day Ban, Account Deleted, Account Disabled) -->
<p><strong>Action taken on:</strong> 01/01/1970 12:00 AM</p> <!-- Timestamp -->
<p><strong>Reason:</strong> liking the iphone 6</p> <!-- Reason -->
<p><strong>Moderator Note:</strong> i like men</p> <!-- Moderator Note -->
<p>If you would like to appeal, please <a href="https://discord.gg/nudzQ7hkWY">join our discord server.</a></p>
<!-- If not banned from the server -->
<!-- <p>You are unable to appeal your ban.</p> -->
<!-- If banned from the server -->
<!-- <p>To reactivate your account, click the button below.</p> -->
<!-- If account is disabled only -->
<p>Your account will be fully deleted in 3 months.</p>
<!-- If account is disabled/terminated only, show time remaining. -->
<!-- <a><button class="greybutton">Reactivate Account</button></a> -->
<!-- Show this button once the ban time period is over, the account is disabled or it is a warn -->
<a href="{{ route('logout') }}"
    onclick="event.preventDefault(); document.getElementById('logout-form').submit();"><button class="redbutton">Log
        out</button></a>
<!-- Show this button only if the account is terminated, or is currently in the ban time period.  -->
@endsection