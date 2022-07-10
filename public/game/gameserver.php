<?php

header("content-type:text/plain");

$port = addslashes($_GET["port"]);
ob_start();
?>
game:Load('rbxasset://temp.rbxl')
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
local Port = <?php echo $port ; ?>
Server = game:GetService("NetworkServer")
RunService = game:GetService("RunService")
Server:start(Port, 20)
game:GetService("Visit")
RunService:run()
function onJoined(newPlayer)
print ("An new connection was accepted.")
newPlayer:LoadCharacter()
while true do 
wait(0.001) 
if newPlayer.Character.Humanoid.Health == 0
then print ("Player died") wait(5) newPlayer:LoadCharacter() print("Player respawned")
elseif newPlayer.Character.Parent == nil then wait(5) newPlayer:LoadCharacter() -- to make sure nobody is deleted.
end
end
end

game.Players.PlayerAdded:connect(onJoined)
<?php
$data = ob_get_clean();
$signature;
$key = file_get_contents("../GameRBLX/PrivKey.pem");
openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA1);
echo "" . sprintf("%%%s%%%s", base64_encode($signature), $data);
?>