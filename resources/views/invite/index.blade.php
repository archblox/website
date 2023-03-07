@extends('layouts.app')
@section('title')
    <title>
        Create Invite - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <h1 id="usernameframe">Create a Key</h1>
    @if ($data['canCreate'])
            <p>You may create @if ($data['fetchKeys']->isEmpty()) your first key below!
                @else
                    @if (App\Models\User::isAdmin()) a new key every minute because you're an admin. @else a new key because it's been 1 week since creating your last key. @endif @endif
            </p>
        @else
        <p>@if (App\Models\User::isAdmin()) You cannot create a new key because 1 minute hasn't passed since creating your last key. You can find your key(s) below.. @else You cannot create a new key because 1 week hasn't passed since creating your last key. You can find your key(s) below. @endif</p>
        @endif
        <br>
        @if ($data['canCreate'])
            <form method="POST" action="{{ route('key_create') }}">
                @csrf
                <button class="bluebutton" type="submit">Create Invite Key</button>
            </form>
            <br>
        @endif
        @foreach ($data['fetchKeys'] as $fKey)
            <div class="FeedContainerBox" id="FeedContainerBox1">
                <div id="ProfileContainerBox1TextContainer">
                    <h3>Invite Key | @if (!$fKey->active)
                            You Invited: <a href="@if (!empty(App\Models\User::find($fKey->user_invited)->id))
                            {{ route('profile', App\Models\User::find($fKey->user_invited)->id) }}
                            @endif" 
                                style="font-weight:normal;color:blue">@if (!empty(App\Models\User::find($fKey->user_invited)->id)){{ App\Models\User::find($fKey->user_invited)->name }}@else[ Deleted User ]@endif</a>
                            |
                        @endif Created {{ $fKey->created_at->format('d/m/Y') }}</h3>
                    @if ($fKey->active)
                        <h5 style="color:green">Active</h5>
                    @else
                        <h5 style="color:red">Inactive</h5>
                    @endif
                    <address>{{ $fKey->key }}</address>
                </div>
            </div>
        @endforeach
    @endsection
