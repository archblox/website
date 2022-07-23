@extends('layouts.app')
@section('title')
    <title>Create Message - {{ env('APP_NAME') }}</title>
@endsection

@section('alert')
    @if ($errors->any())
        <div id="alert">{{ $errors->first() }}</div>
    @endif
@endsection

@section('content')
    <h1 id="usernameframe">Create Message</h1>
    <br>
    <form action="{{ route('send_message') }}" method="POST">
        @csrf
        <p>To: <input type="text" name="name" placeholder="Username"
                @if (request()->has('to')) value="{{ request()->to }}" @else value="{{ old('name') }}" @endif></p>
        <p>Subject: <input type="text" name="subject" placeholder="Subject" value="{{ old('subject') }}"></p>
        <textarea style="width: calc(100% - 5px); height: 170px; min-height: 170px; resize: vertical;"
            placeholder="Write your message..." name="message">{{ old('message') }}</textarea>
        <button class="greenbutton" type="submit">Send</button>
        <button class="redbutton" type="reset"><a href="{{ route('inbox') }}"
                style="color:white;font-weight:normal">Cancel</a></button>
    </form>
@endsection
