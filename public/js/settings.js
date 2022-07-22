var active = 0;

function openPopup(id) {
    document.querySelector('.popupcontainer').removeAttribute('id');

    switch (id) {
        case 1:
            active = 1;
            setActiveSetting(1);
            document.querySelector('.popup .username_change').removeAttribute('id');
            document.querySelector('.popup #heading').innerHTML = "Change Username";
            document.querySelector('.popup .warningtext').innerHTML = "You can only change your username once.";
            document.querySelector('.popup #desc').innerHTML = "Your new username must be from 3-20 characters long.<br>Spaces, periods, and underscores allowed.";
            break;
        case 2:
            active = 2;
            setActiveSetting(2);
            document.querySelector('.popup .email_change').removeAttribute('id');
            document.querySelector('.popup #heading').innerHTML = "Change E-Mail";
            document.querySelector('.popup .warningtext').innerHTML = null;
            document.querySelector('.popup #desc').innerHTML = "Enter your new E-Mail below as well as confirming it.<br>E-Mails are primarily used to reset passwords.";
            break;
        case 3:
            active = 3;
            setActiveSetting(3);
            document.querySelector('.popup .dob_change').removeAttribute('id');
            document.querySelector('.popup #heading').innerHTML = "Change Date of Birth";
            document.querySelector('.popup .warningtext').innerHTML = null;
            document.querySelector('.popup #desc').innerHTML = null;
            break;
        case 4:
            active = 4;
            setActiveSetting(4);
            document.querySelector('.popup .password_change').removeAttribute('id');
            document.querySelector('.popup #heading').innerHTML = "Change Password";
            document.querySelector('.popup .warningtext').innerHTML = "Your password must follow ARCHBLOX's format.";
            document.querySelector('.popup #desc').innerHTML = "Firstly, you need to remember your old password.<br><span style=\"text-align:left\">Your new password must include:<br> <ul style=\"margin-inline-start:2.5em\"><li>8 or more characters</li><li>1 capital letter</li><li>1 symbol</li><li>1 number</li></ul></span>";
            break;
        case 5:
            active = 5;
            setActiveSetting(5);
            document.querySelector('.popup .date_change').removeAttribute('id');
            document.querySelector('.popup #heading').innerHTML = "Change Date Preference";
            document.querySelector('.popup .warningtext').innerHTML = null;
            document.querySelector('.popup #desc').innerHTML = "Change the way you see dates on the site.<br>Default preference is the Australian format (dd/mm/yyyy)";
            break;
        case 6:
            active = 6;
            setActiveSetting(6);
            document.querySelector('.popup .time_change').removeAttribute('id');
            document.querySelector('.popup #heading').innerHTML = "Change Time Preference";
            document.querySelector('.popup .warningtext').innerHTML = null;
            document.querySelector('.popup #desc').innerHTML = "Choose whether 12 hour or 24 hour time is displayed on the site.";
            break;
        default:
            console.error('Invalid setting.');
    }
}

function closePopup() {
    document.querySelector('.popupcontainer').setAttribute("id", "invisible");
    switch (active) {
        case 1:
            document.querySelector('.popup .username_change').setAttribute("id", "invisible");
            break;
        case 2:
            document.querySelector('.popup .email_change').setAttribute("id", "invisible");
            break;
        case 3:
            document.querySelector('.popup .dob_change').setAttribute("id", "invisible");
            break;
        case 4:
            document.querySelector('.popup .password_change').setAttribute("id", "invisible");
            break;
        case 5:
            document.querySelector('.popup .date_change').setAttribute("id", "invisible");
            break;
        case 6:
            document.querySelector('.popup .time_change').setAttribute("id", "invisible");
            break;
        default:
            console.error('Invalid setting.');
    }
}

function setActiveSetting(id) {
    document.querySelector('.popup #activeSetting').setAttribute("value", id);
}