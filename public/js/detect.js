// warning

console.log("Stop!");
console.log(" ");
console.log("Be cautious of what you entering/pasting in here, as it can be an account token stealer, which can get that person access to your account.");
console.log("Be safe, and be smart.");
console.log(" ");
console.log("If you know what you're doing, have fun then!");
console.log(" ");

// Detect if user is on an older domain that isn't recommended.

function addWarning() {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "You are on an unsupported version of the site. Please go to <a href='https://archblox.com'>archblox.com</a> instead.";
    alertsystemdiv.setAttribute("class","alert warning visible");
    document.body.appendChild(alertsystemdiv);
}

function addDatabaseBackupRestoreWarning() {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "<div class='alert loading visible'>Thanks for playing! We'll be back as soon as I can get a new VPS. (Please don't change settings, message or post anything!)</div>";
    alertsystemdiv.setAttribute("class","alert-system");
    document.body.appendChild(alertsystemdiv);
}

if (window.document.location.hostname == "archblox.com" || window.document.location.hostname == "localhost") {
    console.log("User is on " + window.document.location.hostname + ". Supported URL.");
    addDatabaseBackupRestoreWarning();
} else {
    console.log("User is on " + window.document.location.hostname + ". Unsupported/legacy URL.");
    addWarning();
}