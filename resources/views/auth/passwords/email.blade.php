@extends('layouts.loggedout')
@section('title')
<title>Reset Password - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Reset Password - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h1>Reset Password</h1>
<p>Check your junk folder if you do not receive the email.</p><br>
<form method="POST" action="{{ route('password.email') }}">
    @csrf
    <h3>Email Address</h3>
    <input id="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="email"
        placeholder="Email address..." autofocus>
    @error('email')
    <span class="warningtext" role="alert">
        <br><strong>{{ $message }}</strong>
    </span>
    @enderror
    <br><br>

    <button class="greybutton" type="submit" onClick="this.form.submit();this.disabled=true">
        Send Password Reset Link
    </button>
</form>
@endsection