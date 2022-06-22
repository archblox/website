@extends('layouts.app')
@section('title')
    <title>Home - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <h1 id="usernameframe">Hello, {{ Auth::user()->name }}!</h1>
    <ul></ul>
    <div class="content_special">
        <div id="feed">
            <h2>My Feed</h2>
            <ul></ul>
            <input id="FeedBox" type="text" placeholder="Say something...">
            <button class="greybutton" id="FeedButton">Post it!</button>
            <ul></ul>
            <div id="FeedContainer">
                <div class="FeedContainerBox" id="FeedContainerBox1">
                    <div class="FeedContainerBoxImageContainer" id="FeedContainerBox1ImageContainer">
                        <a href="profile.html"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                                height="100%"></a>
                    </div>
                    <div class="FeedContainerBoxTextContainer" id="FeedContainerBox1TextContainer">
                        <a href="profile.html" id="FeedContainerBox1Username">skeuomorphism hater</a>
                        <p id="FeedContainerBox1Text">"noooooo"</p>
                        <p id="FeedContainerBox1Timestamp">June 21, 2022 04:42 AM</p>
                    </div>
                </div>
                <div class="FeedContainerBox" id="FeedContainerBox1">
                    <div class="FeedContainerBoxImageContainer" id="FeedContainerBox1ImageContainer">
                        <a href="profile.html"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                                height="100%"></a>
                    </div>
                    <div class="FeedContainerBoxTextContainer" id="FeedContainerBox1TextContainer">
                        <a href="profile.html" id="FeedContainerBox1Username">Thomas</a>
                        <p id="FeedContainerBox1Text">"grrr im banning you"</p>
                        <p id="FeedContainerBox1Timestamp">June 21, 2022 04:29 AM</p>
                    </div>
                </div>
                <div class="FeedContainerBox" id="FeedContainerBox1">
                    <div class="FeedContainerBoxImageContainer" id="FeedContainerBox1ImageContainer">
                        <a href="profile.html"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                                height="100%"></a>
                    </div>
                    <div class="FeedContainerBoxTextContainer" id="FeedContainerBox1TextContainer">
                        <a href="profile.html" id="FeedContainerBox1Username">skeuomorphism hater</a>
                        <p id="FeedContainerBox1Text">"i dont"</p>
                        <p id="FeedContainerBox1Timestamp">June 21, 2022 04:28 AM</p>
                    </div>
                </div>
                <div class="FeedContainerBox" id="FeedContainerBox1">
                    <div class="FeedContainerBoxImageContainer" id="FeedContainerBox1ImageContainer">
                        <a href="profile.html"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                                height="100%"></a>
                    </div>
                    <div class="FeedContainerBoxTextContainer" id="FeedContainerBox1TextContainer">
                        <a href="profile.html" id="FeedContainerBox1Username">Thomas</a>
                        <p id="FeedContainerBox1Text">"Who likes my epic new CSS buttons? They're way more interesting than
                            the default buttons."</p>
                        <p id="FeedContainerBox1Timestamp">June 21, 2022 04:27 AM</p>
                    </div>
                </div>
                <div class="FeedContainerBox" id="FeedContainerBox1">
                    <div class="FeedContainerBoxImageContainer" id="FeedContainerBox1ImageContainer">
                        <a href="profile.html"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                                height="100%"></a>
                    </div>
                    <div class="FeedContainerBoxTextContainer" id="FeedContainerBox1TextContainer">
                        <a href="profile.html" id="FeedContainerBox1Username">the night guard from five nights at freddy</a>
                        <p id="FeedContainerBox1Text">"OH LAWD ITS 3 AM! FREDDY FAZBER IS AT MY DOOR PLEASE HELP!!!!"</p>
                        <p id="FeedContainerBox1Timestamp">June 21, 2022 03:19 AM</p>
                    </div>
                </div>
                <div class="FeedContainerBox" id="FeedContainerBox1">
                    <div class="FeedContainerBoxImageContainer" id="FeedContainerBox1ImageContainer">
                        <a href="profile.html"><img alt="Profile Image" src="{{ asset('img/reviewpending.png') }}" width="60px"
                                height="100%"></a>
                    </div>
                    <div class="FeedContainerBoxTextContainer" id="FeedContainerBox1TextContainer">
                        <a href="profile.html" id="FeedContainerBox1Username">Thomas</a>
                        <p id="FeedContainerBox1Text">"Why am I staying up so late making this."</p>
                        <p id="FeedContainerBox1Timestamp">June 21, 2022 12:30 AM</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="gamesframe">
            <h2>Friends (0)</h2>
            <ul></ul>
            <div class="friendslist">
                <p>You don't have any friends yet!</p>
            </div>
            <ul></ul>
            <h2>Recently Played</h2>
            <ul></ul>
            <div class="gamelist">
                <p>You haven't played any games yet!</p>
            </div>
            <ul></ul>
        </div>
    </div>
    <ul></ul>
@endsection
