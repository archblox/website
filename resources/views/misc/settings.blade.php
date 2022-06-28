@extends('layouts.app')
@section('title')
    <title>Settings - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <h1>Settings</h1>
    <div class="content_special" style="align-content: flex-end; align-items: flex-start;">
        <div class="content_special" style="flex-wrap: wrap; flex-direction: column; width: 50%;">
            <h3>Bio</h3>
            <textarea style="resize: none; width: 100%; height: 75px;" placeholder="Hello!"></textarea>
            <button class="bluebutton">Save</button>
            <br>
        </div>
        <div class="content_special" style="flex-wrap: wrap; flex-direction: column; width: 50%; text-align: end;">
            <p>Username: OnlyTwentyCharacters <button class="bluebutton">Edit</button></p>
            <p>E-Mail: t****@ex********.com <button class="bluebutton">Edit</button></p>
            <p>Date of Birth: 01/01/01 <button class="bluebutton">Edit</button></p>
            <p>Password: ******** <button class="bluebutton">Edit</button></p>
            <p>Date Display Preference: D/M/YY <button class="bluebutton">Edit</button></p>
            <p>Time Display Preference: 12 Hour <button class="bluebutton">Edit</button></p>
        </div>
    </div>
    <div>
        <h3>Invite Keys</h3>
        <p>You can only create 1 invite every week. <br>Manage your keys and key history below.</p>
        <p><button class="bluebutton"><a href="{{ route('key_index') }}" style="font-weight:normal;color:#fff">Create Invite Key</a></button></p>
    </div>
    <br>
    <div style="flex-wrap: wrap; flex-direction: column;">
        <h3>DANGER ZONE - These are inactive for now</h3>
        <p>These buttons can fully delete data. Use with caution!</p>
        <p><button class="redbutton" disabled>Delete Account</button> <button class="redbutton" disabled>Delete All Places</button> <button
                class="redbutton" disabled>Delete All Avatar Items</button></p>
    </div>
@endsection
