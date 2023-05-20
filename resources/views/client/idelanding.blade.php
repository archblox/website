<!-- Hey inspect element user! Thomas here, trying to figure out how to get place launching working in studio. If you have any idea on how to fix this issue, please, DM me on discord! -->
<!DOCTYPE html>

<html>

<head>
    <title>Welcome</title>
    <link rel="stylesheet" href="{{ asset('css/FetchCSS2.css') }}">
    <script type="text/javascript" src="{{ asset('js/test.js') }}"></script>
</head>

<body id="StudioWelcomeBody">
<div class="header">
            <div id="header-login-wrapper" class="iframe-login-signup" data-display-opened="">
                @guest
                <a href="{{ route('register') }}" class="GrayButton translate header-signup"><span>Sign Up</span></a>
                <span id="header-or">or</span>
                <span class="studioiFrameLogin">
                    <span id="login-span">
                         <a class="btn-control btn-control-large header-login">Login
                            <span class="grey-arrow">▼</span>
                        </a>
                    </span>
                    <div id="iFrameLogin" class="studioiFrameLogin" style="display: none; background: #E1E1E1">
                        <iframe class="login-frame" src="{{ route('login_iframe') }}" allow-scripts scrolling="no" frameborder="0"></iframe>                                  
                    </div>
                </span>
                @else
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none">
                    @csrf
                </form>
                <span id="header-or">Logged in as {{ Auth::user()->name }} | <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">Logout</a></span>
                @endguest
            </div>
        <!-- This is only after the login stuff because IE7 demands floated elements be before non-floated -->
        <img src="{{ asset('img/img-studio_title.png') }}" alt="ARCHBLOX Studio Title">
    </div>
    <div class="container">
        <div class="navbar" style="height: 821px;">
            <ul class="navlist" style="border-bottom: none;">
                <li id="NewProject" class="navselected"><p>New Project</p></li>
                    <li id="MyProjects" class="lastnav"><p>My Projects</p></li>
                <!--li class="lastnav"><p>Recent News</p></li-->
            </ul>
        </div>
        <div class="main">
            <div id="TemplatesView" class="welcome-content-area">

<h2 id="StudioGameTemplates">GAME TEMPLATES</h2>
            <div class="templatetypes">
                <ul class="templatetypes">
                        <li js-data-templatetype="Basic" class="selectedType"><a href="#Basic">Basic</a></li>
                        <li js-data-templatetype="Strategy"><a href="#Strategy">Strategy</a></li>
                        <li js-data-templatetype="Action"><a href="#Action">Action</a></li>
                </ul>
                <!--div class="tool-tip">
                    <img alt="Recommended for users new to ROBLOX studio" src="/images/IDE/img-tail-top.png" class="top" />
                    <p>Recommended for users new to ROBLOX studio</p>
                    <a class="closeButton"></a>
                </div -->
            </div>
            
                <div class="templates" js-data-templatetype="Basic" style="display: block;">
                        <div class="template" placeid="200">
                            <a class="game-image"><img class="" src="https://web.archive.org/web/20130702194455im_/http://t2ak.jarfeh.xyz/362ae9c43957047a0287f9cd2c98646c"></a>
                            <p>Baseplate</p>
                        </div>
                        <div class="template" placeid="201">
                            <a class="game-image"><img class="" src="https://web.archive.org/web/20130702194455im_/http://t7ak.jarfeh.xyz/ab99a6e34406eb5e7aebd349c90ce35b"></a>
                            <p>Flat Terrain</p>
                        </div>
                </div>
                <div class="templates" js-data-templatetype="Strategy">
                        <div class="template" placeid="0">
                            <a class="game-image"><img class="" src="https://web.archive.org/web/20130702194455im_/http://t3ak.jarfeh.xyz/2db15742ba86f0dfe6cd2762a8debbde"></a>
                            <p>Capture The Flag</p>
                        </div>
                        <div class="template" placeid="0">
                            <a class="game-image"><img class="" src="https://web.archive.org/web/20130702194455im_/http://t2ak.jarfeh.xyz/426308e89cd36c0bb531b9dd8e990c10"></a>
                            <p>Control Points</p>
                        </div>
                </div>
                <div class="templates" js-data-templatetype="Action">
                        <div class="template" placeid="0">
                            <a class="game-image"><img class="" src="https://web.archive.org/web/20130702194455im_/http://t7ak.jarfeh.xyz/4ae1c9ec91cd33a9b38ad741ac1d0a4f"></a>
                            <p>Free For All</p>
                        </div>
                        <div class="template" placeid="0">
                            <a class="game-image"><img class="" src="https://web.archive.org/web/20130702194455im_/http://t3ak.jarfeh.xyz/f6e818f03afa39b999a4ed33b464c0cb"></a>
                            <p>Team Deathmatch</p>
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
                    <img class="GenericModalImage" alt="generic image">
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
            <div class="ImageContainer roblox-item-image" data-image-size="small" data-no-overlays="" data-no-click="">
                <img class="GenericModalImage" alt="generic image">
            </div>
            <div class="Message"></div>
        </div>
        <div class="ConfirmationModalButtonContainer">
            <a href="" roblox-confirm-btn=""><span></span></a>
            <a href="" roblox-decline-btn=""><span></span></a>
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

</body>

</html>