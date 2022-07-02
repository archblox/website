@extends('layouts.app')
@section('title')
<title>Settings - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Settings - {{env('APP_NAME')}}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection

@section('popup_content')
<div class="popupcontainer" id="invisible">
    <div class="popup">
        <h2>Test Dialog</h2>
        <p class="warningtext">WARNING TEXT</p>
        <p>DESCRIPTION OF THE SETTING YOU ARE ABOUT TO CHANGE</p>
        <input type="text" placeholder="New Username Field">
        <br>
        <input type="password" placeholder="Old Password Field">
        <input type="password" placeholder="New Password Field">
        <input type="password" placeholder="Confirm New Password Field">
        <br>
        <input type="text" placeholder="Confirm Old E-Mail Field">
        <input type="text" placeholder="New E-Mail Field">
        <input type="text" placeholder="Confirm New E-Mail Field">
        <br>
        <input type="date">
        <br>
        <select name="Time Preference">
            <option value="12hour">12 Hour</option>
            <option value="24hour">24 Hour</option>
        </select>
        <br>
        <select name="Date Preference">
            <option value="DMY">DAY/MONTH/YEAR</option>
            <option value="MDY">MONTH/DAY/YEAR</option>
            <option value="YDM">YEAR/MONTH/DAY</option>
        </select>
        <br>
        <button class="bluebutton">Confirm_Good</button>
        <button class="redbutton">Cancel_Bad</button>
        <button class="redbutton">Confirm_Bad</button>
        <button class="bluebutton">Cancel_Good</button>
    </div>
</div>
@endsection

@section('content')
<h1>Settings</h1>
<div class="content_special" style="align-content: flex-end; align-items: flex-start; width=100%;">
    <div class="content_special" style="flex-wrap: wrap; flex-direction: column; width: 50%;">
        <h3>Bio</h3>
        <textarea style="resize: none; width: 100%; height: 75px;" placeholder="Hello!"></textarea>
        <button class="bluebutton">Save</button>
        <br>
    </div>
    <div class="content_special"
        style="flex-wrap: wrap; flex-direction: row-reverse; width: 50%; text-align: end; align-content: flex-end;">
        <p style="width: 100%;">Username: OnlyTwentyCharacters <button class="bluebutton">Edit</button></p>
        <p style="width: 100%;">E-Mail: t****@ex********.com <button class="bluebutton">Edit</button></p>
        <p style="width: 100%;">Date of Birth: 01/01/01 <button class="bluebutton">Edit</button></p>
        <p style="width: 100%;">Password: ******** <button class="bluebutton">Edit</button></p>
        <p style="width: 100%;">Date Display Preference: D/M/YY <button class="bluebutton">Edit</button></p>
        <p style="width: 100%;">Time Display Preference: 12 Hour <button class="bluebutton">Edit</button></p>
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
    <p style="color: darkred;">These are inactive for now.<br>In order to delete your account, please ask one of the Developers.</p>
    <p>These buttons can fully delete data. Use with caution!</p>
    <p>
        <button class="redbutton" disabled>Delete Account</button> 
        <button class="redbutton" disabled>Delete All Places</button> 
        <button class="redbutton" disabled>Delete All Avatar Items</button>
    </p>
</div>
@endsection