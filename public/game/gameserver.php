<?php

header("content-type:text/plain");

$port = addslashes($_GET["port"]);
$rbxl = addslashes($_GET["rbxl"]);

ob_start();
?>
-- Start Game Script Arguments

------------------- UTILITY FUNCTIONS --------------------------

local cdnSuccess = 0
local cdnFailure = 0

function waitForChild(parent, childName)
	while true do
		local child = parent:findFirstChild(childName)
		if child then
			return child
		end
		parent.ChildAdded:wait()
	end
end

-- returns the player object that killed this humanoid
-- returns nil if the killer is no longer in the game
function getKillerOfHumanoidIfStillInGame(humanoid)

	-- check for kill tag on humanoid - may be more than one - todo: deal with this
	local tag = humanoid:findFirstChild("creator")

	-- find player with name on tag
	if tag then
		local killer = tag.Value
		if killer.Parent then -- killer still in game
			return killer
		end
	end

	return nil
end
-----------------------------------END UTILITY FUNCTIONS -------------------------

-----------------------------------"CUSTOM" SHARED CODE----------------------------------

pcall(function() settings().Network.UseInstancePacketCache = true end)
pcall(function() settings().Network.UsePhysicsPacketCache = true end)
pcall(function() settings()["Task Scheduler"].PriorityMethod = Enum.PriorityMethod.AccumulatedError end)


settings().Network.PhysicsSend = Enum.PhysicsSendMethod.TopNErrors
settings().Network.ExperimentalPhysicsEnabled = true
settings().Network.WaitingForCharacterLogRate = 100
pcall(function() settings().Diagnostics:LegacyScriptMode() end)

-----------------------------------START GAME SHARED SCRIPT------------------------------

-- establish this peer as the Server
local ns = game:GetService("NetworkServer")

local badgeUrlFlagExists, badgeUrlFlagValue = pcall(function () return settings():GetFFlag("NewBadgeServiceUrlEnabled") end)
local newBadgeUrlEnabled = badgeUrlFlagExists and badgeUrlFlagValue
if url~=nil then
	local url = "http://www.morblox.us"

	pcall(function() game:GetService("Players"):SetAbuseReportUrl(url .. "/AbuseReport/InGameChatHandler.ashx") end)
	pcall(function() game:GetService("ScriptInformationProvider"):SetAssetUrl(url .. "/Asset/") end)
	pcall(function() game:GetService("ContentProvider"):SetBaseUrl(url .. "/") end)
	pcall(function() game:GetService("Players"):SetChatFilterUrl(url .. "/Game/ChatFilter.ashx") end)
	
	if gameCode then
		game:SetVIPServerId(tostring(gameCode))
	end

	game:GetService("BadgeService"):SetPlaceId(1818)
	game:SetPlaceId(1818)
	game:SetCreatorId(123891239128398123)


	if newBadgeUrlEnabled then
		game:GetService("BadgeService"):SetAwardBadgeUrl(apiProxyUrl .. "/assets/award-badge?userId=%d&badgeId=%d&placeId=%d")
	end

	if access~=nil then
		if not newBadgeUrlEnabled then
			game:GetService("BadgeService"):SetAwardBadgeUrl(url .. "/Game/Badge/AwardBadge.ashx?UserID=%d&BadgeID=%d&PlaceID=%d&" .. access)
		end

		game:GetService("BadgeService"):SetHasBadgeUrl(url .. "/Game/Badge/HasBadge.ashx?UserID=%d&BadgeID=%d&" .. access)
		game:GetService("BadgeService"):SetIsBadgeDisabledUrl(url .. "/Game/Badge/IsBadgeDisabled.ashx?BadgeID=%d&PlaceID=%d&" .. access)

		game:GetService("FriendService"):SetMakeFriendUrl(url .. "/Game/CreateFriend?firstUserId=%d&secondUserId=%d")
		game:GetService("FriendService"):SetBreakFriendUrl(url .. "/Game/BreakFriend?firstUserId=%d&secondUserId=%d")
		game:GetService("FriendService"):SetGetFriendsUrl(url .. "/Game/AreFriends?userId=%d")
	end
	game:GetService("BadgeService"):SetIsBadgeLegalUrl("")
	game:GetService("InsertService"):SetBaseSetsUrl(url .. "/Game/Tools/InsertAsset.ashx?nsets=10&type=base")
	game:GetService("InsertService"):SetUserSetsUrl(url .. "/Game/Tools/InsertAsset.ashx?nsets=20&type=user&userid=%d")
	game:GetService("InsertService"):SetCollectionUrl(url .. "/Game/Tools/InsertAsset.ashx?sid=%d")
	game:GetService("InsertService"):SetAssetUrl(url .. "/Asset/?id=%d")
	game:GetService("InsertService"):SetAssetVersionUrl(url .. "/Asset/?assetversionid=%d")
	
	pcall(function() loadfile(url .. "/Game/LoadPlaceInfo.ashx?PlaceId=" .. placeId)() end)
	
	pcall(function() 
				if access then
					loadfile(url .. "/Game/PlaceSpecificScript.ashx?PlaceId=" .. placeId .. "&" .. access)()
				end
			end)
end

pcall(function() game:GetService("NetworkServer"):SetIsPlayerAuthenticationRequired(true) end)
settings().Diagnostics.LuaRamLimit = 0



if placeId~=nil and killID~=nil and deathID~=nil and url~=nil then
	-- listen for the death of a Player
	function createDeathMonitor(player)
		-- we don't need to clean up old monitors or connections since the Character will be destroyed soon
		if player.Character then
			local humanoid = waitForChild(player.Character, "Humanoid")
			humanoid.Died:connect(
				function ()
					onDied(player, humanoid)
				end
			)
		end
	end

	-- listen to all Players' Characters
	game:GetService("Players").ChildAdded:connect(
		function (player)
			createDeathMonitor(player)
			player.Changed:connect(
				function (property)
					if property=="Character" then
						createDeathMonitor(player)
					end
				end
			)
		end
	)
end

game:GetService("Players").PlayerAdded:connect(function(player)
	
	print("Player " .. player.userId .. " added")
	
	if url and access and placeId and player and player.userId then
		game:HttpGet(url .. "/Game/ClientPresence.ashx?action=connect&" .. access .. "&PlaceID=" .. placeId .. "&UserID=" .. player.userId)
		game:HttpPost(url .. "/Game/PlaceVisit.ashx?UserID=" .. player.userId .. "&AssociatedPlaceID=" .. placeId .. "&" .. access, "")
	end
end)


game:GetService("Players").PlayerRemoving:connect(function(player)
	print("Player " .. player.userId .. " leaving")	

	if url and access and placeId and player and player.userId then
		game:HttpGet(url .. "/Game/ClientPresence.ashx?action=disconnect&" .. access .. "&PlaceID=" .. placeId .. "&UserID=" .. player.userId)
	end
end)

-- Now start the connection
game:Load("rbxasset://<?php echo $rbxl; ?>")
-- fix asset ids
local assetPropertyNames = {"Texture", "TextureId", "SoundId", "MeshId", "SkyboxUp", "SkyboxLf", "SkyboxBk", "SkyboxRt", "SkyboxFt", "SkyboxDn", "PantsTemplate", "ShirtTemplate", "Graphic", "Frame", "ImageLabel", "GuiMain", "Image", "LinkedSource", "AnimationId"}
local variations = {"http://www%.roblox%.com/asset/%?id=", "http://www%.roblox%.com/asset%?id=", "http://%.roblox%.com/asset/%?id=", "http://%.roblox%.com/asset%?id="}

function GetDescendants(o)
	local allObjects = {}
	function FindChildren(Object)
		for _,v in pairs(Object:GetChildren()) do
			table.insert(allObjects,v)
			FindChildren(v)
		end
	end
	FindChildren(o)
	return allObjects
end

local replacedProperties = 0--Amount of properties changed
local replacedSourceCodes = 0

for i, v in pairs(GetDescendants(game)) do
	if v.ClassName == 'Script' or v.ClassName == 'LocalScript' then
		local SourceCode = v.Source
		if SourceCode then
			for _, variation in pairs(variations) do
				local String, Number = string.gsub(SourceCode, variation, "http://www%.morblox%.us/asset/%?id=")
				SourceCode = String
				if Number > 0 then
					replacedSourceCodes = replacedSourceCodes + Number
				end
			end
			v.Source = SourceCode
		end
	end
	for _, property in pairs(assetPropertyNames) do
		pcall(function()
			if v[property] and not v:FindFirstChild(property) then --Check for property, make sure we're not getting a child instead of a property
				assetText = string.lower(v[property])
				for _, variation in pairs(variations) do
					v[property], matches = string.gsub(assetText, variation, "http://www%.morblox%.us/asset/%?id=")
					if matches > 0 then
						replacedProperties = replacedProperties + 1
						print("Replaced " .. property .. " asset link for " .. v.Name)
						break
					end
				end
			end
		end)
	end
end

print("Updated " .. replacedProperties .. " AssetIds")
print("Changed " .. replacedSourceCodes .. " lines of code")
-- other stuff
ns:Start(<?php echo $port; ?>, sleeptime)  
pcall(function() game.LocalSaveEnabled = true end)

-- StartGame --
Game:GetService("RunService"):Run()
<?php
$data = ob_get_clean();
$signature;
$key = file_get_contents("../GameRBLX/PrivKey.pem");
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "" . sprintf("%%%s%%%s", base64_encode($signature), $data);
?>