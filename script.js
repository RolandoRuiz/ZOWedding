console.log("connected");

/* Branch animation */

const getUpperBranch = document.querySelector("#topBranch");
const getLowerBranch = document.querySelector("#bottomBranch");
var BranchId;


let position = 15;
let direction = 1; // 1 for forward, -1 for backward
const minPosition = 0;
const maxPosition = 30; // Example boundaries
const speed = 0.2; // How much to move per frame

function branchMovement() {
  position += direction * speed;
  
  if (position >= maxPosition) {
        direction = -1; // Reverse direction
    } else if (position <= minPosition) {
        direction = 1; // Reverse direction
  }

  getUpperBranch.style.transform = "rotate(" + position / 10 + "deg)";
  getLowerBranch.style.transform = "rotate(" + position / 10 + "deg)";

  BranchId = requestAnimationFrame(branchMovement);
}

BranchId = requestAnimationFrame(branchMovement);

/* Leaf animation */

const leafMinPosition = 0;
const leafMaxPosition = 40;
const leafSpeed = 0.35;

const getBranches = document.querySelectorAll(".branch");

getBranches.forEach(branch => {

  branch.addEventListener('load', () =>{
    const branchDoc = branch.contentDocument;
    const branchDocLeafTargets = branchDoc.querySelectorAll(".prefix__leaf");

    branchDocLeafTargets.forEach(leafTarget => {

      let leafId;
      let leafPosition = 0;
      let leafDirection = 1;

      const stopLeafAnimOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }

      const stopLeafAnim = (entries) => {
        entries.forEach((entry) =>{
          if (entry.isIntersecting) {
            startLeafMovement()
          }else{
            stopLeafMovement()
          }
        })  
      }

      const stopLeafObserver = new IntersectionObserver(stopLeafAnim, stopLeafAnimOptions);

      stopLeafObserver.observe(leafTarget)
        
      function leafMovement() {
        leafPosition += leafDirection * leafSpeed;

        if (leafPosition >= leafMaxPosition) {
          leafDirection = -1;
        } else if (leafPosition <= leafMinPosition) {
          leafDirection = 1;
        }

        leafTarget.style.transform = "rotate(" + leafPosition + "deg)";
        leafId = requestAnimationFrame(leafMovement);
        }

      function startLeafMovement(){
        if (!leafId) {
          leafMovement();
        }
      }  

      function stopLeafMovement(){
        if (leafId) {
          cancelAnimationFrame(leafId);
          leafId = null;
        }
      }
    });
  })
});

/* Background Overlay Animation*/

const backgroundOverlay = document.querySelector(".bgrMultiply");
let overlayId;
let bgrOverlayStartTime;
const overlayDelay = 2000;
const overlayDuration = 1500;        // how long the fade should last (ms)
const overlayOpacityMax = 1;       // starting opacity
const overlayOpacityMin = 0.92;     // minimum opacity

function backgroundOverlayFade(timestamp) {
  if (!bgrOverlayStartTime) bgrOverlayStartTime = timestamp;

  const elapsed = timestamp - bgrOverlayStartTime;

  if (elapsed >= overlayDelay) {
    const fadeElapsed = elapsed - overlayDelay;

    // calculate normalized progress 0 → 1
    const progress = Math.min(fadeElapsed / overlayDuration, 1);

    // interpolate opacity from max → min
    const currentOpacity = overlayOpacityMax - (overlayOpacityMax - overlayOpacityMin) * progress;

    backgroundOverlay.style.opacity = currentOpacity;

    if (progress < 1) {
    overlayId = requestAnimationFrame(backgroundOverlayFade);
    }
  }else{
    overlayId = requestAnimationFrame(backgroundOverlayFade);
  }
}

// start the fade
overlayId = requestAnimationFrame(backgroundOverlayFade);

backgroundOverlayFade()

/* Light animation */

const getLightOverlay = document.querySelector(".bgrOverlayWrapper");
var lightOverlayId;
let lightOverlayStartTime;
const delayLightOverlay = 2000; //2 Seconds

let lightPosition = 0;
let lightDirection = 1; 
const lightStartPosition = 0;
const lightEndPosition = 1; 
const lightOverPosition = 1.1;
var lightSpeed = 0.02; 

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lightOverlayMovement(timestamp){

  if(!lightOverlayStartTime){
    lightOverlayStartTime = timestamp;
  }

  const elapsedTime = timestamp - lightOverlayStartTime;

  if (elapsedTime >= delayLightOverlay) {
    lightPosition += lightDirection * lightSpeed;

    if (lightPosition >= lightOverPosition) {
      lightDirection = -1;
      lightSpeed = 0.002;
    }else if (lightPosition <= lightEndPosition) {
      lightDirection = 1;
    }
  
    getLightOverlay.style.transform = "scale(" + lightPosition + ")";
    getLightOverlay.style.opacity = lightPosition;
    lightOverlayId = requestAnimationFrame(lightOverlayMovement);

  }else{
    lightOverlayId = requestAnimationFrame(lightOverlayMovement);
  }
}

lightOverlayMovement()


/* Paragraph animation */

const getInitialParagraphs = document.querySelectorAll(".initialParagraph");
const getParagraphLines = document.querySelectorAll(".paragraphLine");
const getParagraphGlows = document.querySelectorAll(".paragraphGlow");


function animateParagraph(paragraph) {

  const delayPerLine = 1500;
  const lineDuration = 2200;

  getParagraphLines.forEach((line, i) => {

    if (paragraph.classList.contains("One") && line.parentElement.parentElement.classList.contains("One") || 
       paragraph.classList.contains("Two") && line.parentElement.parentElement.classList.contains("Two")){

      setTimeout(() => {
        requestAnimationFrame(step);
        //console.log(delayPerLine * i)
      }, delayPerLine * i);

    }
      
    let startTime = null;

    function step(timestamp) {
    
      if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        // normalize progress 0 → 1
        let progress = Math.min(elapsed / lineDuration, 1);
        progress = Math.round(progress * 100) / 100;

        // animate mask-position (left → right)
        const posX = 100 - progress * 100; // 0% → 100%
        line.style.webkitMaskPosition = `${posX}%`;
        line.style.maskPosition = `${posX}%`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
    }

  })

  getParagraphGlows.forEach((lineGlow, i) => {

    if (paragraph.classList.contains("One") && lineGlow.parentElement.parentElement.classList.contains("One") || 
       paragraph.classList.contains("Two") && lineGlow.parentElement.parentElement.classList.contains("Two")){

      setTimeout(() => {
        requestAnimationFrame(step);
        //console.log(delayPerLine * i)
      }, delayPerLine * i);

    }
      
    let startTime = null;

    function step(timestamp) {
    
      if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        // normalize progress 0 → 1
        let progress = Math.min(elapsed / lineDuration, 1);
        progress = Math.round(progress * 100) / 100;

        // animate mask-position (650% → -600%)
        const startPos = 650;
        const endPos = -600;
        const posX = startPos + (endPos - startPos) * progress;

        lineGlow.style.webkitMaskPosition = `${posX}%`;
        lineGlow.style.maskPosition = `${posX}%`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
    }

  })
}

// stagger start times

function staggerParagraphs() {
  const delay = 4500; // 4s per paragraph
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
