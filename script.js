console.log("connected");

const getOverlays = document.querySelectorAll(".bgrOverlay");

getOverlays.forEach(function (overlay, i) {
  setTimeout(function () {
    overlay.style.animation = "pulseOverlay 2s cubic-bezier(.18,.35,.46,1) alternate infinite";
    overlay.style.animationDelay = `${i * 0.2}s`;
    /*overlay.style.animationDelay = "" + i * 0.2 + "s"; TWO WAYS OF DOING THE SAME THING*/
  },5600);
});


const getLidShadow = document.querySelector(".letterLid");
const letterSeal = document.querySelector(".sealBody");
const letterBranch = document.querySelector(".letterBranchBox");
const sparkGlow = document.querySelector(".sealSparkBgrGlow");
const sealSpark = document.querySelectorAll(".sealSpark");
const stopLetterMovement = document.querySelector(".letterBox");
const stopLetterGlow = document.querySelector(".letterGlow");
const closeLetterGlowBox = document.querySelector(".letterGlowBox");
const openLid = document.querySelector(".letterLid");
const takeCard = document.querySelector(".letterCard");
const clearSparks = document.querySelector(".sparkBox");
const endSpark1 = document.querySelector(".sparkGrpStart");
const endSpark2 = document.querySelector(".sparkGrpMiddle");
const endSpark3 = document.querySelector(".sparkGrpEnd");

const bgrClose = document.querySelector(".bgrMultiply");
const archShadow = document.querySelector(".archShadow");
const endOverlay = document.querySelector(".baseOverlayWrapper");
const endTopOverlay = document.querySelector(".bgrTopOverlay");
const letterCardGlow = document.querySelector(".letterCardGlow");


function openLetter() {

  stopLetterMovement.style.animationPlayState = "running, running, paused";
  closeLetterGlowBox.classList.add("stopLetterGlow");
  stopLetterGlow.style.animationPlayState = "paused";

  

  letterSeal.classList.add("openSeal");
  letterBranch.classList.add("openSeal");
  sparkGlow.classList.add("SealSparkGlowShow");
  
  sealSpark.forEach(element => {
    element.classList.add("SealSparkShow");
  });

  setTimeout(() => {
    getLidShadow.classList.remove("letterLidShadow");
  }, 1600);

  openLid.classList.add("openLid");
  takeCard.classList.add("cardMovement");

  clearSparks.classList.add("endSpark");

  setTimeout(() => {
    endSpark1.style.animationPlayState = "paused";
    endSpark2.style.animationPlayState = "paused";
    endSpark3.style.animationPlayState = "paused";
    endSpark1.style.display = "none";
    endSpark2.style.display = "none";
    endSpark3.style.display = "none";
  }, 2500);

  getOverlays.forEach(element => {
    element.style.animationPlayState = "paused";
  });

  endOverlay.classList.add("endOverlayAnim");
  endTopOverlay.classList.add("endOverlayAnim");
  bgrClose.classList.add("closeBgrMultiply");
  archShadow.classList.add("lightenArchShadow");

  letterCardGlow.classList.add("screenGlowAnim");
}