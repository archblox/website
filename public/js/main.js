window.addEventListener('resize', function() {
    var logo_full = document.getElementById("logo_full")
    var logo_small = document.getElementById("logo_small")
    var smallbtn0 = document.getElementById("smallbtn0")
    var smallbtn2 = document.getElementById("smallbtn2")
    var smallbtn3 = document.getElementById("smallbtn3")
    var smallbtn1 = document.getElementById("smallbtn4")
    var smallbtn5 = document.getElementById("smallbtn5")
    var navbarusername = document.getElementById("navbarusername")
    var viewport_width = window.innerWidth;
    if (viewport_width < 900) {
        logo_full.className = "invisible";
        logo_small.className = "";
    } else {
        logo_small.className = "invisible";
        logo_full.className = "";
    }
    if (viewport_width < 730) {
        smallbtn2.className = "invisible";
        smallbtn3.className = "invisible";
    } else {
        smallbtn2.className = "navbarbutton";
        smallbtn3.className = "navbarbutton";
    }
    if (viewport_width < 564    ) {
        smallbtn0.className = "invisible";
        smallbtn1.className = "invisible";
    } else {
        smallbtn0.className = "navbarbutton";
        smallbtn1.className = "navbarbutton";
    }
    if (viewport_width < 400) {
        smallbtn5.className = "invisible";
    } else {
        smallbtn5.className = "navbarbutton";
    }
    if (viewport_width < 360) {
        navbarusername.className = "invisible";
    } else {
        navbarusername.className = "nonbolded";
    }

});
window.onload = function() {
    var logo_full = document.getElementById("logo_full")
    var logo_small = document.getElementById("logo_small")
    var smallbtn0 = document.getElementById("smallbtn0")
    var smallbtn2 = document.getElementById("smallbtn2")
    var smallbtn3 = document.getElementById("smallbtn3")
    var smallbtn1 = document.getElementById("smallbtn4")
    var smallbtn5 = document.getElementById("smallbtn5")
    var navbarusername = document.getElementById("navbarusername")
    var viewport_width = window.innerWidth;
    if (viewport_width < 900) {
        logo_full.className = "invisible";
        logo_small.className = "";
    } else {
        logo_small.className = "invisible";
        logo_full.className = "";
    }
    if (viewport_width < 730) {
        smallbtn2.className = "invisible";
        smallbtn3.className = "invisible";
    } else {
        smallbtn2.className = "navbarbutton";
        smallbtn3.className = "navbarbutton";
    }
    if (viewport_width < 564) {
        smallbtn0.className = "invisible";
        smallbtn1.className = "invisible";
    } else {
        smallbtn0.className = "navbarbutton";
        smallbtn1.className = "navbarbutton";
    }
    if (viewport_width < 400) {
        smallbtn5.className = "invisible";
    } else {
        smallbtn5.className = "navbarbutton";
    }
    if (viewport_width < 360) {
        navbarusername.className = "invisible";
    } else {
        navbarusername.className = "nonbolded";
    }
}; 