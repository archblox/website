// warning

console.log("Woah there!");
console.log(" ");
console.log("Be careful what you type or copy in this here javascript console.");
console.log("Don't copy and paste some javascript code from a random person on the internet.");
console.log("It can be an account token stealer, which can get that random person into your account.");
console.log("Be safe, and be smart.");
console.log(" ");
console.log("If you know what you're doing, have fun then!");
console.log(" ");

// Detect if user is on an older domain that isn't recommended.

function addWarning() {
    let alertDiv = document.createElement("div");
    alertDiv.innerHTML = "You are on an unsupported version of the site. Please go to <a href='https://archblox.com'>archblox.com</a> instead.";
    alertDiv.setAttribute("id","alert");
    document.body.appendChild(alertDiv);
}

function addDatabaseBackupRestoreWarning() {
    let alertDiv = document.createElement("div");
    alertDiv.innerHTML = "Thanks for playing! We'll be back as soon as I can get a new VPS. (Please don't change settings, message or post anything!)";
    alertDiv.setAttribute("id","alert");
    document.body.appendChild(alertDiv);
}

if (window.document.location.hostname == "archblox.com") {
    console.log("User is on " + window.document.location.hostname + ". Supported URL.");
    addDatabaseBackupRestoreWarning();
} else {
    console.log("User is on " + window.document.location.hostname + ". Unsupported/legacy URL.");
    addWarning();
}