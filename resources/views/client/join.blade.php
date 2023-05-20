@php

header("content-type:text/plain");

/*$username = addslashes($_GET["username"]);
$ip = addslashes($_GET["ip"]);
$port = addslashes($_GET["port"]);
$id = addslashes($_GET["id"]);
$app = addslashes($_GET["app"]);*/

$authorised = 0;

if (Auth::check()) {
	$username = addslashes(Auth::user()->name);
	$authorised = 1;
	$id = addslashes(Auth::id());
	$app = 'http://jarfeh.xyz/Asset/CharacterFetch.ashx?userId=' . addslashes(Auth::id());
} else {
	$randName = mt_rand(1, 9999);
	$username = "Guest " . $randName;
	$authorised = 0;
	$id = mt_rand(1000, 9999);
	$app = 'http://jarfeh.xyz/Asset/CharacterFetch.ashx?userId=0';
}
$ip = addslashes($_GET["ip"]);
$port = addslashes($_GET["port"]);

ob_start();
@endphp

-- functions --------------------------
function onPlayerAdded(player)
	-- override
end

pcall(function() game:SetPlaceID(-1, false) end)

local startTime = tick()
local connectResolved = false
local loadResolved = false
local joinResolved = false
local playResolved = true
local playStartTime = 0

local cdnSuccess = 0
local cdnFailure = 0

settings()["Game Options"].CollisionSoundEnabled = true
pcall(function() settings().Rendering.EnableFRM = true end)
pcall(function() settings().Physics.Is30FpsThrottleEnabled = false end)
pcall(function() settings()["Task Scheduler"].PriorityMethod = Enum.PriorityMethod.AccumulatedError end)
pcall(function() settings().Physics.PhysicsEnvironmentalThrottle = Enum.EnviromentalPhysicsThrottle.DefaultAuto end)

local threadSleepTime = ...

if threadSleepTime==nil then
	threadSleepTime = 15
end

local test = true

local closeConnection = game.Close:connect(function() 
	if 0 then
		if not connectResolved then
			local duration = tick() - startTime;
		elseif (not loadResolved) or (not joinResolved) then
			local duration = tick() - startTime;
			if not loadResolved then
				loadResolved = true
			end
			if not joinResolved then
				joinResolved = true
			end
		elseif not playResolved then
			playResolved = true
		end
	end
end)

game:GetService("ChangeHistoryService"):SetEnabled(false)
game:GetService("ContentProvider"):SetThreadPool(16)
pcall(function() game:GetService("InsertService"):SetBaseSetsUrl("http://www.jarfeh.xyz/Game/Tools/InsertAsset.ashx?nsets=10&type=base") end)
pcall(function() game:GetService("InsertService"):SetUserSetsUrl("http://www.jarfeh.xyz/Game/Tools/InsertAsset.ashx?nsets=20&type=user&userid=%d") end)
pcall(function() game:GetService("InsertService"):SetCollectionUrl("http://www.jarfeh.xyz/Game/Tools/InsertAsset.ashx?sid=%d") end)
pcall(function() game:GetService("InsertService"):SetAssetUrl("http://www.jarfeh.xyz/asset/?id=%d") end)
pcall(function() game:GetService("InsertService"):SetAssetVersionUrl("http://www.jarfeh.xyz/asset/?id=%d") end)

pcall(function() game:GetService("SocialService"):SetFriendUrl("http://www.jarfeh.xyz/Game/LuaWebService/HandleSocialRequest.ashx?method=IsFriendsWith&playerid=%d&userid=%d") end)
pcall(function() game:GetService("SocialService"):SetBestFriendUrl("http://www.jarfeh.xyz/Game/LuaWebService/HandleSocialRequest.ashx?method=IsBestFriendsWith&playerid=%d&userid=%d") end)
pcall(function() game:GetService("SocialService"):SetGroupUrl("http://www.jarfeh.xyz/Game/LuaWebService/HandleSocialRequest.ashx?method=IsInGroup&playerid=%d&groupid=%d") end)
pcall(function() game:GetService("SocialService"):SetGroupRankUrl("http://www.jarfeh.xyz/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRank&playerid=%d&groupid=%d") end)
pcall(function() game:GetService("SocialService"):SetGroupRoleUrl("http://www.jarfeh.xyz/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRole&playerid=%d&groupid=%d") end)
pcall(function() game:GetService("GamePassService"):SetPlayerHasPassUrl("http://www.jarfeh.xyz/Game/GamePass/GamePassHandler.ashx?Action=HasPass&UserID=%d&PassID=%d") end)
pcall(function() game:GetService("MarketplaceService"):SetProductInfoUrl("https://api.jarfeh.xyz/marketplace/productinfo?assetId=%d") end)
pcall(function() game:GetService("MarketplaceService"):SetPlayerOwnsAssetUrl("https://api.jarfeh.xyz/ownership/hasasset?userId=%d&assetId=%d") end)
pcall(function() game:SetCreatorID(0, Enum.CreatorType.User) end)

pcall(function() game:GetService("Players"):SetChatStyle(Enum.ChatStyle.ClassicAndBubble) end)

local waitingForCharacter = false

pcall( function()
	if settings().Network.MtuOverride == 0 then
	  settings().Network.MtuOverride = 1400
	end
end)


client = game:GetService("NetworkClient")
visit = game:GetService("Visit")

function setMessage(message)
	-- todo: animated "..."
	if not false then
		game:SetMessage(message)
	else
		-- hack, good enought for now
		game:SetMessage("Teleporting ...")
	end
end

-- Check if client is not logged in
--if "<?php echo $authorised; ?>" == "0" then
--	setMessage("You are not logged in. (ID: 400)", "Kick", "Kick")
--	error("Not logged in")
--end

function showErrorWindow(message, errorType, errorCategory)
	game:SetMessage(message)
end

-- called when the client connection closes
function onDisconnection(peer, lostConnection)
	if lostConnection then
		showErrorWindow("You have lost connection  (ID: 200)", "LostConnection", "LostConnection")
	else
		showErrorWindow("This game has been shut down (ID: 210)", "Kick", "Kick")
	end
end

function requestCharacter(replicator)
	
	-- prepare code for when the Character appears
	local connection
	connection = player.Changed:connect(function (property)
		if property=="Character" then
			game:ClearMessage()
			waitingForCharacter = false
			
			connection:disconnect()
		
			if 0 then
				if not joinResolved then
					local duration = tick() - startTime;
					joinResolved = true
					
					playStartTime = tick()
					playResolved = false
				end
			end
		end
	end)
	
	setMessage("Requesting server...")
	
	local success, err = pcall(function()	
		replicator:RequestCharacter()
		setMessage("Waiting for server...")
		waitingForCharacter = true
	end)
end

function onConnectionAccepted(url, replicator)
	connectResolved = true

	local waitingForMarker = true
	
	local success, err = pcall(function()	
		if not test then 
		    visit:SetPing("", 300) 
		end
		
		if not false then
			game:SetMessageBrickCount()
		else
			setMessage("Teleporting ...")
		end

		replicator.Disconnection:connect(onDisconnection)
		
		local marker = replicator:SendMarker()
		
		marker.Received:connect(function()
			waitingForMarker = false
			requestCharacter(replicator)
		end)
	end)
	
	if not success then
		return
	end
	
	while waitingForMarker do
		workspace:ZoomToExtents()
		wait(0.5)
	end
end

-- called when the client connection fails
function onConnectionFailed(_, error)
	showErrorWindow("Failed to connect. (ID=" .. error .. ")", "ID" .. error, "Other")
end

-- called when the client connection is rejected
function onConnectionRejected()
	connectionFailed:disconnect()
	showErrorWindow("Your connection has been rejected. (ID: 300)", "WrongVersion", "WrongVersion")
end

pcall(function() settings().Diagnostics:LegacyScriptMode() end)
local success, err = pcall(function()	

	game:SetRemoteBuildMode(true)
	
	setMessage("Joining <?php echo $ip; ?>:<?php echo $port; ?>")
	client.ConnectionAccepted:connect(onConnectionAccepted)
	client.ConnectionRejected:connect(onConnectionRejected)
	connectionFailed = client.ConnectionFailed:connect(onConnectionFailed)
	client.Ticket = ""
	
	playerConnectSucces, player = pcall(function() return client:PlayerConnect(<?php echo $id; ?>, "<?php echo $ip; ?>", <?php echo $port; ?>, 0, threadSleepTime) end)

	if "<?php echo $authorised; ?>" == "0" then
		-- guest
		player:SetSuperSafeChat(true)
		pcall(function() player:SetUnder13(true) end)
		pcall(function() player:SetMembershipType(Enum.MembershipType.None) end)
		pcall(function() player:SetAccountAge(0) end)
	else
		-- user
		player:SetSuperSafeChat(false)
		pcall(function() player:SetUnder13(false) end)
		pcall(function() player:SetMembershipType(Enum.MembershipType.None) end)
		pcall(function() player:SetAccountAge(365) end)
	end
	
	player.Idled:connect(onPlayerIdled)
	
	-- Overriden
	onPlayerAdded(player)

	player.CharacterAppearance = "<?php echo $app; ?>"
	if not test then visit:SetUploadUrl("")end
    player.Name = "<?php echo $username; ?>"
end)

pcall(function() game:SetScreenshotInfo("") end)
@php
$data = ob_get_clean();
$signature;
$key = file_get_contents(asset('GameRBLX/PrivKey.pem'));
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "" . sprintf("%%%s%%%s", base64_encode($signature), $data);
@endphp