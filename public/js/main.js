function openStudioPopup(placeid) {
    document.querySelector('.popupcontainer_studio').removeAttribute('id');
    window.location.href = "archbloxstudio://";
}
function closeStudioPopup() {
    document.querySelector('.popupcontainer_studio').setAttribute("id", "invisible");
}
function openClientPopup(ip,port,placefile,mode) {
    // launch client
    document.querySelector('.popupcontainer_client').removeAttribute('id');
    if (mode == "host") {
        // user is hosting, use port and place file
        window.location.href = "archblox://host/" + port + ":" + placefile;
    } else if (mode == "join") {
        // user is joining a game, use ip and port
        window.location.href = "archblox://join/" + port + ":" + ip;
    } else if (mode == "hostandjoin") {
        // user is hosting and joining their own game, use everything
        window.location.href = "archblox://host/" + port + ":" + placefile;
        setTimeout(function(){
            window.location.href = "archblox://join/" + port + ":" + ip;
        },500);
    } else {
        // no information so just use the default
        window.location.href = "archblox://";
    }
}
function closeClientPopup() {
    document.querySelector('.popupcontainer_client').setAttribute("id", "invisible");
}