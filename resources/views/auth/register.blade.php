@extends('layouts.loggedout')
@section('title')
<title>Register - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Register - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h1>Welcome to ARCHBLOX!</h1>
<p>Have an account already? <a href="{{ route('login') }}">Click here</a> to log in.</p>
<br>
<p>Before entering anything, please read the <a href="{{ route('privacy') }}">Privacy Policy</a> and the <a
        href="{{ route('tos') }}">Terms of Service</a>.</p>
<br>
<form method="POST" action="{{ route('register') }}">
    @csrf
    <h3>Username</h3>
    <input id="name" type="text" placeholder="Enter a username!" name="name" value="{{ old('name') }}" required
        autocomplete="name" autofocus>
    <p>Usernames must be 3-20 characters, and must not break the rules.</p>
    @error('name')
    <div class="invalid-feedback" style="color:red">
        <strong>{{ $message }}</strong>
    </div>
    @enderror
    <br>
    <h3>E-Mail Address</h3>
    <input id="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="email">
    @error('email')
    <div class="invalid-feedback" style="color:red">
        <strong>{{ $message }}</strong>
    </div>
    @enderror
    <h3>Confirm E-Mail Address</h3>
    <input id="email-confirm" type="email" name="email_confirmation" value="{{ old('email_confirmation') }}" required
        autocomplete="email">
    @error('email_confirmation')
    <div class="invalid-feedback" style="color:red">
        <strong>{{ $message }}</strong>
    </div>
    @enderror
    <br>
    <h3>Date of Birth</h3>
    <input id="dob" type="date" name="dob" value="{{ old('dob') }}" required>
    @error('dob')
    <div class="invalid-feedback" style="color:red">
        <strong>{{ $message }}</strong>
    </div>
    @enderror
    <br>
    <h3>Password</h3>
    <input id="password" type="password" name="password" required autocomplete="password">
    <p class="helpfultip">Don't reuse or use weak passwords!</p>
    <p>Recommend to be 8 or more characters, with atleast 1 capital letter, 1 symbol and 1 number.</p>
    @error('password')
    <div class="invalid-feedback" style="color:red">
        <strong>{{ $message }}</strong>
    </div>
    @enderror
    <br>
    <h3>Invite Key</h3>
    <input id="key" type="text" name="key" placeholder="Invite Key" value="{{ old('key') }}" required>
    @error('key')
    <div class="invalid-feedback" style="color:red">
        <strong>Incorrect invite key.</strong>
    </div>
    @enderror
    <p>An Invite Key is required to sign up. You can obtain one from a person that has played ARCHBLOX.</p>
    <p>Don't beg for keys.</p>
    <br>
    <button class="greenbutton" onClick="this.form.submit();this.disabled=true">Signup</button>

    @endsection