@extends('layouts.app')
@section('title')
    <title>StyleGuide - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
    <h1 id="usernameframe">StyleGuide</h1>
    <p>This is a page explaining and showing how the CSS works for this site.</p>
    <br>
    <h4>Buttons</h4>
    <p>Buttons.. Don't you like them? They're used for most things that you need to click that aren't links.</p>
    <br>
    <button class="greenbutton">.greenbutton</button>
    <button class="bluebutton">.bluebutton</button>
    <button class="redbutton">.redbutton</button>
    <button class="greybutton">.greybutton</button>
    <br>
    <br>
    <h4>Tabs</h4>
    <p>These are used on pages that have sub-pages. These look similar to buttons, but they're not rounder.</p>
    <br>
    <a href="#" class="tab_selected">.tab_selected</a>
    <a href="#" class="tab">.tab</a>
    <br>
    <br>
    <h4>content_special<h4>
    <p>A div that is used for organising contents using display: inline-flex.</p>
    <br>
    <div class="content_special">
        <p>Hello i'm some text</p>
        <p>AAAAAAAAAAAAAAAAAAA</p>
    </div>
    <br>
    <br>
    <h4>Feed, FeedContainer, FeedContainerBox, FeedContainerBoxImageContainer, FeedContainerBoxTextContainer, FeedContainerBox1Username, FeedContainerBox1Text, FeedContainerBox1Timestamp</h4>
    <p>The boxes containing the content of My Feed.</p>
    <div id="Feed">
        <p>#Feed</p>
        <div id="FeedContainer">
            <p>#FeedContainer</p>
            <div class="FeedContainerBox">
                .FeedContainerBox
                <div class="FeedContainerBoxImageContainer">
                    <p>.FeedContainerBoxImageContainer</p>
                </div> 
                <div class="FeedContainerBoxTextContainer">
                    <p>.FeedContainerBoxTextContainer</p>
                    <p id="FeedContainerBox1Username">#FeedContainerBox1Username<p>
                    <p id="FeedContainerBox1Text">#FeedContainerBox1Text<p>
                    <p id="FeedContainerBox1Timestamp">#FeedContainerBox1Timestamp<p>
                </div> 
            </div>
        </div>
    </div>
@endsection
