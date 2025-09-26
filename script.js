console.log("connected");

/* Branch animation */
const getUpperBranch = document.querySelector("#topBranch");
const getLowerBranch = document.querySelector("#bottomBranch");

let position = 15;
let direction = 1; 
const minPosition = 0;
const maxPosition = 30;
const speed = 0.2;

/* Leaf animation */
const leafMinPosition = 0;
const leafMaxPosition = 40;
const leafSpeed = 0.35;

const getBranches = document.querySelectorAll(".branch");
const leaves = []; // cache animated leaves

getBranches.forEach(branch => {
  branch.addEventListener("load", () => {
    const branchDoc = branch.contentDocument;
    const branchDocLeafTargets = branchDoc.querySelectorAll(".prefix__leaf");

    branchDocLeafTargets.forEach(leafTarget => {
      leaves.push({
        el: leafTarget,
        pos: 0,
        dir: 1,
        active: false,
      });

      const stopLeafAnimOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const stopLeafAnim = (entries) => {
        entries.forEach((entry) => {
          const leafObj = leaves.find(l => l.el === leafTarget);
          if (!leafObj) return;
          leafObj.active = entry.isIntersecting;
        });
      };

      const stopLeafObserver = new IntersectionObserver(stopLeafAnim, stopLeafAnimOptions);
      stopLeafObserver.observe(leafTarget);
    });
  });
});

/* Background Overlay Animation */
const backgroundOverlay = document.querySelector(".bgrMultiply");
let bgrOverlayStartTime;
const overlayDelay = 2000;
const overlayDuration = 1500;
const overlayOpacityMax = 1;
const overlayOpacityMin = 0.92;

/* Light animation */
const getLightOverlay = document.querySelector(".bgrOverlayWrapper");
const getLightOverlay2 = document.querySelector(".bgrTopOverlay");
let lightOverlayStartTime;
const delayLightOverlay = 2000;

let lightPosition = 0;
let lightDirection = 1;
const lightStartPosition = 0;
const lightEndPosition = 1;
const lightOverPosition = 1.1;
let lightSpeed = 0.02;

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* Paragraph animation */
const getInitialParagraphs = document.querySelectorAll(".initialParagraph");
const getParagraphLines = document.querySelectorAll(".paragraphLine");
const getParagraphGlows = document.querySelectorAll(".paragraphGlow");

function animateParagraph(paragraph) {
  const delayPerLine = 1500;
  const lineDuration = 2600;

  getParagraphLines.forEach((line, i) => {
    if (
      (paragraph.classList.contains("One") &&
        line.parentElement.parentElement.classList.contains("One")) ||
      (paragraph.classList.contains("Two") &&
        line.parentElement.parentElement.classList.contains("Two"))
    ) {
      setTimeout(() => {
        let startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          let progress = Math.min(elapsed / lineDuration, 1);
          progress = Math.round(progress * 100) / 100;
          const posX = 100 - progress * 100;
          line.style.webkitMaskPosition = `${posX}%`;
          line.style.maskPosition = `${posX}%`;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, delayPerLine * i);
    }
  });

  getParagraphGlows.forEach((lineGlow, i) => {
    if (
      (paragraph.classList.contains("One") &&
        lineGlow.parentElement.parentElement.classList.contains("One")) ||
      (paragraph.classList.contains("Two") &&
        lineGlow.parentElement.parentElement.classList.contains("Two"))
    ) {
      setTimeout(() => {
        let startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          let progress = Math.min(elapsed / lineDuration, 1);
          progress = Math.round(progress * 100) / 100;
          const startPos = 650;
          const endPos = -600;
          const posX = startPos + (endPos - startPos) * progress;
          lineGlow.style.webkitMaskPosition = `${posX}%`;
          lineGlow.style.maskPosition = `${posX}%`;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, delayPerLine * i);
    }
  });
}

function staggerParagraphs() {
  const delay = 4000;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    getInitialParagraphs.forEach((paragraph, i) => {
      const startAt = (i + 1) * delay;
      if (!paragraph.started && elapsed >= startAt) {
        paragraph.started = true;
        animateParagraph(paragraph);
      }
    });

    if ([...getInitialParagraphs].some(p => !p.started)) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}
staggerParagraphs();

/* Spark animation */
const getsparkBoxes = document.querySelectorAll(".sparkBox");
const minAngle = 0;
const maxAngle = 360;
const angleSpeed = 1;
let sparkAngles = new WeakMap();
const sparkCache = [];

getsparkBoxes.forEach(sparkBox => {
  sparkBox.addEventListener("load", () => {
    const sparkBoxDoc = sparkBox.contentDocument;
    if (!sparkBoxDoc) return;
    const sparks = sparkBoxDoc.querySelectorAll(".spark");
    sparks.forEach(spark => {
      sparkAngles.set(spark, Math.random() * maxAngle);
      sparkCache.push(spark);
    });
  });
});

/* MAIN RAF LOOP */
function tick(timestamp) {
  // Branches
  position += direction * speed;
  if (position >= maxPosition) direction = -1;
  else if (position <= minPosition) direction = 1;
  const branchRotation = "rotate(" + position / 10 + "deg)";
  getUpperBranch.style.transform = branchRotation;
  getLowerBranch.style.transform = branchRotation;

  // Leaves
  leaves.forEach(l => {
    if (!l.active) return;
    l.pos += l.dir * leafSpeed;
    if (l.pos >= leafMaxPosition) l.dir = -1;
    else if (l.pos <= leafMinPosition) l.dir = 1;
    l.el.style.transform = "rotate(" + l.pos + "deg)";
  });

  // Background overlay
  if (!bgrOverlayStartTime) bgrOverlayStartTime = timestamp;
  const elapsed = timestamp - bgrOverlayStartTime;
  if (elapsed >= overlayDelay) {
    const fadeElapsed = elapsed - overlayDelay;
    const progress = Math.min(fadeElapsed / overlayDuration, 1);
    const currentOpacity =
      overlayOpacityMax -
      (overlayOpacityMax - overlayOpacityMin) * progress;
    backgroundOverlay.style.opacity = currentOpacity;
  }

  // Light overlay
  if (!lightOverlayStartTime) lightOverlayStartTime = timestamp;
  const elapsedTime = timestamp - lightOverlayStartTime;
  if (elapsedTime >= delayLightOverlay) {
    lightPosition += lightDirection * lightSpeed;
    if (lightPosition >= lightOverPosition) {
      lightDirection = -1;
      lightSpeed = 0.002;
    } else if (lightPosition <= lightEndPosition) {
      lightDirection = 1;
    }
    const transformVal = "scale(" + lightPosition + ")";
    getLightOverlay.style.transform = transformVal;
    getLightOverlay.style.opacity = lightPosition;
    getLightOverlay2.style.transform = transformVal;
    getLightOverlay2.style.opacity = lightPosition;
  }

  // Sparks
  sparkCache.forEach(spark => {
    let angle = sparkAngles.get(spark);
    angle += angleSpeed;
    if (angle > maxAngle) angle = minAngle;
    spark.style.transformBox = "content-box";
    spark.style.transformOrigin = "center";
    spark.style.transform = `rotate(${angle}deg)`;
    sparkAngles.set(spark, angle);
  });

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);



























/* Paragraph animation */
/*
const getInitialParagraphs = document.querySelectorAll(".initialParagraph");
const getParagraphLines = document.querySelectorAll(".paragraphLine");
const getParagraphGlows = document.querySelectorAll(".paragraphGlow");


setTimeout(() => {
  getInitialParagraphs.forEach((paragraph, i) => {
      setTimeout(() => {
        getParagraphLines.forEach((paragraphLine, index) => {

          setTimeout(() => {
            if (paragraph.classList.contains("One") && paragraphLine.parentElement.parentElement.classList.contains("One")) {            
              paragraphLine.classList.add("lineMask")
            }

            if (paragraph.classList.contains("Two") && paragraphLine.parentElement.parentElement.classList.contains("Two")) {
              paragraphLine.classList.add("lineMask")
            }
          }, 1900 * (index+1));
        });

        getParagraphGlows.forEach((paragraphGlow, index) => {
          setTimeout(() => {
            if (paragraph.classList.contains("One") && paragraphGlow.parentElement.parentElement.classList.contains("One")) {            
              paragraphGlow.classList.add("glowMask")
            }

            if (paragraph.classList.contains("Two") && paragraphGlow.parentElement.parentElement.classList.contains("Two")) {
              paragraphGlow.classList.add("glowMask")
            }
          }, 1900 * (index+1));
        });

      }, 2200 * i+1); // this way it starts imediately and then it goes every 2.2 seconds
      //2200 * (i+1)) starts in intervals of 8 seconds every 2.2 seconds;
  }); 
}, 3000); 



























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

  moveBranchTwo.classList.add("branchTwoIndexAnim");
  arrowBob.classList.add("arrowBobAnim");
}


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
