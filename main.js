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