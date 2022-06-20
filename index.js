window.addEventListener('resize', function() {
    var logo_full = document.getElementById("logo_full")
    var logo_small = document.getElementById("logo_small")
    var smallbtn = document.getElementById("smallbtn1")
    var smallbtn0 = document.getElementById("smallbtn0")
    var smallbtn2 = document.getElementById("smallbtn2")
    var smallbtn3 = document.getElementById("smallbtn3")
    var smallbtn1 = document.getElementById("smallbtn4")
    var smallbtn5 = document.getElementById("smallbtn5")
    var viewport_width = window.innerWidth;
    if (viewport_width < 900) {
        logo_full.className = "invisible";
        logo_small.className = "";
    } else {
        logo_small.className = "invisible";
        logo_full.className = "";
    }
    if (viewport_width < 600) {
        smallbtn.className = "invisible";
        smallbtn2.className = "invisible";
        smallbtn3.className = "invisible";
    } else {
        smallbtn.className = "navbarbutton";
        smallbtn2.className = "navbarbutton";
        smallbtn3.className = "navbarbutton";
    }
    if (viewport_width < 425) {
        smallbtn0.className = "invisible";
        smallbtn1.className = "invisible";
    } else {
        smallbtn0.className = "navbarbutton";
        smallbtn1.className = "navbarbutton";
    }
    if (viewport_width < 280) {
        smallbtn5.className = "invisible";
    } else {
        smallbtn5.className = "navbarbutton";
    }
});
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
    var logo_full = document.getElementById("logo_full")
    var logo_small = document.getElementById("logo_small")
    var smallbtn = document.getElementById("smallbtn1")
    var smallbtn0 = document.getElementById("smallbtn0")
    var smallbtn2 = document.getElementById("smallbtn2")
    var smallbtn3 = document.getElementById("smallbtn3")
    var smallbtn1 = document.getElementById("smallbtn4")
    var smallbtn5 = document.getElementById("smallbtn5")
    var viewport_width = window.innerWidth;
    if (viewport_width < 900) {
        logo_full.className = "invisible";
        logo_small.className = "";
    } else {
        logo_small.className = "invisible";
        logo_full.className = "";
    }
    if (viewport_width < 600) {
        smallbtn.className = "invisible";
        smallbtn2.className = "invisible";
        smallbtn3.className = "invisible";
    } else {
        smallbtn.className = "navbarbutton";
        smallbtn2.className = "navbarbutton";
        smallbtn3.className = "navbarbutton";
    }
    if (viewport_width < 425) {
        smallbtn0.className = "invisible";
        smallbtn1.className = "invisible";
    } else {
        smallbtn0.className = "navbarbutton";
        smallbtn1.className = "navbarbutton";
    }
    if (viewport_width < 280) {
        smallbtn5.className = "invisible";
    } else {
        smallbtn5.className = "navbarbutton";
    }
    var alert = document.getElementById("alert")
    var alerttext = document.getElementById("alerttext")
    if (window.location.hostname == "") {   
        alerttext.innerHTML = "You are using this locally.";
        alert.className = "";
    } else if (window.location.hostname == "thomasluigi07.github.io") {
        alerttext.innerHTML = "You are using this on the github pages site.";
        alert.className = "";
    } else if (window.location.hostname == "MORBLOX.com") {
            alerttext.innerHTML = "You are using MORBLOX.com";
            alert.className = "";
    } else if (window.location.hostname == "morblox.us") {
        alerttext.innerHTML = "You are using morblox.us";
        alert.className = "";
    } else {
        alerttext.innerHTML = `You are using an unknown site (${window.location.hostname})`;
        alert.className = "";
    }
    var usernamecontainer = document.getElementById("UsernameContainer");
    var username = localStorage.getItem("username");
    if (username == null) {
        username = ""
    }
    usernamecontainer.innerHTML = "Your username is: " + username
    document.getElementById('UsernameButton').onclick = function() {
        var usernameset = document.getElementById("UsernameSet").value;
        var usernamecontainer = document.getElementById("UsernameContainer");
        localStorage.setItem("username",usernameset);
        usernamecontainer.innerHTML = "Your username is: " + usernameset
     };
}; 