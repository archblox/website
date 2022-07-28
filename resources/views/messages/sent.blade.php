@extends('layouts.app')
@section('title')
    <title>Sent Messages - {{ env('APP_NAME') }}</title>
@endsection

@section('alert')
    @if (session()->has('success'))
        <div id="alert" style="background:linear-gradient(0deg,#02b757 0%,#118237 49%,#01a64e 50%,#3fc679 95%,#a3e2bd 100%)">{{ session()->get('success') }}
        </div>
    @endif
@endsection

@section('content')
    <h1 id="usernameframe">My Messages</h1>
    <button type="button" class="greenbutton"><a href="{{ route('compose') }}" style="color:white;font-weight:normal">New
            Message</a></button>
    <br>
    <br>
    <a href="{{ route('inbox') }}" class="tab">Inbox
        ({{ App\Models\Message::where('sendto_id', Auth::id())->where('deleted', false)->count() }})</a>
    <a href="#" class="tab_selected">Sent ({{ App\Models\Message::where('user_id', Auth::id())->count() }})</a>
    <a href="{{ route('deleted') }}" class="tab">Deleted
        ({{ App\Models\Message::where('sendto_id', Auth::id())->where('deleted', true)->count() }})</a>
    <br>
    <br>
    @foreach ($messages as $message)
        <div class="content_special" id="FriendsContainer" style="flex-wrap:wrap;cursor:pointer"
            onclick="window.location='/my/messages/{{ $message->id }}';">
            <div class="FriendsContainerBox" id="FriendsContainerBox1">
                <div id="FriendsContainerBox1ImageContainer">
                    <a  onclick="window.location='/my/messages/{{ $message->id }}';"><img alt="Profile Image"
                            src="{{ asset('img/defaultrender.png') }}" width="60px" height="100%"></a>
                </div>
                <div id="FriendsContainerBox1TextContainer">
                    <a  onclick="window.location='/my/messages/{{ $message->id }}';"
                        id="FeedContainerBox1Username">{{ App\Models\User::where('id', $message->sendto_id)->first()->name }}</a>
                    <p>{{ $message->subject }}</p>
                    @if (!Auth::user()->settings->time_preference_24hr)
                        <p id="FeedContainerBox1Timestamp">{{ $message->created_at->format('F d, Y h:i A') }}</p>
                    @else
                        <p id="FeedContainerBox1Timestamp">{{ $message->created_at->format('F d, Y H:i') }}</p>
                    @endif
                </div>
            </div>
        </div>
    @endforeach
    {{ $messages->links() }}
    @if ($messages->isEmpty())
        <p>You haven't sent any messages.</p>
    @endif
    <br>
@endsection
