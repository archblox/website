// Detect if user is on an older domain that isn't recommended.

function addWarning() {
    let alertDiv = document.createElement("div");
    alertDiv.innerHTML = "You are on an unsupported version of the site. Please go to <a href='https://archblox.com'>archblox.com</a> instead.";
    alertDiv.setAttribute("id","alert");
    document.body.appendChild(alertDiv);
}

if (window.document.location.hostname == "archblox.com") {} else {
    addWarning();
}