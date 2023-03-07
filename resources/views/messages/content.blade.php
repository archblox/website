@extends('layouts.app')
@section('title')
    <title>{{ $message->subject }} - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
<div class="PageTitleBar">
    <div>
        <h2>{{ $message->subject }}</h2>
            @if ($message->sendto_id != Auth::id())
            <h3>To: {{ App\Models\User::where('id', $message->sendto_id)->first()->name }}</h3>
        @else
            <h3>From: {{ $message->user->name }}</h3>
        @endif
        </div>
    <div>
    <button type="button" class="greybutton" onclick="window.location=document.referrer;">Back</button>
    @if ($message->sendto_id == Auth::id())
    <button type="button" class="greybutton" onclick="window.location='/my/messages/compose?replyTo={{ $message->id }}'">Reply</button>
    @endif
    @if (Auth::id() != $message->user_id)
    <form action="{{ route('delete_message', $message->id) }}" method="post" style="display:inline-block">
        @csrf
        @if ($message->deleted)
            <button class="greenbutton" type="submit">Recover</button>
        @else
            <button class="redbutton" type="submit">Archive</button>
        @endif
    </form>
    @endif
    </div>

    </div>
    @if (!Auth::user()->settings->time_preference_24hr)
        <p>{{ $message->created_at->format('F d, Y h:i A') }}</p>
    @else
        <p>{{ $message->created_at->format('F d, Y H:i') }}</p>
    @endif
    <br>
    <h4>{{ $message->subject }}</h4>
    <p>{!! nl2br(e($message->content)) !!}</p>
    <br>
@endsection
