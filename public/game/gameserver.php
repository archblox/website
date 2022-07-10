<?php

header("content-type:text/plain");

$port = addslashes($_GET["port"]);
$rbxl = addslashes($_GET["rbxl"]);
ob_start();
?>
game:Load('rbxasset://<?php echo $rbxl; ?>')
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

for i, v in pairs(GetDescendants(game)) do
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

print("DONE! Replaced " .. replacedProperties .. " properties")
game:GetService("NetworkServer"):Start(<?php echo $port; ?>) 
game:GetService("RunService"):Run() 
game.Lighting.GlobalShadows = true
game.Players.PlayerAdded:connect(function(plr) 
Player.Changed:connect(function(Property) 
if (Property=="Character") and (Player.Character~=nil) then 
local Character=Player.Character 
local Humanoid=Character:FindFirstChild("Humanoid") 
if (Humanoid~=nil) then 
Humanoid.Died:connect(function() delay(RespawnTime,function() Player:LoadCharacter() LoadCharacterNew(newWaitForChild(Player,"Appearance"),Player.Character,Player.Backpack) end) end) 
end 
end 
end) 
end) 
game.Players.PlayerAdded:connect(onJoined) 
game:GetService("NetworkServer"):Start(<?php echo $port; ?>) 
game:GetService("RunService"):Run() 
game.Lighting.GlobalShadows = true
game.Players.PlayerAdded:connect(function(plr) 
Player.Changed:connect(function(Property) 
if (Property=="Character") and (Player.Character~=nil) then 
local Character=Player.Character 
local Humanoid=Character:FindFirstChild("Humanoid") 
if (Humanoid~=nil) then 
Humanoid.Died:connect(function() delay(RespawnTime,function() Player:LoadCharacter() LoadCharacterNew(newWaitForChild(Player,"Appearance"),Player.Character,Player.Backpack) end) end) 
end 
end 
end) 
end) 
game.Players.PlayerAdded:connect(onJoined) 
<?php
$data = ob_get_clean();
$signature;
$key = file_get_contents("../GameRBLX/PrivKey.pem");
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "" . sprintf("%%%s%%%s", base64_encode($signature), $data);
?>