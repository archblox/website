// warning

console.log("Stop!");
console.log(" ");
console.log("Be cautious of what you entering/pasting in here, as it can be an account token stealer, which can get that person access to your account.");
console.log("Be safe, and be smart.");
console.log(" ");
console.log("If you know what you're doing, have fun then!");
console.log(" ");

// Detect if user is on an older domain that isn't recommended.

function addUnsupportedWarning() {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "You are on an unsupported version of the site. Please go to <a href='https://archblox.com'>archblox.com</a> instead.";
    alertsystemdiv.setAttribute("class","alert warning visible");
    document.body.appendChild(alertsystemdiv);
}

function addDatabaseBackupWarning() {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "<div class='alert loading visible'>The database is currently being backed up. Please don't change any settings, send messages or update your status. They will not be saved. Invite creation and sign up has been temporarily disabled.</div>";
    alertsystemdiv.setAttribute("class","alert warning visible");
    document.body.appendChild(alertsystemdiv);
}

function addDatabaseBackupCompleteNotification() {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "<div class='alert loading visible'>The database has finished being backed up. Invite creation and Sign Up has been re-enabled.</div>";
    alertsystemdiv.setAttribute("class","alert-system");
    document.body.appendChild(alertsystemdiv);
}

function addDatabaseRestoreWarning() {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "<div class='alert loading visible'>The database is currently being restored. Please don't change any settings, send messages or update your status. They will not be saved. Invite creation and sign up has been temporarily disabled.</div>";
    alertsystemdiv.setAttribute("class","alert warning visible");
    document.body.appendChild(alertsystemdiv);
}

function addDatabaseRestoreCompleteNotification() {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "<div class='alert loading visible'>The database has finished being restored. Invite creation and Sign Up has been re-enabled.</div>";
    alertsystemdiv.setAttribute("class","alert-system");
    document.body.appendChild(alertsystemdiv);
}

function addShutdownWarning(date) {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "<div class='alert loading visible'>Thanks for playing! ARCHBLOX's VPS will be shutting down on "+ date +". We'll be back eventually. For now, please don't change any settings, send messages or update your status. They will not be saved. Invite creation and sign up has been temporarily disabled.</div>";
    alertsystemdiv.setAttribute("class","alert warning visible");
    document.body.appendChild(alertsystemdiv);
}

function addMaintenanceWarning(date,enddate) {
    let alertsystemdiv = document.createElement("div");
    alertsystemdiv.innerHTML = "<div class='alert loading visible'>ARCHBLOX will go under maintenance on " + date  +". It will finish on "+ enddate +".</div>";
    alertsystemdiv.setAttribute("class","alert-system");
    document.body.appendChild(alertsystemdiv);
}

if (window.document.location.hostname == "archblox.com" || window.document.location.hostname == "www.archblox.com" || window.document.location.hostname == "localhost" || window.document.location.hostname == "127.0.0.1" || window.document.location.hostname == "127.0.0.1:8000") {
    console.log("User is on " + window.document.location.hostname + ". Supported URL.");
    //addDatabaseBackupWarning(); // when the database is backing up. 
    //addDatabaseBackupCompleteNotification(); // when the database has completed a backup. 
    //addDatabaseRestoreWarning(); // when the database is restoring from a backup. 
    //addDatabaseRestoreCompleteNotification(); // when the database has completed a restore. 
    //addShutdownWarning("26/11/2022 (DD/MM/YYYY)"); // when vps is about to expire and site is going into maintenance.
    //addMaintenanceWarning("06/03/2023 (DD/MM/YYYY)","an unknown date."); // when site is going into maintenance.
} else {
    console.log("User is on " + window.document.location.hostname + ". Unsupported/legacy URL.");
    addUnsupportedWarning();
}