@extends('layouts.app')
@section('title')
    <title>Admin - {{ env('APP_NAME') }}</title>
@endsection

@section('content')
<div class="iphone-sidebar">
    <img src="https://morblox.us/img/MORBLOXlogo.png" width="50%">
    <p>Admin Panel</p>
    <p>Logged in as: ballsgamer123</p>
    <br>
    <a>User List</a>
    <br>
    <a>Game List</a>
    <br>
    <a>Invite Tree</a>
    <br>
    <a>Asset Approval Queue</a>
    <br>
    <a>Reports</a>
    <br>
    <a>Moderation Logs</a>
    <br>
    <a>Game Servers</a>
</div>
<div class="iphone-content" style="padding-left: 0px; padding-right: 0px;">
    <div id="UserList">
        <h2>User List</h2>
        <p><input type="text" placeholder="Search..."><button class="bluebutton">Search by Username</button> <button class="bluebutton">Search by ID</button></p>
        <div id="SearchContainer">
            <div class="ProfileContainerBox" id="ProfileContainerBox1">
                <div id="ProfileContainerBox1ImageContainer">
                    <img alt="Profile Image" src="https://morblox.us/img/reviewpending.png" width="60px" height="100%">
                </div>
                <div id="ProfileContainerBox1TextContainer">
                    <p>USERNAME: MORBLOX</p>
                    <p>EMAIL: test@example.com</p>
                    <p>ID: 1</p>
                    <p>DOB: 1/1/01</p>
                    <p>STATUS: Normal</p>
                    <p>INVITED BY: SYSTEM (ID: 0)</p>
                    <button class="greybutton">Check Reports For This User</button>
                    <button class="bluebutton">Edit User Data</button>
                    <button class="bluebutton">Warn/Ban History</button>
                    <button class="redbutton">Warn</button>
                    <button class="redbutton">Ban/Terminate</button>
                </div>
            </div>
        </div>
    </div>
    <div id="GameList">
        <h2>Game List</h2>
        <p><input type="text" placeholder="Search..."><button class="bluebutton">Search by Name</button> <button class="bluebutton">Search by ID</button></p>
        <div id="SearchContainer">
            <div class="ProfileContainerBox" id="ProfileContainerBox1">
                <div id="ProfileContainerBox1ImageContainer">
                    <img alt="Game Image" src="https://morblox.us/img/reviewpending.png" width="60px" height="100%">
                </div>
                <div id="ProfileContainerBox1TextContainer">
                    <p>Game Name: MORBLOX's Place</p>
                    <p>Game Description: This is your first MORBLOX Place. Open it with MORBLOX Studio to start building!</p>
                    <p>Creator: MORBLOX</p>
                    <p>GAMEID: 1</p>
                    <button class="greybutton">Check Reports For This Game</button>
                    <button class="greenbutton">Play Game In Studio</button>
                    <button class="redbutton">Delete Game</button>
                    <button class="redbutton">Ban/Terminate Creator</button>
                </div>
            </div>
        </div>
    </div>
    <div id="InviteTree">
        <h2>Invite Tree</h2>
        <p><input type="text" placeholder="Search..."><button class="bluebutton">Search by Username</button> <button class="bluebutton">Search by ID</button></p>
        <div id="InviteTreeContainer">
            <p>---------------------------</p>
            <p>SYSTEM (ID: 0)</p>
            <p>- MORBLOX (ID: 1)</p>
            <p>- Conkley (ID: 2)</p>
            <p>- Thomas (ID: 3)</p>
            <p>- - the night guard from five nights at freddy (ID: ??)</p>
            <p>- Mura (ID: 4)</p>
            <p>- Pipedream (ID: 5)</p>
            <p>---------------------------</p>
        </div>
    </div>
    <div id="AssetApprovalQueue">
        <h2>Asset Approval Queue</h2>
        <p><input type="text" placeholder="Search..."><button class="bluebutton">Search by Asset Name</button> <button class="bluebutton">Search by Username</button></p>
        <div id="AssetApprovalContainer">
            <div class="ProfileContainerBox" id="ProfileContainerBox1">
                <div id="ProfileContainerBox1ImageContainer">
                    <img alt="Asset Image" src="https://morblox.us/img/reviewpending.png" width="60px" height="100%">
                </div>
                <div id="ProfileContainerBox1TextContainer">
                    <p>Asset Name: PLACEHOLDER</p>
                    <p>Asset Description: PLACEHOLDER IMAGE</p>
                    <p>Asset Type: Decal</p>
                    <p>Asset Creator: MORBLOX (ID: 1)</p>
                    <button class="bluebutton">Accept</button>
                    <button class="bluebutton">Decline</button>
                    <button class="redbutton">Warn User</button>
                    <button class="redbutton">Ban/Terminate User</button>
                </div>
            </div>
        </div>
    </div>
    <div id="Reports">
        <h2>Reports</h2>
        <p><input type="text" placeholder="Search..."><button class="bluebutton">Search by Game Name/Id</button> <button class="bluebutton">Search by Username/Id</button></p>
        <div id="ReportsContainer">
            <div class="ProfileContainerBox" id="ProfileContainerBox1">
                <div id="ProfileContainerBox1ImageContainer">
                    <img alt="Asset Image" src="https://morblox.us/img/reviewpending.png" width="60px" height="100%">
                </div>
                <div id="ProfileContainerBox1TextContainer">
                    <p>Reporting: Game</p>
                    <p>Report Sender: MORBLOX (USERID: 1)</p>
                    <p>Game: MORBLOX's Place (GAMEID: 1)</p>
                    <p>Game Creator: MORBLOX (USERID: 1)</p>
                    <p>Reason: Racial/Homophobic Slurs</p>
                    <p>Comments: Has the N Word in it.</p>
                    <button class="greenbutton">Open Game In Studio</button>
                    <button class="greybutton">Warn Report Sender</button>
                    <button class="redbutton">Delete Game</button>
                    <button class="redbutton">Ban/Terminate Game Creator</button>
                </div>
            </div>
            <div class="ProfileContainerBox" id="ProfileContainerBox1">
                <div id="ProfileContainerBox1ImageContainer">
                    <img alt="Asset Image" src="https://morblox.us/img/reviewpending.png" width="60px" height="100%">
                </div>
                <div id="ProfileContainerBox1TextContainer">
                    <p>Reporting: Player</p>
                    <p>Report Sender: MORBLOX (USERID: 1)</p>
                    <p>Player: Thomas (USERID: 3)</p>
                    <p>Inviter: SYSTEM (USERID: 0)</p>
                    <p>Reason: Harrassment</p>
                    <p>Comments: Said "It's Morbin Time"</p>
                    <button class="bluebutton">View Chat Logs</button>
                    <button class="greybutton">Warn Report Sender</button>
                    <button class="redbutton">Warn Player</button>
                    <button class="redbutton">Ban/Terminate Player</button>
                </div>
            </div>
        </div>
    <div id="ModLogs">
        <h2>Moderation Logs</h2>
        <p><input type="text" placeholder="Search..."><button class="bluebutton">Search by Reason</button> <button class="bluebutton">Search by Moderator</button></p>
        <div id="ModLogsContainer">
            <div class="ProfileContainerBox" id="ProfileContainerBox1">
                <div id="ProfileContainerBox1TextContainer">
                    <p>Moderator: Thomas (ID: 3)</p>
                    <p>Player: skeuomorphism hater (ID: ??)</p>
                    <p>Inviter: skeuomorphism lover (ID: ??)</p>
                    <p>Punishment: Termination, Disabling invites for Inviter</p>
                    <p>Reason: Being mean :(</p>
                    <button class="greybutton">View Original Report</button>
                    <button class="greybutton">View Proof</button>
                    <button class="redbutton">Undo Invite Ban for Inviter</button>
                    <button class="redbutton">Undo Ban/Termination</button>
                </div>
            </div>
        </div>
    </div>
    <div id="GameServers">
        <h2>Game Servers</h2>
        <p><input type="text" placeholder="Search..."><button class="bluebutton">Search by Game Name</button></p>
        <div id="ModLogsContainer">
            <p>There are no running game servers!</p>
        </div>
    </div>
</div>
@endsection
