@extends('layouts.app')
@section('title')
    <title>Reset Password - {{ env('APP_NAME') }}</title>
@endsection

@section('alert')
    @if (session('status'))
        <div id="alert"
            style="background:linear-gradient(0deg,#02b757 0%,#118237 49%,#01a64e 50%,#3fc679 95%,#a3e2bd 100%)"
            role="alert">
            {{ session('status') }}
        </div>
    @endif
@endsection

@section('content')
    <h1>Reset Password</h1>
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

        <button type="submit" onClick="this.form.submit();this.disabled=true">
            Send Password Reset Link
        </button>
    </form>
@endsection
