@extends('layouts.app')
@section('title')
    <title>Settings - {{ env('APP_NAME') }}</title>
    <script src="{{ asset('js/settings.js?id=1234') }}"></script>
    <style>
        .bio_form {
            width: 50%
        }

        .theme_form {
            width: 100%
        }
    </style>
@endsection
@section('titlediscord')
    <meta content="Settings - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
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
                    <input type="text" placeholder="New Username..." id="name" name="name">
                    <br>
                    <br>
                    <input type="checkbox" id="username_change_confirm" name="username_change_confirm" value="true">
                    <label for="username_change_confirm"> I understand that I can't change my username after this.</label>
                </span>
                <span class="email_change" id="invisible">
                    <br>    
                    <input type="email" name="email" placeholder="New Email">
                    <br>
                    <br>
                    <input type="email" name="email_confirmation" placeholder="Confirm New Email">
                </span>
                <span class="dob_change" id="invisible">
                    <br>
                    <input type="date" name="dob">
                </span>
                <span class="password_change" id="invisible">
                    <br>
                    <input type="password" name="old_password" placeholder="Old Password">
                    <br>
                    <br>
                    <input type="password" name="password" placeholder="New Password">
                    <br>
                    <br>
                    <input type="password" name="password_confirmation" placeholder="Confirm New Password">
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
                <span class="message_change" id="invisible">
                    <br>
                    <select name="message_preference">
                        <option value="2">Everyone</option>
                        <option value="1">Friends</option>
                        <option value="0">Nobody</option>
                    </select>
                </span>
                <br>
                <br>
                <button class="bluebutton" type="submit">Save</button>
                <button class="redbutton" type="reset" onclick="closePopup()">Cancel</button>
            </form>
        </div>
    </div>
@endsection

@section('alert')
    @if ($errors->any())
        <div id="alert">{{ $errors->first() }}</div>
    @endif
    @if (session()->has('change'))
        <div id="success">{{ session()->get('change') }}</div>
    @endif
@endsection

@section('content')
    <h1>Settings</h1>
    <div class="content_special" style="align-content: flex-end; align-items: flex-start; width:100%;">
        <form action="{{ route('change_bio') }}" method="POST" class="bio_form">
            @csrf
            <div class="content_special" style="flex-wrap: wrap; flex-direction: column; width: 100%;">
                <h3>Bio</h3>
                <textarea style="resize: none; width: 97%; height: 75px;" name="bio">
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
        <p style="width: 100%;">Email: {{ Auth::user()->email }} <button class="bluebutton"
                onclick="openPopup(2)">Edit</button></p>
        <p style="width: 100%;">Date of Birth: {{ Auth::user()->dob }} <button class="bluebutton"
                onclick="openPopup(3)">Edit</button>
        </p>
        <p style="width: 100%;">Password: ******** <button class="bluebutton" onclick="openPopup(4)">Edit</button></p>
        <p style="width: 100%;">Date Display Preference:
            {{ Auth::user()->settings->date_preference }} <button class="bluebutton" onclick="openPopup(5)">Edit</button>
        </p>
        <p style="width: 100%;">Time Display Preference:
            {{ Auth::user()->settings->time_preference_24hr ? '24 Hour' : '12 Hour' }}
            <button class="bluebutton" onclick="openPopup(6)">Edit</button>
        </p>
        <p style="width: 100%;">Message Privacy: @php
            switch (Auth::user()->settings->message_preference) {
                case 2:
                    echo 'Everyone';
                    break;
                case 1:
                    echo 'Friends';
                    break;
                default:
                    echo 'Nobody';
            }
        @endphp <button class="bluebutton"
                onclick="openPopup(7)">Edit</button>
        </p>
    </div>
    </div>
    <div class="content_special" style="align-content: flex-end; align-items: flex-start;">
        <div class="content_special"
            style="flex-wrap: wrap; flex-direction: column; width: 50%; align-content: flex-start;">
            <h3>Invite Keys</h3>
            <p>@if (App\Models\User::isAdmin()) You can create 1 key per minute. @else You can create 1 key per week. @endif</p>
            <p>Manage your keys and key history below.</p>
            <p><button class="bluebutton"><a href="{{ route('key_index') }}"
                        style="font-weight:normal;color:#fff">Create
                        Invite Key</a></button></p>
        </div>
        <div class="content_special"
            style="flex-wrap: wrap; flex-direction: column; width: 50%; text-align: end; align-content: center;">
            <h3>Theme</h3>
            <p>Selected Theme: @php
                switch (Auth::user()->settings->theme) {
                    case 6:
                        echo 'Automatic';
                        break;
                    case 5:
                        echo 'Classic Dark';
                        break;
                    case 4:
                        echo 'Classic Light';
                        break;
                    case 3:
                        echo 'Dark';
                        break;
                    case 2:
                        echo '2018';
                        break;
                    default:
                        echo 'Light';
                }
            @endphp</p>
            <form action="{{ route('change_theme') }}" method="POST" class="theme_form">
                @csrf
                <div class="content_special" style="width: 100%; flex-wrap: nowrap;">
                    <div class="custom-select" style="width: 90%;">
                        <select name="theme_change" style="width: 100%;">
                            <option value="1" @php switch (Auth::user()->settings->theme) { case 1: echo 'selected'; break; default: echo 'selected'; }@endphp>Light</option>
                            <option value="2" @php switch (Auth::user()->settings->theme) { case 2: echo 'selected'; break; }@endphp>2018</option>
                            <option value="3" @php switch (Auth::user()->settings->theme) { case 3: echo 'selected'; break; }@endphp>Dark</option>
                            <option value="4" @php switch (Auth::user()->settings->theme) { case 4: echo 'selected'; break; }@endphp>Classic Light</option>
                            <option value="5" @php switch (Auth::user()->settings->theme) { case 5: echo 'selected'; break; }@endphp>Classic Dark</option>
                            <option value="6" @php switch (Auth::user()->settings->theme) { case 6: echo 'selected'; break; }@endphp>Automatic</option>
                        </select>
                    </div>
                    <button style="width: max-content;" class="greenbutton" type="submit">Save</button>
                </div>
            </form>
            @if (session()->has('theme'))
                <span style="color:green">{{ session()->get('theme') }}</span>
            @endif
        </div>
    </div>
    <br>
    <br>
    <div style="flex-wrap: wrap; flex-direction: column;">
        <h3>DANGER ZONE</h3>
        <p style="warningtext">These are inactive for now.<br>In order to delete your account, please ask one of the
            Developers.</p>
        <p><a href="#"> <button disabled class="redbutton" >Delete Account</button></a> <button class="redbutton" disabled>Disable Account</button></p>
    </div>
@endsection