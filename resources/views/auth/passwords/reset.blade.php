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
<p>Passwords must be 8 or more characters, with 1 capital letter, 1 symbol and 1 number.</p><br>
<form method="POST" action="{{ route('password.update') }}">
    @csrf

    <input type="hidden" name="token" value="{{ $token }}">

    <h3>Email Address</h3>
    <input id="email" type="email" name="email" value="{{ $email ?? old('email') }}" required autocomplete="email"
        autofocus>

    @error('email')
    <span class="warningtext" role="alert">
        <br><strong>{{ $message }}</strong>
    </span>
    @enderror

    <h3>New Password</h3>
    <input id="password" type="password" name="password" required autocomplete="new-password"
        placeholder="Enter your new password">

    @error('password')
    <span class="warningtext" role="alert">
        <br><strong>{{ $message }}</strong>
    </span>
    @enderror

    <h3>Confirm New Password</h3>
    <input id="password-confirm" type="password" name="password_confirmation" required autocomplete="new-password"
        placeholder="Confirm your new password">
    <br><br>

    <button type="submit" onClick="this.form.submit();this.disabled=true">
        Reset Password
    </button>
</form>
@endsection