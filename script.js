console.log("connected");

const getOverlays = document.querySelectorAll(".bgrOverlay");

getOverlays.forEach(function (overlay, i) {
  setTimeout(function () {
    console.log(overlay);
    overlay.style.animation = "pulseOverlay 2s cubic-bezier(.18,.35,.46,1) alternate infinite";
    overlay.style.animationDelay = `${i * 0.2}s`;
    /*overlay.style.animationDelay = "" + i * 0.2 + "s"; TWO WAYS OF DOING THE SAME THING*/
  },5600);
});

const getLetterBox = document.querySelector(".letterBox");

setTimeout(() => {
  getLetterBox.classList.add("letterBoxGlow")
}, 16000);

/*getOverlays.forEach(function (overlay, index) {
  setTimeout(function () {
    console.log(overlay);
    overlay.style.animation = "pulseOverlay 2s cubic-bezier(.18,.35,.46,1) alternate infinite"
    overlay.style.animationDelay = "s"
  }, (index + 1) * 5000);
});*/

const getLidShadow = document.querySelector(".letterLid");

setTimeout(() => {

    console.log(getLidShadow);
    getLidShadow.classList.remove("letterLidShadow");
}, 5000);