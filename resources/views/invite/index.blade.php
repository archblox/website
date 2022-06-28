@extends('layouts.app')
@section('title')
    <title>
        Create Invite - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <h1 id="usernameframe">Create a Key</h1>
    @if ($data['canCreate'] || App\Models\User::isAdmin())
            <p>You may create @if ($data['fetchKeys']->isEmpty()) your first key below!
                @else
                    @if (App\Models\User::isAdmin()) as many keys as you wish because you're an admin. @else a new key because it's been 1 week since creating your last key. @endif @endif
            </p>
        @else
            <p>You cannot create a new key because 1 week hasn't passed since creating your last key. You can find your
                key(s) below.</p>
        @endif
        <br>
        @if ($data['canCreate'] || App\Models\User::isAdmin())
            <form method="POST" action="{{ route('key_create') }}">
                @csrf
                <button class="bluebutton" type="submit">Create Invite Key</button>
            </form>
            <br>
        @endif
        @foreach ($data['fetchKeys'] as $fKey)
            <div class="FeedContainerBox" id="FeedContainerBox1">
                <div id="ProfileContainerBox1TextContainer">
                    <h3>Invite Key - @if (!$fKey->active)
                            You Invited: <a href="{{ route('profile', App\Models\User::find($fKey->user_invited)->id) }}"
                                style="font-weight:normal;color:blue">{{ App\Models\User::find($fKey->user_invited)->name }}</a>
                            -
                        @endif Created {{ $fKey->created_at->format('d/m/Y') }}</h3>
                    @if ($fKey->active)
                        <h5 style="color:green">Status: Active</h5>
                    @else
                        <h5 style="color:red">Status: Inactive</h5>
                    @endif
                    <address>{{ $fKey->key }}</address>
                </div>
            </div>
        @endforeach
    @endsection
