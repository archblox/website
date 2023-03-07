@extends('layouts.app')
@section('title')
    <title>Messages - {{ env('APP_NAME') }}</title>
@endsection

@section('alert')
    @if (session()->has('success'))
        <div id="success">{{ session()->get('success') }}</div>
    @endif
    @if ($errors->any())
        <div id="alert">{{ $errors->first() }}</div>
    @endif
@endsection

@section('content')
    <div class="PageTitleBar">
    <h1 id="usernameframe">My Messages</h1>
    <div>
    <a href="#" class="tab_selected">Inbox
        ({{ App\Models\Message::where('sendto_id', Auth::id())->where('deleted', false)->count() }})</a>
    <a href="{{ route('inbox_sent') }}" class="tab">Sent
        ({{ App\Models\Message::where('user_id', Auth::id())->count() }})</a>
    <a href="{{ route('deleted') }}" class="tab">Archived
        ({{ App\Models\Message::where('sendto_id', Auth::id())->where('deleted', true)->count() }})</a>
    </div>
    </div>
    <br>
    <button type="button" class="greenbutton"><a href="{{ route('compose') }}" style="color:white;font-weight:normal">New
            Message</a></button>
    <form action="{{ route('delete_all') }}" method="POST" style="display:inline-block">
        @csrf
        <button class="redbutton" type="submit">Archive All Messages</button>
        </form>
    <br>
    <br>
    @foreach ($messages as $message)
        <div class="content_special" id="FriendsContainer" style="flex-wrap:wrap;cursor:pointer"
            onclick="window.location='/my/messages/{{ $message->id }}';">
            <div class="FriendsContainerBox" id="FriendsContainerBox1">
                <div id="FriendsContainerBox1ImageContainer">
                    <a onclick="window.location='/my/messages/{{ $message->id }}';"><img alt="Profile Image"
                            src="{{ asset('img/defaultrender.png') }}" width="60px" height="60px"></a>
                </div>
                <div id="FriendsContainerBox1TextContainer">
                    <a  onclick="window.location='/my/messages/{{ $message->id }}';"
                        id="FeedContainerBox1Username">{{ $message->user->name }}</a>
                    <p>{{ $message->subject }}</p>
                    @if (!Auth::user()->settings->time_preference_24hr)
                        <p id="FeedContainerBox1Timestamp">{{ $message->created_at->format('F d, Y h:i A') }}</p>
                    @else
                        <p id="FeedContainerBox1Timestamp">{{ $message->created_at->format('F d, Y H:i') }}</p>
                    @endif
                    @if ($message->read)
                        <p style="color:blue">Read</p>
                    @else
                        <p style="color:red">Unread</p>
                    @endif
                </div>
            </div>
        </div>
    @endforeach
    {{ $messages->links() }}
    @if ($messages->isEmpty())
        <p>You have no messages.</p>
    @endif
    <br>
@endsection
