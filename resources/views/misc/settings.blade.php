@extends('layouts.app')
@section('title')
    <title>Settings - {{ env('APP_NAME') }}</title>
    <script src="{{ asset('js/settings.js') }}"></script>
    <style>
        .bio_form {
            width: 50%
        }
    </style>
@endsection
@section('titlediscord')
    <meta content="Settings - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection

@section('popup_content')
    <div class="popupcontainer" id="invisible">
        <div class="popup">
            <form action="{{ route('change_settings') }}" method="POST">
                @csrf
                <input type="hidden" id="activeSetting" name="activeSetting">
                <h2 id="heading"></h2>
                <p class="warningtext"></p>
                <p id="desc"></p>
                <span class="username_change" id="invisible">
                    <br>
                    <h4>New Username</h4>
                    <input type="text" placeholder="New Username..." id="name" name="name">
                    <br>
                    <br>
                    <input type="checkbox" id="username_change_confirm" name="username_change_confirm" value="true">
                    <label for="username_change_confirm"> I understand that changing my username is permanent<br> and can
                        only
                        be done once.</label>
                </span>
                <span class="email_change" id="invisible">
                    <br>
                    <h4>New E-Mail</h4>
                    <input type="email" name="email" placeholder="New E-Mail Field"><br>
                    <h4>Confirm New E-Mail</h4>
                    <input type="email" name="email_confirmation" placeholder="Confirm New E-Mail Field">
                </span>
                <span class="dob_change" id="invisible">
                    <br>
                    <h4>New Date of Birth</h4>
                    <input type="date" name="dob">
                </span>
                <span class="password_change" id="invisible">
                    <br>
                    <h4>Old Password</h4>
                    <input type="password" name="old_password" placeholder="Old Password Field"><br>
                    <h4>New Password</h4>
                    <input type="password" name="password" placeholder="New Password Field"><br>
                    <h4>Confirm New Password</h4>
                    <input type="password" name="password_confirmation" placeholder="Confirm New Password Field">
                </span>
                <span class="date_change" id="invisible">
                    <br>
                    <select name="date_preference">
                        <option value="d/m/Y">DAY/MONTH/YEAR</option>
                        <option value="m/d/Y">MONTH/DAY/YEAR</option>
                        <option value="Y/d/m">YEAR/MONTH/DAY</option>
                    </select>
                </span>
                <span class="time_change" id="invisible">
                    <br>
                    <select name="time_preference">
                        <option value="0">12 Hour</option>
                        <option value="1">24 Hour</option>
                    </select>
                </span>
                <br>
                <br>
                <button class="bluebutton" type="submit">Confirm</button>
                <button class="redbutton" type="reset" onclick="closePopup()">Cancel</button>
            </form>
        </div>
    </div>
@endsection

@section('alert')
    @if ($errors->any())
        <div style="color:white;background-color:red;text-align:center;margin-top:72px">{{ $errors->first() }}</div>
    @endif
    @if (session()->has('change'))
        <div style="color:white;background-color:green;text-align:center;margin-top:72px">{{ session()->get('change') }}
        </div>
    @endif
@endsection

@section('content')
    <h1>Settings</h1>
    <div class="content_special" style="align-content: flex-end; align-items: flex-start; width:100%;">
        <form action="{{ route('change_bio') }}" method="POST" class="bio_form">
            @csrf
            <div class="content_special" style="flex-wrap: wrap; flex-direction: column; width: 100%;">
                <h3>Bio</h3>
                <textarea style="resize: none; width: 100%; height: 75px;" name="bio">
@if (!old('bio'))
{{ Auth::user()->blurb }}@else{{ old('bio') }}
@endif
</textarea>
                @if ($errors->bio_form->any())
                    <span class="warningtext">{{ $errors->bio_form->first() }}</span>
                @endif
                @if (session()->has('success'))
                    <span style="color:green">{{ session()->get('success') }}</span>
                @endif
                <button class="bluebutton" type="submit">Save</button>
        </form>
        <br>
    </div>
    <div class="content_special"
        style="flex-wrap: wrap; flex-direction: row-reverse; width: 50%; text-align: end; align-content: flex-end;">
        <p style="width: 100%;">Username: {{ Auth::user()->name }} <button class="bluebutton"
                onclick="openPopup(1)">Edit</button></p>
        <p style="width: 100%;">E-Mail: {{ Auth::user()->email }} <button class="bluebutton"
                onclick="openPopup(2)">Edit</button></p>
        <p style="width: 100%;">Date of Birth: {{ Auth::user()->dob }} <button class="bluebutton"
                onclick="openPopup(3)">Edit</button>
        </p>
        <p style="width: 100%;">Password: ******** <button class="bluebutton" onclick="openPopup(4)">Edit</button></p>
        <p style="width: 100%;">Date Display Preference:
            {{ Auth::user()->settings->date_preference }} <button class="bluebutton"
                onclick="openPopup(5)">Edit</button>
        </p>
        <p style="width: 100%;">Time Display Preference:
            {{ Auth::user()->settings->time_preference_24hr ? '24 Hour' : '12 Hour' }}
            <button class="bluebutton" onclick="openPopup(6)">Edit</button>
        </p>
    </div>
    </div>
    <div class="content_special" style="align-content: flex-end; align-items: flex-start;">
        <div class="content_special"
            style="flex-wrap: wrap; flex-direction: column; width: 50%; align-content: flex-start;">
            <h3>Invite Keys</h3>
            <p>You can only create 1 invite every week. <br>Manage your keys and key history below.</p>
            <p><button class="bluebutton"><a href="{{ route('key_index') }}" style="font-weight:normal;color:#fff">Create
                        Invite Key</a></button></p>
        </div>
        <div class="content_special"
            style="flex-wrap: wrap; flex-direction: column; width: 50%; text-align: end; align-content: center;">
            <h3>Theme</h3>
            <p>Selected Theme: SKEUOMORPHIC</p>
            <div class="content_special" style="width: 100%; flex-wrap: nowrap;">
                <div class="custom-select" style="width: 90%;">
                    <select name="Theme" style="width: 100%;">
                        <option value="SKEUO">SKEUOMORPHIC</option>
                        <option value="FLAT">FLAT</option>
                        <option value="2013">2013</option>
                        <option value="2007">2007</option>
                    </select>
                </div>
                <button style="width: max-content;" class="greenbutton">Save</button>
            </div>
        </div>
    </div>
    <br>
    <div style="flex-wrap: wrap; flex-direction: column;">
        <h3>DANGER ZONE</h3>
        <p style="color: darkred;">These are inactive for now.<br>In order to delete your account, please ask one of the
            Developers.</p>
        <p>These buttons can fully delete data. Use with caution!</p>
        <p>
            <button class="redbutton" disabled>Delete Account</button>
            <button class="redbutton" disabled>Delete All Places</button>
            <button class="redbutton" disabled>Delete All Avatar Items</button>
        </p>
    </div>
@endsection
