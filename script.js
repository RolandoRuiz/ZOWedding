console.log("connected");

/* --- Branch animation --- */
const getUpperBranch = document.querySelector("#topBranch");
const getLowerBranch = document.querySelector("#bottomBranch");
let position = 15;
let direction = 1;
const minPosition = 0;
const maxPosition = 30;
const speed = 0.2;

/* --- Leaf animation --- */
const leafMinPosition = 0;
const leafMaxPosition = 40;
const leafSpeed = 0.35;
const getBranches = document.querySelectorAll(".branch");
const leaves = [];

getBranches.forEach(branch => {
  branch.addEventListener("load", () => {
    const branchDoc = branch.contentDocument;
    if (!branchDoc) return;
    const branchDocLeafTargets = branchDoc.querySelectorAll(".prefix__leaf");

    branchDocLeafTargets.forEach(leafTarget => {
      const leafObj = { el: leafTarget, pos: 0, dir: 1, active: false, obsDebounce: null };
      leaves.push(leafObj);

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const l = leaves.find(leaf => leaf.el === entry.target);
          if (!l) return;
          if (l.obsDebounce) clearTimeout(l.obsDebounce);
          l.obsDebounce = setTimeout(() => { l.active = entry.isIntersecting; l.obsDebounce = null; }, 60);
        });
      }, { root: null, rootMargin: "0px", threshold: 0.5 });

      observer.observe(leafTarget);

      try { leafTarget.style.willChange = "transform"; } catch(e){}
      try { leafTarget.style.transform = "translateZ(0)"; } catch(e){}
    });
  });
});

/* --- Background overlay --- */
const backgroundOverlay = document.querySelector(".bgrMultiply");
let bgrOverlayStartTime;
const overlayDelay = 2000;
const overlayDuration = 1500;
const overlayOpacityMax = 1;
const overlayOpacityMin = 0.92;

/* --- Light overlay --- */
const getLightOverlay = document.querySelector(".bgrOverlayWrapper");
const getLightOverlay2 = document.querySelector(".bgrTopOverlay");
let lightOverlayStartTime;
const delayLightOverlay = 2000;
const lightStartScale = 0.001;
const lightMaxScale = 1.1;
const lightMinPulse = 1.0;
let lightScale = lightStartScale;
let lightPhase = "grow"; // "grow" or "pulse"
let lightDirection = -1;

/* --- Paragraph animation --- */
const getInitialParagraphs = document.querySelectorAll(".initialParagraph");
const getParagraphLines = document.querySelectorAll(".paragraphLine");
const getParagraphGlows = document.querySelectorAll(".paragraphGlow");

getParagraphLines.forEach(l => {
  try { l.style.willChange = "mask-position,-webkit-mask-position"; l.style.setProperty('--mask-x','100%'); } catch(e){}
});
getParagraphGlows.forEach(l => {
  try { l.style.willChange = "mask-position,-webkit-mask-position"; l.style.setProperty('--mask-x','650%'); } catch(e){}
});

function animateMask(line, start, end, duration){
  let startTime = null;
  function step(timestamp){
    if(!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    let progress = Math.min(elapsed / duration, 1);
    const posX = start + (end - start) * progress;
    line.style.setProperty('--mask-x', `${posX}%`);
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function animateParagraph(paragraph){
  const delayPerLine = 1500;
  const lineDuration = 2600;

  getParagraphLines.forEach((line,i)=>{
    if((paragraph.classList.contains("One") && line.closest(".One")) || 
       (paragraph.classList.contains("Two") && line.closest(".Two"))){
      setTimeout(()=>animateMask(line, 100, 0, lineDuration), i*delayPerLine);
    }
  });

  getParagraphGlows.forEach((glow,i)=>{
    if((paragraph.classList.contains("One") && glow.closest(".One")) || 
       (paragraph.classList.contains("Two") && glow.closest(".Two"))){
      setTimeout(()=>animateMask(glow, 650, -600, lineDuration), i*delayPerLine);
    }
  });
}

function staggerParagraphs(){
  const delay = 4000;
  let startTime = null;
  function step(timestamp){
    if(!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    getInitialParagraphs.forEach((paragraph,i)=>{
      if(!paragraph.started && elapsed >= (i+1)*delay){
        paragraph.started = true;
        animateParagraph(paragraph);
      }
    });
    if([...getInitialParagraphs].some(p=>!p.started)) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
staggerParagraphs();

/* --- Sparks --- */
const getsparkBoxes = document.querySelectorAll(".sparkBox");
const minAngle = 0;
const maxAngle = 360;
const angleSpeed = 1;
let sparkAngles = new WeakMap();
const sparkCache = [];

getsparkBoxes.forEach(sparkBox=>{
  sparkBox.addEventListener("load", ()=>{
    const sparkBoxDoc = sparkBox.contentDocument;
    if(!sparkBoxDoc) return;
    const sparks = sparkBoxDoc.querySelectorAll(".spark");
    sparks.forEach(spark=>{
      sparkAngles.set(spark, Math.random()*maxAngle);
      sparkCache.push(spark);
      try{ spark.style.transformOrigin="center"; }catch(e){}
      try{ spark.style.transformBox="fill-box"; }catch(e){}
      try{ spark.style.willChange="transform"; }catch(e){}
      try{ spark.style.transform=`rotate(${sparkAngles.get(spark)}deg) translateZ(0)`;}catch(e){}
    });
  });
});

/* --- Letter --- */
const getLetter = document.querySelector(".letterBox");
const getLetterGlow = document.querySelector(".letterGlow");
const startY = 8;
const startRotation = -270;
const startScale = 0.1;
const letterPosition = -140;
const letterRotation = 0;
const letterScale = 1;
const letterDuration = 2500;
const positionSpeed = 2;
const rotationSpeed = 1.5;
const scaleSpeed = 2;
const pulseMinScale = 0.8;
const pulseMaxScale = 1;
const pulseDuration = 5000;
const pulseDelay = 0;
const letterGlowMin = 0.7;
const letterGlowMax = 1;
const letterGlowDuration = 5000;
const startDelay = 25000; // ms

/* --- MAIN RAF LOOP --- */
let lastTimestamp = null;

function tick(timestamp){
  if(!lastTimestamp) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp)/16.666; // ~60fps normalization
  lastTimestamp = timestamp;

  /* Branches */
  position += direction*speed*delta;
  if(position>=maxPosition) direction=-1;
  else if(position<=minPosition) direction=1;
  const branchRotation = `rotate(${position/10}deg)`;
  if(getUpperBranch) getUpperBranch.style.transform = branchRotation;
  if(getLowerBranch) getLowerBranch.style.transform = branchRotation;

  /* Leaves */
  leaves.forEach(l=>{
    if(!l.active) return;
    l.pos += l.dir*leafSpeed*delta;
    if(l.pos>=leafMaxPosition) l.dir=-1;
    else if(l.pos<=leafMinPosition) l.dir=1;
    try{ l.el.style.transform=`rotate(${l.pos}deg)`;}catch(e){}
  });

  /* Background Overlay */
  if(!bgrOverlayStartTime) bgrOverlayStartTime = timestamp;
  let overlayElapsed = timestamp - bgrOverlayStartTime;
  if(overlayElapsed >= overlayDelay){
    const fadeElapsed = overlayElapsed - overlayDelay;
    const progress = Math.min(fadeElapsed/overlayDuration,1);
    const currentOpacity = overlayOpacityMax - (overlayOpacityMax-overlayOpacityMin)*progress;
    if(backgroundOverlay) backgroundOverlay.style.opacity = currentOpacity;
  }

  /* Light overlay */
  if(!lightOverlayStartTime) lightOverlayStartTime = timestamp;
  const elapsedLight = timestamp - lightOverlayStartTime;

  if(elapsedLight < delayLightOverlay){
    lightScale = lightStartScale;
  } else {
    if(lightPhase==="grow"){
      lightScale += 0.012*delta;
      if(lightScale >= lightMaxScale){
        lightScale = lightMaxScale;
        lightPhase="pulse";
      }
    } else if(lightPhase==="pulse"){
      lightScale += lightDirection*0.001*delta;
      if(lightScale >= lightMaxScale) lightDirection=-1;
      if(lightScale <= lightMinPulse) lightDirection=1;
    }
  }

  if(getLightOverlay) getLightOverlay.style.transform=`scale(${lightScale}) translateZ(0)`;
  if(getLightOverlay2) getLightOverlay2.style.transform=`scale(${lightScale}) translateZ(0)`;

  /* Sparks */
  sparkCache.forEach(spark=>{
    try{
      let angle = sparkAngles.get(spark) || 0;
      angle += angleSpeed*delta;
      if(angle>maxAngle) angle = minAngle + (angle-maxAngle);
      spark.style.transform = `rotate(${angle}deg) translateZ(0)`;
      sparkAngles.set(spark, angle);
    }catch(e){}
  });

  /* Letter */
  if(getLetter){
    let elapsedLetter = timestamp;
    if(elapsedLetter >= startDelay){
      const animTime = elapsedLetter - startDelay;
      // Phase 1: Entrance
      const progress = Math.min(animTime/letterDuration,1);
      const easedPos = 1-Math.pow(1-Math.min(progress/positionSpeed,1),3);
      const easedRot = 1-Math.pow(1-Math.min(progress/rotationSpeed,1),3);
      const easedScale = 1-Math.pow(1-Math.min(progress/scaleSpeed,1),3);

      const finalY = startY + (letterPosition-startY)*easedPos;
      const finalRotation = startRotation + (letterRotation-startRotation)*easedRot;
      let finalScale = startScale + (letterScale-startScale)*easedScale;

      if(progress<1){
        getLetter.style.transform = `translateY(${finalY}%) rotateY(${finalRotation}deg) scale(${finalScale})`;
      } else {
        // Pulse phase
        const t = (animTime-letterDuration)/pulseDuration;
        const sine = Math.sin(t*Math.PI*2);
        const pulseScale = pulseMinScale + (pulseMaxScale-pulseMinScale)*((sine+1)/2);
        getLetter.style.transform = `translateY(${finalY}%) rotateY(${finalRotation}deg) scale(${pulseScale})`;
        if(getLetterGlow){
          const glowSine = Math.sin(t*Math.PI*2*(pulseDuration/letterGlowDuration));
          const glowScale = letterGlowMin + (letterGlowMax-letterGlowMin)*((glowSine+1)/2);
          getLetterGlow.style.transform = `scale(${glowScale})`;
        }
      }
    }
  }

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
