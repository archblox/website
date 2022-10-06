@extends('layouts.loggedout')
@section('title')
<title>Login - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Login - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h1>Welcome back!</h1>
<p>Don't have an account? <a href="{{ route('register') }}">Click here</a> to sign up.</p>
<br>
<form method="POST" action="{{ route('login') }}">
    @csrf
    <h3>Username or Email Address</h3>
    <input id="login" type="text" name="login" value="{{ old('login') }}" required autofocus>
    @if ($errors->has('name') || $errors->has('email'))
    <span style="color:red" role="alert">
        <strong>{{ $errors->first('name') ?: $errors->first('email') }}</strong>
    </span>
    @endif
    <h3>Password</h3>
    <input id="password" type="password" name="password" required autocomplete="current-password">
    @error('password')
    <span style="color:red" role="alert">
        <strong>{{ $message }}</strong>
    </span>
    @enderror
    <br>
    <input style="width:5%;margin-bottom:15px;margin-top:15px" type="checkbox" name="remember" id="remember"
        {{ old('remember') ? 'checked' : '' }}>

    <label class="form-check-label" for="remember">
        {{ __('Remember Me') }}
    </label>
    <button type="submit" class="greenbutton" onClick="this.form.submit();this.disabled=true">Login</button>
    @if (Route::has('password.request'))
    <br><br>
    <span class="hyperlink"><a class="btn btn-link" href="{{ route('password.request') }}">
        Forgot your password?
    </a>
    </span>
    @endif
</form>
@endsection