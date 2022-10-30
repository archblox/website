// Detect if user is on an older domain that isn't recommended.

function addWarning() {
    let alertDiv = document.createElement("div");
    alertDiv.innerHTML = "You are on an unsupported url of the site. Please go to <a href='https://archblox.com'>archblox.com</a> instead.";
    alertDiv.setAttribute("id","alert");
    document.body.appendChild(alertDiv);
}

if (window.location.href == "https://archblox.com" || window.location.href == "http://archblox.com" || window.location.href == "https://archblox.com/" || window.location.href == "http://archblox.com/") {} else {
    addWarning();
}