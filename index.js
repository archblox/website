window.onload = function() {
    var morblox = document.getElementById("morblox")
    if (window.location.hostname == "") {   
        morblox.className = "";
    } else if (window.location.hostname == "thomasluigi07.github.io") {
        morblox.className = "";
    } else if (window.location.hostname == "MORBLOX.com") {
            morblox.className = "";
    } else if (window.location.hostname == "morblox.us") {
        morblox.className = "invisible";
    } else {
        morblox.className = "";
    }
};