

           
<!DOCTYPE html>

<html>
<head>
    <title>Welcome</title>
    <script type="text/javascript" src="https://web.archive.org/web/20130702194455js_/http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js"></script>
<script type="text/javascript">window.jQuery || document.write("<script type='text/javascript' src='https://web.archive.org/web/20130702194455js_/http://roblox.com//js/jquery/jquery-1.7.2.min.js'><\/script>")</script>
<script type="text/javascript" src="https://web.archive.org/web/20130702194455js_/http://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
<script type="text/javascript">window.Sys || document.write("<script type='text/javascript' src='https://web.archive.org/web/20130702194455js_/http://roblox.com/js/Microsoft/MicrosoftAjax.js'><\/script>")</script>

    
<link rel="stylesheet" href="https://web.archive.org/web/20130702194455cs_/http://roblox.com/CSS/Base/CSS/FetchCSS?path=page___70a75bfda0b97b53e5637a9e3af568ee_m.css"/>

    
<script type="text/javascript" src="https://web.archive.org/web/20130702194455js_/http://jsak.roblox.com/644b0e8baae8d8db3809d69b1924ea60.js"></script>

    
    <script type="text/javascript">Roblox.config.externalResources = ['/js/jquery/jquery-1.7.2.min.js'];Roblox.config.paths['jQuery'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/29cf397a226a92ca602cb139e9aae7d7.js';Roblox.config.paths['Pagelets.BestFriends'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/c8acaba4214074ed4ad6f8b4a9647038.js';Roblox.config.paths['Pages.Catalog'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/c8f61a230e6ad34193b40758f1499a3d.js';Roblox.config.paths['Pages.Messages'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/b84022adb990981fb0bd838cda0f67d5.js';Roblox.config.paths['Resources.Messages'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/fb9cb43a34372a004b06425a1c69c9c4.js';Roblox.config.paths['Widgets.AvatarImage'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/b7f418a5fefacfd21f2c86b495b4698f.js';Roblox.config.paths['Widgets.DropdownMenu'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/d83d02dd89808934b125fa21c362bcb9.js';Roblox.config.paths['Widgets.GroupImage'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/3e692c7b60e1e28ce639184f793fdda9.js';Roblox.config.paths['Widgets.HierarchicalDropdown'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/e8b579b8e31f8e7722a5d10900191fe7.js';Roblox.config.paths['Widgets.ItemImage'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/facde7fc56e53e1ef9ee75203bc76bb4.js';Roblox.config.paths['Widgets.PlaceImage'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/08e1942c5b0ef78773b03f02bffec494.js';Roblox.config.paths['Widgets.Suggestions'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/a63d457706dfbc230cf66a9674a1ca8b.js';Roblox.config.paths['Widgets.SurveyModal'] = 'https://web.archive.org/web/20130702194455/http://jsak.roblox.com/d6e979598c460090eafb6d38231159f6.js';</script>
        <script type="text/javascript">
            function editTemplateInStudio(play_placeId) { RobloxLaunch._GoogleAnalyticsCallback = function() { var isInsideRobloxIDE = 'website'; if (Roblox && Roblox.Client && Roblox.Client.isIDE && Roblox.Client.isIDE()) { isInsideRobloxIDE = 'Studio'; };GoogleAnalyticsEvents.FireEvent(['Edit Location', 'Guest', isInsideRobloxIDE]);GoogleAnalyticsEvents.FireEvent(['Edit', 'Guest', '']); };  Roblox.Client.WaitForRoblox(function() { RobloxLaunch.StartGame('https://archblox.com/Game/edit.ashx?PlaceID='+play_placeId+'&upload=', 'edit.ashx', 'https://web.archive.org/web/20130702194455/https://www.roblox.com//Login/Negotiate.ashx', 'FETCH', true); }); }
        </script>
</head>
<body id="StudioWelcomeBody">
    <div class="header">
            <div id="header-login-wrapper" class="iframe-login-signup" data-display-opened="">
                @guest
                <a href="../register" target="_blank" class="GrayButton translate" id="header-signup"><span>Sign Up</span></a>
                <span id="header-or">or</span>
                <span class="studioiFrameLogin">
                    <span id="login-span">
                        <a href="../login" id="header-login" class="btn-control btn-control-large">Login <span class="grey-arrow">▼</span></a>
                    </span>
                </span>
                @else
                <p>Logged in as {{ Auth::user()->name }}</p>
                @end
            </div>
        <!-- This is only after the login stuff because IE7 demands floated elements be before non-floated -->
        <img src="https://web.archive.org/web/20130702194455im_/http://roblox.com/images/IDE/img-studio_title.png" alt="Roblox Studio Title"/>
    </div>
    <div class="container">
        <div class="navbar">
            <ul class="navlist">
                <li id="NewProject"><p>New Project</p></li>
                    <li id="MyProjects"><p>My Projects</p></li>
                <!--li class="lastnav"><p>Recent News</p></li-->
            </ul>
        </div>
        <div class="main">
            <div id="TemplatesView" class="welcome-content-area">

<h2 id="StudioGameTemplates">GAME TEMPLATES</h2>
            <div class="templatetypes">
                <ul class="templatetypes">
                        <li js-data-templatetype="Basic"><a href="#Basic">Basic</a></li>
                        <li js-data-templatetype="Strategy"><a href="#Strategy">Strategy</a></li>
                        <li js-data-templatetype="Action"><a href="#Action">Action</a></li>
                </ul>
                <!--div class="tool-tip">
                    <img alt="Recommended for users new to ROBLOX studio" src="/images/IDE/img-tail-top.png" class="top" />
                    <p>Recommended for users new to ROBLOX studio</p>
                    <a class="closeButton"></a>
                </div -->
            </div>
            
                <div class="templates" js-data-templatetype="Basic" style="display: block">
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
</body>
</html>