window.onload = function() {
    var morblox = document.getElementById("morblox")
    var usernamecontainer = document.getElementById("UsernameContainer");
    if (window.location.hostname == "archblox.com") {
        morblox.className = "invisible";
    } else {
        morblox.className = "";
    }
    if (localStorage.getItem("username") == null) {
        localStorage.setItem("username","");
    } 
    var username = localStorage.getItem("username");
    usernamecontainer.innerHTML = "Saved Username: " + username
    document.getElementById('SaveButton').onclick = function() {
        var usernameset = document.getElementById("UsernameSet").value;
        var usernamecontainer = document.getElementById("UsernameContainer");
        localStorage.setItem("username",usernameset);
        usernamecontainer.innerHTML = "Saved Username: " + usernameset
        alert("Please click on the \"Home\" link or the \"Profile\" link in order to test Username features")
    };
}; 