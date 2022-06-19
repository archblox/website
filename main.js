window.addEventListener('resize', function() {
    var logo_full = document.getElementById("logo_full")
    var logo_small = document.getElementById("logo_small")
    var viewport_width = window.innerWidth;
    if (viewport_width < 700) {
        logo_full.className = "invisible";
        logo_small.className = "";
    } else {
        logo_small.className = "invisible";
        logo_full.className = "";
    }
});
window.onload = function() {
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
};