console.log("connected");

const sealSparkGlow = document.querySelector(".sealSparkBgrGlow");
let sealSparkGlowFadeActive = false;
let sealSparkGlowStart = null;

const closeSeal = document.querySelector(".sealBody");
let sealFadeActive = false;
let sealFadeStart = null;

const closeLetterBranch = document.querySelector(".letterBranchBox");
let sealBranchFadeActive = false;
let sealBranchStart = null;

const sealDuration = 1000; // ms

/* --- Cancel Pulse / Click to Freeze --- */
const openLetter = document.querySelector(".letterWrapper");

/* --- Freeze control for Letter --- */
let cancelLetterPulse = false;
let frozenLetterScale = null;
let frozenGlowScale = null;
let glowFade = false;
let glowOpacity = 1; // initial opacity
let currentLetterScale = 1;

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
let lightPhase = "grow";
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
const pulseMaxScale = 1.1; // the only parameter you adjust
const pulseDuration = 4000; // how fast the pulse cycles
const letterGlowMin = 0.7;
const letterGlowMax = 1;
const letterGlowDuration = 5000;
const startDelay = 25000;

/* --- MAIN RAF LOOP --- */
let lastTimestamp = null;

function tick(timestamp){
  if(!lastTimestamp) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp)/16.666;
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

  /* --- Letter --- */
  let pulseBaselineScale = null; // stores the last scale of the entrance

  if(getLetter){
    let elapsedLetter = timestamp;

    if(elapsedLetter >= startDelay){
      const animTime = elapsedLetter - startDelay;

      // --- Determine entrance progress ---
      const entranceProgress = Math.min(animTime / letterDuration, 1);
      const easedProgress = 1 - Math.pow(1 - entranceProgress, 3); // cubic easing

      const finalY = startY + (letterPosition - startY) * easedProgress;
      const finalRotation = startRotation + (letterRotation - startRotation) * easedProgress;

      // --- Entrance phase ---
      if(entranceProgress < 1){
        const currentScale = startScale + (letterScale - startScale) * easedProgress;
        getLetter.style.transform = `translateY(${finalY}%) rotateY(${finalRotation}deg) scale(${currentScale})`;
        currentLetterScale = currentScale;
      } else {
        // --- Capture baseline for pulse once ---
        if(pulseBaselineScale === null){
          pulseBaselineScale = startScale + (letterScale - startScale) * 1; // exact final entrance scale
        }

        if(!cancelLetterPulse){
          // --- Pulse phase with sine shift to avoid jump ---
          const pulseElapsed = animTime - letterDuration;
          const t = pulseElapsed / pulseDuration * Math.PI * 2;

          // Shift sine by -90° so it starts at 0 (baseline)
          const sine = Math.sin(t - Math.PI / 2);
          const pulseProgress = (sine + 1) / 2; // map -1..1 → 0..1

          const pulseScale = pulseBaselineScale + (pulseMaxScale - pulseBaselineScale) * pulseProgress;

          getLetter.style.transform = `translateY(${finalY}%) rotateY(${finalRotation}deg) scale(${pulseScale})`;
          currentLetterScale = pulseScale;

          // --- Glow synchronized ---
          if(getLetterGlow && !glowFade){
            const glowScale = letterGlowMin + ((pulseScale - pulseBaselineScale) / (pulseMaxScale - pulseBaselineScale)) * (letterGlowMax - letterGlowMin);
            getLetterGlow.style.transform = `scale(${glowScale})`;
            getLetterGlow.style.opacity = "1";
          }
        } else {
          // --- Freeze letter and fade glow ---
          getLetter.style.transform = `translateY(${finalY}%) rotateY(${finalRotation}deg) scale(${frozenLetterScale})`;
          if(getLetterGlow && glowFade){
            glowOpacity -= 0.02 * delta;
            if(glowOpacity < 0) glowOpacity = 0;
            getLetterGlow.style.opacity = glowOpacity;
            getLetterGlow.style.transform = `scale(${frozenGlowScale})`;
          }
        }
      }
    }
  }
  

  /* --- Seal fade integrated into main loop --- */
  if (sealBranchFadeActive && closeLetterBranch) {
    if (!sealBranchStart) sealBranchStart = timestamp;
    const branchElapsed = timestamp - sealBranchStart;
    const progress = Math.min(branchElapsed / sealDuration, 1);

    // Ease out for smooth finish
    const eased = 1 - Math.pow(1 - progress, 3);

    // Opacity fade
    const opacityVal = 1 - eased;
    closeLetterBranch.style.opacity = opacityVal;

    // Scale down slightly as it fades
    const scaleVal = 1 + 0.03 * eased; // from 1 → 1.1
    closeLetterBranch.style.transform = `scale(${scaleVal}) translateZ(0)`;

    // Optional: remove interactions when done
    if (progress >= 1) {
      closeLetterBranch.style.opacity = 0;
      closeLetterBranch.style.transform = `scale(0.8) translateZ(0)`;
      closeLetterBranch.style.pointerEvents = "none";
      sealBranchFadeActive = false;
    }
  }

    /* --- Seal Branch fade integrated into main loop --- */
  if (sealFadeActive && closeSeal) {
    if (!sealFadeStart) sealFadeStart = timestamp;
    const sealElapsed = timestamp - sealFadeStart;
    const progress = Math.min(sealElapsed / sealDuration, 1);

    // Ease out for smooth finish
    const eased = 1 - Math.pow(1 - progress, 3);

    // Opacity fade
    const opacityVal = 1 - eased;
    closeSeal.style.opacity = opacityVal;

    // Scale down slightly as it fades
    const scaleVal = 1 - 0.03 * eased; // from 1 → 0.8
    closeSeal.style.transform = `scale(${scaleVal}) translateZ(0)`;

    // Optional: remove interactions when done
    if (progress >= 1) {
      closeSeal.style.opacity = 0;
      closeSeal.style.transform = `scale(0.8) translateZ(0)`;
      closeSeal.style.pointerEvents = "none";
      sealFadeActive = false;
    }
  }

  /* --- Seal Spark Glow fade (independent continuous scale) --- */
  if (sealSparkGlowFadeActive && sealSparkGlow) {
    if (!sealSparkGlowStart) {
      sealSparkGlowStart = timestamp;
      sealSparkGlow.style.opacity = 0; // start hidden
      sealSparkGlow.style.transform = "scale(0.8) translateZ(0)";
    }

    // Timing controls
    const fadeInDuration = 500;     // faster fade in
    const holdDuration = 50;       // time at full opacity
    const fadeOutDuration = 1000;   // slower fade out
    const totalDuration = fadeInDuration + holdDuration + fadeOutDuration;

    const elapsed = timestamp - sealSparkGlowStart;
    const progress = Math.min(elapsed / totalDuration, 1);

    // --- Opacity control ---
    let opacityVal;

    if (elapsed <= fadeInDuration) {
      // Fade in
      const t = elapsed / fadeInDuration;
      const eased = 1 - Math.pow(1 - t, 3);
      opacityVal = eased; // 0 → 1
    } else if (elapsed <= fadeInDuration + holdDuration) {
      // Hold
      opacityVal = 1;
    } else {
      // Fade out
      const t = (elapsed - fadeInDuration - holdDuration) / fadeOutDuration;
      const eased = 1 - Math.pow(1 - t, 3);
      opacityVal = 1 - eased; // 1 → 0
    }

    // --- Independent scale control ---
    // Grows continuously through the entire animation
    const scaleGrowthSpeed = 0.0015; // adjust for faster/slower growth
    const continuousScale = 0 + (elapsed * scaleGrowthSpeed); // keeps growing smoothly

    // Apply both
    sealSparkGlow.style.opacity = opacityVal;
    sealSparkGlow.style.transform = `scale(${continuousScale}) translateZ(0)`;

    // End animation cleanly
    if (progress >= 1) {
      sealSparkGlow.style.opacity = 0;
      sealSparkGlow.style.transform = `scale(${continuousScale}) translateZ(0)`; // keeps last scale
      sealSparkGlowFadeActive = false;
    }
  }




  requestAnimationFrame(tick);
}
  
requestAnimationFrame(tick);

  /* --- Click to Freeze and Fade Glow --- */
  if(openLetter){
    openLetter.addEventListener("click", ()=>{
      if(!cancelLetterPulse && getLetter){
        frozenLetterScale = currentLetterScale;

        if(getLetterGlow){
          const matrixGlow = getComputedStyle(getLetterGlow).transform;
          if(matrixGlow !== "none"){
            const matchGlow = matrixGlow.match(/matrix.*\((.+)\)/);
            if(matchGlow){
              const values = matchGlow[1].split(", ");
              frozenGlowScale = (parseFloat(values[0]) + parseFloat(values[3])) / 2;
            } else {
              frozenGlowScale = 1;
            }
          } else {
            frozenGlowScale = 1;
          }
        }
      }
      cancelLetterPulse = true;
      glowFade = true;

      // --- Trigger Seal Fade ---
      if (closeSeal && !sealFadeActive) {
        sealFadeActive = true;
        sealFadeStart = null; // reset timestamp on click
      }

      if (closeLetterBranch && !sealBranchFadeActive) {
        sealBranchFadeActive = true;
        sealBranchStart = null; // reset timestamp on click
      }

      if (sealSparkGlow && !sealSparkGlowFadeActive) {
        sealSparkGlowFadeActive = true;
        sealSparkGlowStart = null; // reset timestamp
      }
    });
}













