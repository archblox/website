window.addEventListener('resize', function() {
    var logo_full = document.getElementById("logo_full")
    var logo_small = document.getElementById("logo_small")
    var BuildBtn = document.getElementById("smallbtn0")
    var ProfileBtn = document.getElementById("smallbtn2")
    var SettingsBtn = document.getElementById("smallbtn3")
    var CatalogBtn = document.getElementById("smallbtn4")
    var GameBtn = document.getElementById("smallbtn5")
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
        BuildBtn.className = "invisible";
        CatalogBtn.className = "invisible";
    } else {
        BuildBtn.className = "navbarbutton";
        CatalogBtn.className = "navbarbutton";
    }
    if (viewport_width < 564    ) {
        GameBtn.className = "invisible";
        ProfileBtn.className = "invisible";
    } else {
        GameBtn.className = "navbarbutton";
        ProfileBtn.className = "navbarbutton";
    }
    if (viewport_width < 400) {
        SettingsBtn.className = "invisible";
    } else {
        SettingsBtn.className = "navbarbutton";
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
    var BuildBtn = document.getElementById("smallbtn0")
    var ProfileBtn = document.getElementById("smallbtn2")
    var SettingsBtn = document.getElementById("smallbtn3")
    var CatalogBtn = document.getElementById("smallbtn4")
    var GameBtn = document.getElementById("smallbtn5")
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
        BuildBtn.className = "invisible";
        CatalogBtn.className = "invisible";
    } else {
        BuildBtn.className = "navbarbutton";
        CatalogBtn.className = "navbarbutton";
    }
    if (viewport_width < 564    ) {
        GameBtn.className = "invisible";
        ProfileBtn.className = "invisible";
    } else {
        GameBtn.className = "navbarbutton";
        ProfileBtn.className = "navbarbutton";
    }
    if (viewport_width < 400) {
        SettingsBtn.className = "invisible";
    } else {
        SettingsBtn.className = "navbarbutton";
    }
    if (viewport_width < 360) {
        navbarusername.className = "invisible";
    } else {
        navbarusername.className = "nonbolded";
    }
}; 