    @extends('layouts.app')
    @section('title')
        <title>Catalog - {{ env('APP_NAME') }}</title>
    @endsection
    @section('titlediscord')
        <meta content="Catalog - {{ env('APP_NAME') }}" property="og:title" />
    @endsection
    @section('descdiscord')
        <meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
    @endsection

    @section('alert')
    <div class="alert warning visible ontop">The catalog is currently work in progress.</div>
@endsection

    @section('content')
        <div class="PageTitleBar">
            <h1>Catalog</h1>
            <div>
                <input type="text" placeholder="Search" title="Search Catalog Items Box">
                <button style="height: 22px;" class="greybutton">Search</button>
            </div>
        </div>
        <div class="content_special">
            <div class="content_special" style="width: 15%;flex-wrap: wrap; justify-content: flex-start">
                <p>Sidebar</p>
            </div>
        <div class="content_special" style="width: 85%;flex-wrap: wrap; justify-content: flex-start">
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>ARCHBLOX Visor</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Placeholder Item</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>           
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Only Thirty Characters........</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>           
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Real Item</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>          
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Fake Item</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>          
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Fortnite BALLS</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>          
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Angry Luigi</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>         
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>T-Shirt</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>           
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Ok</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>          
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>No More ITEMS!</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>             
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>Shut up!</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>              
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
            <div class="catalogitem">
                <img class="catalogitemimage" src="{{ asset('img/reviewpending.png') }}">
                <p>No.</p>
                <div class="content_special">
                    <p style="padding-right: 5px;">By</p> 
                    <a href="#" class="ellipsis">OnlyTwentyCharacters</a>
                </div>            
                <strong><img class="arkoticon_small" src="{{ asset('img/arkot.png') }}">10</strong>
            </div>
        </div>
    </div>
    @endsection