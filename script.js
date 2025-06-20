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

const letterSeal = document.querySelector(".sealBody");
const letterBranch = document.querySelector(".letterBranchBox");
const sparkGlow = document.querySelector(".sealSparkBgrGlow");
const sealSpark = document.querySelectorAll(".sealSpark");

function openLetter() {
  letterSeal.classList.add("openSeal");
  letterBranch.classList.add("openSeal");
  sparkGlow.classList.add("SealSparkGlowShow");
  
  sealSpark.forEach(element => {
    element.classList.add("SealSparkShow");
  });

}