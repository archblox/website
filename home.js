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
    if (viewport_width < 1000) {
        logo_full.className = "invisible";
        logo_small.className = "";
    } else {
        logo_small.className = "invisible";
        logo_full.className = "";
    }
    if (viewport_width < 860) {
        smallbtn.className = "invisible";
        smallbtn2.className = "invisible";
        smallbtn3.className = "invisible";
    } else {
        smallbtn.className = "navbarbutton";
        smallbtn2.className = "navbarbutton";
        smallbtn3.className = "navbarbutton";
    }
    if (viewport_width < 660) {
        smallbtn0.className = "invisible";
        smallbtn1.className = "invisible";
    } else {
        smallbtn0.className = "navbarbutton";
        smallbtn1.className = "navbarbutton";
    }
    if (viewport_width < 510) {
        smallbtn5.className = "invisible";
    } else {
        smallbtn5.className = "navbarbutton";
    }
});
window.onload = function() {
    var username = localStorage.getItem("username");
    var usernamecontainer = document.getElementById("usernameframe")
    if (username == null) {
        usernamecontainer.innerHTML = `Not signed in.`
    } else if (username == "") {
        usernamecontainer.innerHTML = `Not signed in.`
    } else {
        usernamecontainer.innerHTML = `Hello, ${username}!`
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
    if (viewport_width < 1000) {
        logo_full.className = "invisible";
        logo_small.className = "";
    } else {
        logo_small.className = "invisible";
        logo_full.className = "";
    }
    if (viewport_width < 860) {
        smallbtn.className = "invisible";
        smallbtn2.className = "invisible";
        smallbtn3.className = "invisible";
    } else {
        smallbtn.className = "navbarbutton";
        smallbtn2.className = "navbarbutton";
        smallbtn3.className = "navbarbutton";
    }
    if (viewport_width < 660) {
        smallbtn0.className = "invisible";
        smallbtn1.className = "invisible";
    } else {
        smallbtn0.className = "navbarbutton";
        smallbtn1.className = "navbarbutton";
    }
    if (viewport_width < 510) {
        smallbtn5.className = "invisible";
    } else {
        smallbtn5.className = "navbarbutton";
    }
    var username = localStorage.getItem("username");
    var navbarsignedincontainer = document.getElementById("navbarsignedincontainer");
    var navbarusername = document.getElementById("navbarusername");
    var navbarlogincontainer = document.getElementById("navbarlogincontainer");
    if (username == null) {
        username = ""
        navbarsignedincontainer.className = "invisible"
        navbarlogincontainer.className = ""
    } else if (username == "") {
        username = ""
        navbarsignedincontainer.className = "invisible"
        navbarlogincontainer.className = ""
    } else {
        navbarsignedincontainer.className = ""
        navbarlogincontainer.className = "invisible"
    }
    navbarusername.innerHTML = `Logged in as: ${username} <a href=\"logout.html\">Log out...</a>`;
};