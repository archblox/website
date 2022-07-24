@extends('layouts.app')
@section('title')
<title>StyleGuide - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
<h1 id="usernameframe">StyleGuide</h1>
<p>This is a page explaining and showing how (most) of the CSS works for this site.</p>
<br>
<h4>Buttons</h4>
<p>Buttons.. Don't you like them? They're used for most things that you need to click that aren't links. These look
    similar to tabs, but buttons are round and have more variants.</p>
<br>
<button class="greenbutton">.greenbutton</button>
<button class="bluebutton">.bluebutton</button>
<button class="redbutton">.redbutton</button>
<button class="greybutton">.greybutton</button>
<br>
<br>
<p>Code</p>
<textarea style="resize: none; width: 100%; height: 100px;" readonly>
<button class="greenbutton">.greenbutton</button>
<button class="bluebutton">.bluebutton</button>
<button class="redbutton">.redbutton</button>
<button class="greybutton">.greybutton</button>
</textarea>
<br>
<br>
<h4>Tabs</h4>
<p>These are used on pages that have sub-pages. These look similar to buttons, but tabs are not round.</p>
<br>
<a href="#" class="tab_selected">.tab_selected</a>
<a href="#" class="tab">.tab</a>
<br>
<br>
<p>Code</p>
<textarea style="resize: none; width: 100%; height: 100px;" readonly>
<a href="#" class="tab_selected">.tab_selected</a>
<a href="#" class="tab">.tab</a>
</textarea>
<br>
<br>
<h4>content_special</h4>
<p>A div that is used for organising contents using display: inline-flex.</p>
<br>
<div class="content_special">
    <p>Hello i'm some text in the .content_special/#content_special div</p>
</div>
<br>
<br>
<p>Code</p>
<textarea style="resize: none; width: 100%; height: 100px;" readonly>
<div class="content_special">
    <p>Hello i'm some text in the .content_special/#content_special div</p>
</div>
</textarea>
<br>
<br>
<h4>Feed, FeedContainer, FeedContainerBox, FeedContainerBoxImageContainer, FeedContainerBoxTextContainer,
    FeedContainerBox1Username, FeedContainerBox1Text, FeedContainerBox1Timestamp</h4>
<p>The boxes containing the content of My Feed.</p>
<br>
<div id="Feed">
    <div id="FeedContainer">
        <div class="FeedContainerBox">
            <div class="FeedContainerBoxImageContainer">
                <a href="#"><img alt="Profile Image" src="{{ asset('img/defaultrender.png') }}" width="60px"
                        height="100%"></a>
            </div>
            <div class="FeedContainerBoxTextContainer">
                <a id="FeedContainerBox1Username">#FeedContainerBox1Username</a>
                <p id="FeedContainerBox1Text" style="word-wrap:break-word;max-width:400px">#FeedContainerBox1Text</p>
                <p id="FeedContainerBox1Timestamp">#FeedContainerBox1Timestamp</p>
            </div>
        </div>
        <div class="FeedContainerBox">
            <div class="FeedContainerBoxImageContainer">
                <a href="#"><img alt="Profile Image" src="{{ asset('img/defaultrender.png') }}" width="60px"
                        height="100%"></a>
            </div>
            <div class="FeedContainerBoxTextContainer">
                <a id="FeedContainerBox1Username">#FeedContainerBox1Username</a>
                <p id="FeedContainerBox1Text" style="word-wrap:break-word;max-width:400px">#FeedContainerBox1Text</p>
                <p id="FeedContainerBox1Timestamp">#FeedContainerBox1Timestamp</p>
            </div>
        </div>
    </div>
</div>
<br>
<br>
<p>Code</p>
<textarea style="resize: none; width: 100%; height: 100px;" readonly><div id="Feed">
    <div id="FeedContainer">
        <div class="FeedContainerBox">
            <div class="FeedContainerBoxImageContainer">
                <a href="#"><img alt="Profile Image" src="{{ asset('img/defaultrender.png') }}" width="60px" height="100%"></a>
            </div>
            <div class="FeedContainerBoxTextContainer">
                <a id="FeedContainerBox1Username">#FeedContainerBox1Username</a>
                <p id="FeedContainerBox1Text" style="word-wrap:break-word;max-width:400px">#FeedContainerBox1Text</p>
                <p id="FeedContainerBox1Timestamp">#FeedContainerBox1Timestamp</p>
            </div>
        </div>
        <div class="FeedContainerBox">
            <div class="FeedContainerBoxImageContainer">
                <a href="#"><img alt="Profile Image" src="{{ asset('img/defaultrender.png') }}" width="60px"height="100%"></a>
            </div>
            <div class="FeedContainerBoxTextContainer">
                <a id="FeedContainerBox1Username">#FeedContainerBox1Username</a>
                <p id="FeedContainerBox1Text" style="word-wrap:break-word;max-width:400px">#FeedContainerBox1Text</p>
                <p id="FeedContainerBox1Timestamp">#FeedContainerBox1Timestamp</p>
            </div>
        </div>
    </div>
</textarea>
@endsection