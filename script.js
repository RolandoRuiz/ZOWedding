console.log("connected");

const getOverlays = document.querySelectorAll(".bgrOverlay");

getOverlays.forEach(function (overlay, i) {
  setTimeout(function () {
    overlay.style.animation = "pulseOverlay 2s cubic-bezier(.18,.35,.46,1) alternate infinite";
    overlay.style.animationDelay = `${i * 0.2}s`;
    /*overlay.style.animationDelay = "" + i * 0.2 + "s"; TWO WAYS OF DOING THE SAME THING*/
  },5600);
});

const getPh1 = document.querySelectorAll(".ph1");
const getPhGlow1 = document.querySelectorAll(".ph1Glow");
const getPh2 = document.querySelectorAll(".ph2");
const getPhGlow2 = document.querySelectorAll(".ph2Glow");


setTimeout(() => {
  getPh1.forEach((element, index) => {
  setTimeout(() => {
    element.classList.add("lineMask");
    element.style.animationDelay = `${index * 2}s`;
  }, (index + 1));
  });
}, 4000);

setTimeout(() => {
  getPhGlow1.forEach((element, index) => {
  setTimeout(() => {
    element.classList.add("glowMask");
    element.style.animationDelay = `${index * 2}s`;
  }, index + 1);
  });
}, 4000);

setTimeout(() => {
  getPh2.forEach((element, index) => {
  setTimeout(() => {
    element.classList.add("lineMask");
    element.style.animationDelay = `${index * 2}s`;
  }, (index + 1));
  });
}, 16000);

setTimeout(() => {
  getPhGlow2.forEach((element, index) => {
  setTimeout(() => {
    element.classList.add("glowMask");
    element.style.animationDelay = `${index * 2}s`;
  }, index + 1);
  });
}, 16000);

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
const clearSparks = document.querySelector(".sparkWrapper");
const endSpark1 = document.querySelector(".sparkGrpStart");
const endSpark2 = document.querySelector(".sparkGrpMiddle");
const endSpark3 = document.querySelector(".sparkGrpEnd");

const bgrClose = document.querySelector(".bgrMultiply");
const archShadow = document.querySelector(".archShadow");
const endOverlay = document.querySelector(".baseOverlayWrapper");
const endTopOverlay = document.querySelector(".bgrTopOverlay");
const letterCardGlow = document.querySelector(".letterCardGlow");

const removeLidShadow = document.querySelector(".letterLidShadow");
const moveBranchTwo = document.querySelector(".branchTwo");
const arrowBob = document.querySelector(".bottomArrowBox");


function openLetter() {

  stopLetterMovement.style.animationPlayState = "running, paused, paused";
  
  closeLetterGlowBox.classList.add("stopLetterGlow");
  stopLetterGlow.style.animationPlayState = "paused";

  
  letterSeal.classList.add("openSeal");
  letterBranch.classList.add("openSeal");


  sparkGlow.classList.add("SealSparkGlowShow");
  sealSpark.forEach(sealSparkElem => {
    sealSparkElem.classList.add("SealSparkShow");
  });

  setTimeout(() => {
    endSpark1.style.animationPlayState = "paused";
    endSpark2.style.animationPlayState = "paused";
    endSpark3.style.animationPlayState = "paused";
    endSpark1.style.display = "none";
    endSpark2.style.display = "none";
    endSpark3.style.display = "none";
  }, 2600);
  clearSparks.classList.add("endSpark");
  
  openLid.classList.add("openLid");
  removeLidShadow.classList.add("removeLidShadow");

  
  takeCard.classList.add("cardMovement");
  letterCardGlow.classList.add("screenGlowAnim");


  endOverlay.classList.add("endOverlayAnim");
  endTopOverlay.classList.add("endOverlayAnim");
  bgrClose.classList.add("closeBgrMultiply");
  archShadow.classList.add("lightenArchShadow");

  moveBranchTwo.classList.add("branchTwoAnim");
  arrowBob.classList.add("arrowBobAnim");
}

const topBranchObject = document.getElementById('topBranch');
const bottomBranchObject = document.getElementById('bottomBranch');

topBranchObject.addEventListener('load', () =>{
  const topBranchDoc = topBranchObject.contentDocument;
  const leafTopTargets = topBranchDoc.querySelectorAll(".leaf");

  const stopTopLeafAnimOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
  }

  const stopTopLeafAnim = (entries) => {
    entries.forEach((entry) =>{
      if (!entry.isIntersecting) {
        entry.target.style.animationPlayState = "paused";
      }else{
        setTimeout(() => {
          entry.target.style.animationPlayState = "running";
        }, 4000);
        
      }
    })
  }

  const stopLeafObserver = new IntersectionObserver(stopTopLeafAnim, stopTopLeafAnimOptions);

  leafTopTargets.forEach(function (leafTopTarget) {
    //console.log(leafTopTarget)
    stopLeafObserver.observe(leafTopTarget)
  })

  
})

bottomBranchObject.addEventListener('load', () =>{
  const bottomBranchDoc = bottomBranchObject.contentDocument;
  const leafBottomTargets = bottomBranchDoc.querySelectorAll(".leaf");

  const stopBottomLeafAnimOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
  }

  const stopBottomLeafAnim = (entries) => {
    entries.forEach((entry) =>{
      if (!entry.isIntersecting) {
        entry.target.style.animationPlayState = "paused";
      }else{
        setTimeout(() => {
          entry.target.style.animationPlayState = "running";
        }, 4000);
      }
    })
  }

  const stopLeafObserver = new IntersectionObserver(stopBottomLeafAnim, stopBottomLeafAnimOptions);

  leafBottomTargets.forEach(function (leafBottomTarget) {
    //console.log(leafBottomTarget)
    stopLeafObserver.observe(leafBottomTarget)
  })

  
})

/**

const stopLeafAnimOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
}

const stopLeafAnim = (entries) => {
  entries.forEach((entry) =>{
    if (entry.isIntersecting) {
      entry.target.classList.remove("leaf")
    }
  })
}

const stopLeafObserver = new IntersectionObserver(stopLeafAnim, stopLeafAnimOptions);
leafTargets.forEach(leafTarget => stopLeafObserver.observe(leafTarget));**/
