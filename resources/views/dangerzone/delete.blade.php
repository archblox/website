@extends('layouts.app')
    @section('title')
        <title>Delete Account - {{ env('APP_NAME') }}</title>
    @endsection
    @section('titlediscord')
        <meta content="Delete Account - {{ env('APP_NAME') }}" property="og:title" />
    @endsection
    @section('descdiscord')
        <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
    @endsection

    @section('content')
        <div class="PageTitleBar">
            <h1>Delete Account</h1>
        </div>
        <p class="important">
            WARNING: BY DELETING YOUR ACCOUNT, YOU LOSE
            <br />
            <br />
            @php echo Auth::user()->morbux; @endphp ARKOTs
            <br />
            @php echo Auth::user()->getFriendsCount() @endphp FRIENDS
            <br />
            {{ App\Models\Message::where('sendto_id', Auth::id())->where('deleted', false)->count() }} SENT MESSAGES
            <br />
            {{ App\Models\Message::where('user_id', Auth::id())->count() }} RECIEVED MESSAGES
            <br />
            {{ App\Models\Message::where('sendto_id', Auth::id())->where('deleted', true)->count() }} ARCHIVED MESSAGES
            <br />
            0 AVATAR ITEMS
            <br />
            0 ASSETS
            <br />
            0 Places
            <br />
            0 UNIVERSES
            <br />
            AND ANYTHING ELSE THAT IS LINKED TO YOUR ACCOUNT.
            <br />
            <br />
        </p>
        @if (App\Models\User::isAdmin())
                <p>Sorry, since you are an Admin, you cannot delete your account through here. Ask a developer if you wish to delete your account.</p>
            @else
                <form method="POST" action="{{ route('deleteaccount') }}">
                @csrf
                <input style="width:5%;margin-bottom:15px;margin-top:15px" type="checkbox" name="remember" id="remember">
                <label class="form-check-label" for="remember">
                    {{ __('I agree that clicking the button below will fully wipe my account from the servers, with no way to recover it later.') }}
                </label>                
                <br />
                <br />
                <button onClick="this.form.submit();this.disabled=true" class="redbutton">Delete Account</button>
                </form>
            @endif
    </div>
@endsection