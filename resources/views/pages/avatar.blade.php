@extends('layouts.app')
@section('title')
    <title>Avatar - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
    <meta content="Avatar - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection

@section('alert')
    <div class="alert warning visible ontop">Avatar Editor is currently work in progress.</div>
@endsection

@section('content')
    <div class="PageTitleBar">
    <h1>Avatar Editor</h1>
    <div>
        <button class="tab_selected">Wardrobe</button> 
        <button class="tab">Currently Wearing</button>
        <button class="tab">My Outfits</button>
    </div>
    </div>
    <div class="content_special">
        <div class="avatarleft" style="width: 30%;">
            <img alt="avatar image" src="{{ asset('img/defaultrender.png') }}" width="100%">
            <p>Avatar not updating? <a href="">Click here to update it</a>!</p>
            <br>
            <h2>Body Colors</h2>
            <div id="ColorChooser">
                <div style="position: relative; margin: 11px 4px; height: 1%;">
                    <div style="position: absolute; left: 72px; top: 0px; cursor: pointer" onclick="OpenColorPicker('Head')">
                        <div id="HeadSelector" style="background-color:#80bbdb;height:44px;width:44px;"></div>
                    </div>
                    <div style="position: absolute; left: 0px; top: 52px; cursor: pointer" onclick="OpenColorPicker('RightArm')">
                        <div id="RightArmSelector" style="background-color:#80bbdb;height:88px;width:40px;"></div>
                    </div>
                    <div style="position: absolute; left: 48px; top: 52px; cursor: pointer" onclick="OpenColorPicker('Torso')">
                        <div id="TorsoSelector" style="background-color:#111111;height:88px;width:88px;"></div>
                    </div>
                    <div style="position: absolute; left: 144px; top: 52px; cursor: pointer" onclick="OpenColorPicker('LeftArm')">
                        <div id="LeftArmSelector" style="background-color:#80bbdb;height:88px;width:40px;"></div>
                    </div>
                    <div style="position: absolute; left: 48px; top: 146px; cursor: pointer" onclick="OpenColorPicker('RightLeg')">
                        <div id="RightLegSelector" style="background-color:#111111;height:88px;width:40px;"></div>
                    </div>
                    <div style="position: absolute; left: 96px; top: 146px; cursor: pointer" onclick="OpenColorPicker('LeftLeg')">
                        <div id="LeftLegSelector" style="background-color:#111111;height:88px;width:40px;"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="avatarright" style="width: 69%;">
            <div class="content_special" style="flex-wrap: wrap;">
                <button class="tab">Heads</button> 
                <button class="tab">Faces</button>
                <button class="tab_selected">Hats</button> 
                <button class="tab">T-Shirts</button> 
                <button class="tab">Shirts</button> 
                <button class="tab">Pants</button> 
                <button class="tab">Torsos</button> 
                <button class="tab">Left Arms</button> 
                <button class="tab">Right Arms</button> 
                <button class="tab">Left Legs</button>  
                <button class="tab">Right Legs</button>
            </div>
            <br>
            <div class="wardrobecontainer"> 
                <p style="text-align: center;">You don't own any Hats yet.</p>
            </div>
        </div>
    </div>
@endsection