@extends('layouts.app')
@section('title')
    <title>New Message - {{ env('APP_NAME') }}</title>
@endsection

@section('alert')
    @if ($errors->any())
        <div id="alert">{{ $errors->first() }}</div>
    @endif
@endsection

@section('content')
    <div class="PageTitleBar">
    <h1 id="usernameframe">New Message</h1>
    <div>
    <button class="greybutton" type="button" onClick="document.getElementById('message').value = ''" style="margin-top:3px;margin-bottom:3px">Clear Message</button>
    <button class="redbutton" type="reset"><a href="{{ route('inbox') }}" style="color: white; font-weight:normal">Cancel</a></button>
    </div>
    </div>
    <br>
    <form action="{{ route('send_message') }}" method="POST">
        @csrf
        @if (request()->has('replyTo'))
            <p>To: <input style="width: 95%;" type="text" name="name" placeholder="Enter a username..." value="{{ $replyName }}"></p>
            <p>Subject: <input style="width: 91%" type="text" name="subject" placeholder=" " value="{{ $replySubject }}"></p>
            <textarea style="width: calc(100% - 5px); height: 170px; min-height: 170px; resize: vertical;"
                placeholder="Write your message..." id="message" name="message">{{ old('message') ? old('message') : $replyContent }}</textarea>
            <button class="greybutton" type="button" onClick="document.getElementById('message').value = ''" style="margin-top:3px;margin-bottom:3px">Clear Message</button>
            <button class="greenbutton" type="submit">Send</button>
        @else
            <p>To: <input style="width: 95%" type="text" name="name" placeholder="Enter a username..." @if (request()->has('to')) value="{{ request()->to }}" @else value="{{ old('name') }}" @endif></p>
            <p>Subject: <input style="width: 91%" type="text" name="subject" placeholder=" " value="{{ old('subject') }}"></p>
            <textarea style="width: 99%; width: calc(100% - 5px); height: 170px; min-height: 170px; resize: vertical;"
            placeholder="Write your message..." id="message" name="message">{{ old('message') }}</textarea>
            <button class="greenbutton" type="submit">Send</button>
        @endif
    </form>
@endsection
