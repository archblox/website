
window.onload = function() {
    var btnyes = document.getElementById("yes")
    var btnno = document.getElementById("no")
    var ask = document.getElementById("ask")
    var status = document.getElementById("status")
    var logouttext = document.getElementById("loggingout")
    var logo = document.getElementById("logo_signup")
    var username = localStorage.getItem("username");
    status.className = "invisible"
    ask.className = ""
    if (username == "") {
        logo.innerHTML = "<a href=\"index.html\"><img alt=\"ARCHBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's ARCHBLOX time.</p>"
    } else if (username == null) {
        logo.innerHTML = "<a href=\"index.html\"><img alt=\"ARCHBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's ARCHBLOX time.</p>"
    } else {
        logo.innerHTML = "<a href=\"home.html\"><img alt=\"ARCHBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's ARCHBLOX time.</p>"
    }
    btnyes.onclick = function() {
        status.className = ""
        ask.className = "invisible"
        console.log("Clearing data...")
        localStorage.setItem("username","")
        console.log("Cleared data!")
        logo.innerHTML = "<a href=\"index.html\"><img alt=\"ARCHBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's ARCHBLOX time.</p>"
        logouttext.innerHTML = "Logged out successfully! Now, <a href=\"index.html\">click this</a> to go back to the main page."
    }
    btnno.onclick = function() {
        var username = localStorage.getItem("username");
        status.className = ""
        ask.className = "invisible"
        if (username == "") {
            logouttext.innerHTML = "Canceled logout. <a href=\"index.html\">Click here</a> to go back."
            logo.innerHTML = "<a href=\"index.html\"><img alt=\"ARCHBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's ARCHBLOX time.</p>"
        } else if (username == null) {
            logouttext.innerHTML = "Canceled logout. <a href=\"index.html\">Click here</a> to go back."
            logo.innerHTML = "<a href=\"index.html\"><img alt=\"ARCHBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's ARCHBLOX time.</p>"
        } else {
            logouttext.innerHTML = "Canceled logout. <a href=\"home.html\">Click here</a> to go back."
            logo.innerHTML = "<a href=\"home.html\"><img alt=\"ARCHBLOX Logo\" src=\"MORBLOXlogo.png\" width=\"200\" height=\"40\"/></a><p id=\"morbin\">It's ARCHBLOX time.</p>"
        }
    }
};