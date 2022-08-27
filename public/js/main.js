function openStudioPopup(placeid) {
    document.querySelector('.popupcontainer_studio').removeAttribute('id');
    window.location.href = "archbloxstudio://";
}
function closeStudioPopup() {
    document.querySelector('.popupcontainer_studio').setAttribute("id", "invisible");
}