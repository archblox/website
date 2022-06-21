
window.onload = function() {
    var logo = document.getElementById("logo_signup")
    var privacytext = document.getElementById("privacytext")
    var username = localStorage.getItem("username");
    if (username == "") {
        logo.innerHTML = "<a href=\"index.html\"><img alt=\"MORBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's MORBLOX time.</p>"
        privacytext.innerHTML = "<a href=\"privacy_signup.html\">Privacy Policy</a> <a href=\"tos_signup.html\">Terms of Service</a>"
    } else if (username == null) {
        logo.innerHTML = "<a href=\"index.html\"><img alt=\"MORBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's MORBLOX time.</p>"
        privacytext.innerHTML = "<a href=\"privacy_signup.html\">Privacy Policy</a> <a href=\"tos_signup.html\">Terms of Service</a>"
    } else {
        logo.innerHTML = "<a href=\"home.html\"><img alt=\"MORBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's MORBLOX time.</p>"
        privacytext.innerHTML = "<a href=\"privacy.html\">Privacy Policy</a> <a href=\"tos.html\">Terms of Service</a>"
    }
};