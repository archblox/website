@extends('layouts.ide')
@section('title')
<title>Start Page</title>
@endsection
@section('titlediscord')
<meta content="Start Page - {{env('APP_NAME')}}" property="og:title" />
@endsection
@section('descdiscord')
    <meta content="ARCHBLOX" property="og:description" />
@endsection
@section('extras')
<script type="text/javascript" src="{{ asset('js/test.js') }}"></script>
@endsection
@section('content')
@guest
    <p>Please <a href="{{ route('login') }}">Log In</a> to continue.</p>
@else
<div class="header">
            <div id="header-login-wrapper" class="iframe-login-signup" data-display-opened="">
                <a href="/web/20130702194455/http://roblox.com/Login/NewAge.aspx" target="_blank" class="GrayButton translate" id="header-signup"><span>Sign Up</span></a>
                <span id="header-or">or</span>
                <span class="studioiFrameLogin">
                    <span id="login-span">
                        <a id="header-login" class="btn-control btn-control-large">Login <span class="grey-arrow">▼</span></a>
                    </span>
                
                    <div id="iFrameLogin" class="studioiFrameLogin" style="display: none">
                        <iframe class="login-frame" src="https://web.archive.org/web/20130702194455if_/https://www.roblox.com/Login/iFrameLogin.aspx?loginRedirect=True&amp;parentUrl=http%3a%2f%2fwww.roblox.com%2fide%2fwelcome" scrolling="no" frameborder="0"></iframe>                                  
                    </div>
                </span>
            </div>
        <!-- This is only after the login stuff because IE7 demands floated elements be before non-floated -->
        <img src="/web/20130702194455im_/http://roblox.com/images/IDE/img-studio_title.png" alt="Roblox Studio Title"/>
        <p id="HomeLink">
            <a class="text-link" href="/web/20130702194455/http://roblox.com/Build/Default.aspx">Switch to Classic View</a>
        </p>
    </div>
    <div class="container">
        <div class="main">
            <div id="TemplatesView" class="welcome-content-area">

<h2 id="StudioGameTemplates">GAME TEMPLATES</h2>
                <div class="templates" js-data-templatetype="Basic">
                        <div class="template" placeid="200">
                            <a href="" class="game-image"><img class="" src="https://web.archive.org/web/20130702194455im_/http://t2ak.roblox.com/362ae9c43957047a0287f9cd2c98646c"/></a>
                            <p>Baseplate</p>
                        </div>
                        <div class="template" placeid="201">
                            <a href="" class="game-image"><img class="" src="https://web.archive.org/web/20130702194455im_/http://t7ak.roblox.com/ab99a6e34406eb5e7aebd349c90ce35b"/></a>
                            <p>Flat Terrain</p>
                        </div>
                </div>
            </div>
            <div id="MyProjectsView" class="welcome-content-area" style="display: none">
                <h2>My Published Projects</h2>
                <div id="AssetList">


    <div>
        <span>You must be logged in to view your published projects!</span>
    </div>
    <script type="text/javascript">
        $('#MyProjects').click(function() {
            $('#header-login').addClass('active');
            $('#iFrameLogin').css('display', 'block');
        });
    </script>
                </div>        
            </div>
            <div id="ButtonRow" class="divider-top divider-left divider-bottom">
                <a class="btn-medium btn-primary" id="EditButton">Edit<span class="btn-text">Edit</span></a>
                <a class="btn-medium btn-primary" id="BuildButton">Build<span class="btn-text">Build</span></a>
                <a class="btn-medium btn-negative" id="CollapseButton">Cancel<span class="btn-text">Cancel</span></a>
            </div>
        </div>
    </div>
    
    <div class="GenericModal modalPopup unifiedModal smallModal" style="display:none;">
        <div class="Title"></div>
        <div class="GenericModalBody">
            <div>
                <div class="ImageContainer">
                    <img class="GenericModalImage" alt="generic image"/>
                </div>
                <div class="Message"></div>
            </div>
            <div class="clear"></div>
            <div id="GenericModalButtonContainer" class="GenericModalButtonContainer">
                <a class="ImageButton btn-neutral btn-large roblox-ok">OK<span class="btn-text">OK</span></a>
            </div>  
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
    
            Roblox.Client.Resources = {
                //<sl:translate>
                here: "here",
                youNeedTheLatest: "You need Our Plugin for this.  Get the latest version from ",
                plugInInstallationFailed: "Plugin installation failed!",
                errorUpdating: "Error updating: "
                //</sl:translate>
            };

            if (typeof Roblox.IDEWelcome === "undefined")
                Roblox.IDEWelcome = { };

            Roblox.IDEWelcome.Resources = {
                //<sl:translate>
                openProject: "Open Project",
                openProjectText: "To open your project, open to this page in ",
                robloxStudio: "ROBLOX Studio",
                editPlace: "Edit Place",
                toEdit: "To edit ",
                openPage: ", open to this page in ",
                buildPlace: "Build Place",
                toBuild: "To build on ",
                placeInactive: "Place Inactive",
                activate: ", activate this place by going to File->My Published Projects.",
                emailVerifiedTitle: "Verify Your Email",
                emailVerifiedMessage: "You must verify your email before you can work on your place. You can verify your email on the <a href='/My/Account.aspx?confirmemail=1'>Account</a> page.",
                verify: "Verify",
                cancel: "Cancel"
                //</sl:translate>
            };
        });
    </script>
    
<div class="ConfirmationModal modalPopup unifiedModal smallModal" data-modal-handle="confirmation" style="display:none;">
    <a class="genericmodal-close ImageButton closeBtnCircle_20h"></a>
    <div class="Title"></div>
    <div class="GenericModalBody">
        <div class="TopBody">
            <div class="ImageContainer roblox-item-image" data-image-size="small" data-no-overlays data-no-click>
                <img class="GenericModalImage" alt="generic image"/>
            </div>
            <div class="Message"></div>
        </div>
        <div class="ConfirmationModalButtonContainer">
            <a href roblox-confirm-btn><span></span></a>
            <a href roblox-decline-btn><span></span></a>
        </div>
        <div class="ConfirmationModalFooter">
        
        </div>  
    </div>  
    <script type="text/javascript">
        //<sl:translate>
        Roblox.GenericConfirmation.Resources = { yes: "Yes", No: "No" }
    //</sl:translate>
    </script>
</div>
@endguest     
@endsection