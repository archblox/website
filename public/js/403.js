var time = 5;

function redirect() {
	window.location.replace("https://morblox.us");
}

function countdown() {
	if (time > 0) {
    time--;
    document.getElementById('timeElement').innerHTML = time;
    console.log(time);
  }
}

setInterval(countdown, 1000);
setTimeout(redirect, 5000);