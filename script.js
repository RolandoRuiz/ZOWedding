/* --- Letter Card Glow --- */
const letterCardGlow = document.querySelector(".letterCardGlow");
let letterCardGlowActive = false;
let letterCardGlowStart = null;

// Independent Glow Timing (ms)
const glowIndependentDelay = 2700;       // independent delay before glow starts
const glowInDuration = 2500;          // scale 0 → 25
const glowOutDuration = 1500;         // scale 25 → 0

// Glow scale values
const glowScaleMin = 0;
const glowScaleMax = 25;

/* --- Letter Card Animation --- */
const letterCard = document.querySelector(".letterCard");
let letterCardActive = false;
let letterCardStart = null;

/* --- Letter Card Z-index Timing --- */
const cardZindexInitial = 700;
const cardZindexFinal = 900;
const cardZindexDelay = 2700;   // ms after letterCard starts (independent)
let letterCardZindexChanged = false;

// --- Timing (milliseconds) ---
const cardDelay = 1550;            // wait before starting the first move
const cardStage1Duration = 400;    // 0 → -3
const cardStage2Duration = 400;    // -3 → 0
const cardStage3Duration = 800;    // 0 → -35

// --- Positions (use % or px) ---
const cardPosStart = 0;
const cardPosMid1 = -3;
const cardPosMid2 = 0;
const cardPosEnd = -35;

/* --- Letter Lid Animation --- */
const letterLid = document.querySelector(".letterLid");
let lidActive = false;
let lidStart = null;

// Customizable timings
const lidDelay = 800;          // ms before rotation starts (after click)
const lidDuration = 1500;      // rotation animation duration
const lidZindexDelay = 1500;   // ms after click to change z-index
const lidStartRot = 0;
const lidEndRot = 180;


const sealSparks = document.querySelectorAll(".sealSpark");
let sealSparksActive = false;
let sealSparksStart = null;

const sealSparkData = [];

// Store each spark’s original transform
sealSparks.forEach(spark => {
  const computed = getComputedStyle(spark);
  const matrix = computed.transform;
  let translateX = 0, translateY = 0, rotate = 0;

  if (matrix && matrix !== "none") {
    const match = matrix.match(/matrix\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(",").map(v => parseFloat(v.trim()));
      // Approx extract (for simple 2D transform)
      const a = values[0], b = values[1], c = values[2], d = values[3], e = values[4], f = values[5];
      translateX = e;
      translateY = f;
      rotate = Math.atan2(b, a) * (180 / Math.PI);
    }
  }

  // Save initial info
  sealSparkData.push({
    el: spark,
    tx: translateX,
    ty: translateY,
    rot: rotate,
    startTime: null,
    opacity: 0,
  });

  // Reset to starting hidden position
  spark.style.opacity = 0;
  spark.style.transform = "translate(0px, 0px) rotate(0deg)";
  spark.style.willChange = "opacity, transform";
});

const sealSparkGlow = document.querySelector(".sealSparkBgrGlow");
let sealSparkGlowFadeActive = false;
let sealSparkGlowStart = null;

const closeSeal = document.querySelector(".sealBody");
let sealFadeActive = false;
let sealFadeStart = null;

const closeLetterBranch = document.querySelector(".letterBranchBox");
let sealBranchFadeActive = false;
let sealBranchStart = null;

const sealDuration = 800; // ms
/* --- Seal timing offsets (ms) --- */
const sealSparkGlowOffset = 200;   // delay before glow starts
const sealSparksOffset = 200;      // delay before sparks start


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
  if (sealFadeActive && closeSeal) {
    if (!sealFadeStart) sealFadeStart = timestamp;
    const sealElapsed = timestamp - sealFadeStart;
    const progress = Math.min(sealElapsed / sealDuration, 1);

    // Ease out for smooth finish
    const eased = 1 - Math.pow(1 - progress, 3);

    // Fade opacity out
    const opacityVal = 1 - eased;
    closeSeal.style.opacity = opacityVal;

    // Slight scale up (from 1 → 1.05)
    const scaleVal = 1 + 0.15 * eased;
    closeSeal.style.transform = `scale(${scaleVal}) translateZ(0)`;

    if (progress >= 1) {
      closeSeal.style.opacity = 0;
      closeSeal.style.transform = `scale(${scaleVal}) translateZ(0)`;
      closeSeal.style.pointerEvents = "none";
      sealFadeActive = false;
    }
  }


    /* --- Seal Branch fade integrated into main loop --- */
  if (sealBranchFadeActive && closeLetterBranch) {
    if (!sealBranchStart) sealBranchStart = timestamp;
    const branchElapsed = timestamp - sealBranchStart;
    const progress = Math.min(branchElapsed / sealDuration, 1);

    // Ease out for smooth finish
    const eased = 1 - Math.pow(1 - progress, 3);

    // Fade opacity out
    const opacityVal = 1 - eased;
    closeLetterBranch.style.opacity = opacityVal;

    // Slight scale up (from 1 → 1.05)
    const scaleVal = 1 + 0.15 * eased;
    closeLetterBranch.style.transform = `scale(${scaleVal}) translateZ(0)`;

    if (progress >= 1) {
      closeLetterBranch.style.opacity = 0;
      closeLetterBranch.style.transform = `scale(${scaleVal}) translateZ(0)`;
      closeLetterBranch.style.pointerEvents = "none";
      sealBranchFadeActive = false;
    }
  }


 /* --- Seal Spark Glow fade (with offset, no early return) --- */
if (sealSparkGlowFadeActive && sealSparkGlow) {
  if (!sealSparkGlowStart) {
    sealSparkGlowStart = timestamp;
    sealSparkGlow.style.opacity = 0;
    sealSparkGlow.style.transform = "scale(0.8) translateZ(0)";
  }

  const elapsed = timestamp - sealSparkGlowStart;

  // still waiting for offset: keep hidden but don't break the frame
  if (elapsed < sealSparkGlowOffset) {
    // keep baseline state (optional: small subtle pre-scale)
    sealSparkGlow.style.opacity = 0;
    // leave transform as-is (or set baseline)
    // sealSparkGlow.style.transform = "scale(0.8) translateZ(0)";
  } else {
    const adjustedElapsed = elapsed - sealSparkGlowOffset;

    // customize timings
    const fadeInDuration = 350;
    const holdDuration = 50;
    const fadeOutDuration = 800;
    const totalDuration = fadeInDuration + holdDuration + fadeOutDuration;
    const progress = Math.min(adjustedElapsed / totalDuration, 1);

    // Opacity
    let opacityVal;
    if (adjustedElapsed <= fadeInDuration) {
      const t = adjustedElapsed / fadeInDuration;
      const eased = 1 - Math.pow(1 - t, 3);
      opacityVal = eased; // 0 -> 1
    } else if (adjustedElapsed <= fadeInDuration + holdDuration) {
      opacityVal = 1;
    } else {
      const t = (adjustedElapsed - fadeInDuration - holdDuration) / fadeOutDuration;
      const eased = 1 - Math.pow(1 - t, 3);
      opacityVal = 1 - eased; // 1 -> 0
    }

    // Continuous scale (independent growth)
    const scaleGrowthSpeed = 0.0008; // tweak to taste
    const baseScale = 0.8;
    const continuousScale = baseScale + adjustedElapsed * scaleGrowthSpeed;

    sealSparkGlow.style.opacity = opacityVal;
    sealSparkGlow.style.transform = `scale(${continuousScale}) translateZ(0)`;

    // finish
    if (adjustedElapsed >= totalDuration) {
      sealSparkGlow.style.opacity = 0;
      sealSparkGlowFadeActive = false;
    }
  }
}

  /* --- Seal Sparks animation (with offset, no early return) --- */
  if (sealSparksActive) {
    if (!sealSparksStart) sealSparksStart = timestamp;
    const elapsed = timestamp - sealSparksStart;

    // not yet time to start sparks — keep them hidden and continue
    if (elapsed < sealSparksOffset) {
      // Ensure they stay hidden until offset; don't return
      sealSparkData.forEach(sparkObj => {
        try {
          sparkObj.el.style.opacity = 0;
          sparkObj.el.style.transform = "translate(0px, 0px) scale(0.8) translateZ(0)";
        } catch (e) {}
      });
    } else {
      const adjustedElapsed = elapsed - sealSparksOffset;

      // Per-spark global-ish timings (or keep your custom per-spark ones)
      const translateDuration = 1500;      // ms for movement
      const opacityInDuration = 200;       // ms fade in
      const opacityHoldDuration = 0;       // ms fully visible
      const opacityOutDuration = 500;      // ms fade out
      const opacityTotal = opacityInDuration + opacityHoldDuration + opacityOutDuration;

      let anyActive = false;

      sealSparkData.forEach(sparkObj => {
        const { el, tx, ty } = sparkObj;

        // Translate (use adjustedElapsed)
        let transform;
        if (adjustedElapsed < translateDuration) {
          const t = adjustedElapsed / translateDuration;
          const eased = 1 - Math.pow(1 - t, 3);
          const x = tx * eased;
          const y = ty * eased;
          transform = `translate(${x}px, ${y}px)`;
          anyActive = true;
        } else {
          transform = `translate(${tx}px, ${ty}px)`; // final position
        }

        // Opacity (use adjustedElapsed)
        let opacity;
        if (adjustedElapsed < opacityInDuration) {
          const t = adjustedElapsed / opacityInDuration;
          opacity = Math.min(Math.max(1 - Math.pow(1 - t, 3), 0), 1);
          anyActive = true;
        } else if (adjustedElapsed < opacityInDuration + opacityHoldDuration) {
          opacity = 1;
          anyActive = true;
        } else if (adjustedElapsed < opacityTotal) {
          const t = (adjustedElapsed - opacityInDuration - opacityHoldDuration) / opacityOutDuration;
          opacity = Math.min(Math.max(1 - Math.pow(t, 3), 0), 1); // ease out fade
          anyActive = true;
        } else {
          opacity = 0;
        }

        try {
          el.style.transform = transform + " translateZ(0)";
          el.style.opacity = opacity;
        } catch (e) {}
      });

      // Only deactivate after all sparks finished
      if (!anyActive) {
        sealSparksActive = false;
        sealSparksStart = null;
      }
    }
  }

  /* --- Letter Lid Rotation --- */
if (lidActive && letterLid) {
  if (!lidStart) lidStart = timestamp;
  const elapsed = timestamp - lidStart;

  // Rotation (delayed start)
  if (elapsed >= lidDelay) {
    const rotElapsed = elapsed - lidDelay;
    const progress = Math.min(rotElapsed / lidDuration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentRot = lidStartRot + (lidEndRot - lidStartRot) * eased;
    letterLid.style.transform = `rotateX(${currentRot}deg)`;
  }

  // Independent z-index change after lidZindexDelay
  if (elapsed >= lidZindexDelay) {
    letterLid.style.zIndex = "600";
  }

  // End condition
  if (elapsed >= lidDelay + lidDuration && elapsed >= lidZindexDelay) {
    lidActive = false;
  }
}

  /* --- Letter Card Translate Animation --- */
  if (letterCardActive && letterCard) {
    if (!letterCardStart) {
      letterCardStart = timestamp;
      letterCard.style.zIndex = cardZindexInitial; // start value
      letterCardZindexChanged = false;
    }

    const elapsed = timestamp - letterCardStart;

    // --- Independent z-index change ---
    if (!letterCardZindexChanged && elapsed >= cardZindexDelay) {
      letterCard.style.zIndex = cardZindexFinal;
      letterCardZindexChanged = true;
    }

    // --- Wait for delay before starting motion ---
    if (elapsed >= cardDelay) {
      const t = elapsed - cardDelay;
      let y = cardPosStart;

      // Stage 1: 0 → -3
      if (t < cardStage1Duration) {
        const p = t / cardStage1Duration;
        const eased = 1 - Math.pow(1 - p, 3);
        y = cardPosStart + (cardPosMid1 - cardPosStart) * eased;

      // Stage 2: -3 → 0
      } else if (t < cardStage1Duration + cardStage2Duration) {
        const p = (t - cardStage1Duration) / cardStage2Duration;
        const eased = 1 - Math.pow(1 - p, 3);
        y = cardPosMid1 + (cardPosMid2 - cardPosMid1) * eased;

      // Stage 3: 0 → -35
      } else if (t < cardStage1Duration + cardStage2Duration + cardStage3Duration) {
        const p = (t - cardStage1Duration - cardStage2Duration) / cardStage3Duration;
        const eased = 1 - Math.pow(1 - p, 3);
        y = cardPosMid2 + (cardPosEnd - cardPosMid2) * eased;

      // End: stay at -35
      } else {
        y = cardPosEnd;
        letterCardActive = false;
      }

      letterCard.style.transform = `translateY(${y}svh)`;
    }
  }


  /* --- Letter Card Glow Animation --- */
  if (letterCardGlowActive && letterCardGlow) {
    if (!letterCardGlowStart) letterCardGlowStart = timestamp;
    const elapsed = timestamp - letterCardGlowStart;

    // Wait for its independent delay
    if (elapsed < glowIndependentDelay) {
      // keep hidden before glow starts
      letterCardGlow.style.opacity = 0;
      letterCardGlow.style.transform = `scale(${glowScaleMin})`;
    } else {
      const adjustedElapsed = elapsed - glowIndependentDelay;
      let scale = glowScaleMin;

      // Stage 1: scale up
      if (adjustedElapsed < glowInDuration) {
        const p = adjustedElapsed / glowInDuration;
        const eased = 1 - Math.pow(1 - p, 3);
        scale = glowScaleMin + (glowScaleMax - glowScaleMin) * eased;

      // Stage 2: scale down
      } else if (adjustedElapsed < glowInDuration + glowOutDuration) {
        const p = (adjustedElapsed - glowInDuration) / glowOutDuration;
        const eased = 1 - Math.pow(1 - p, 3);
        scale = glowScaleMax + (glowScaleMin - glowScaleMax) * eased;

      // End
      } else {
        scale = glowScaleMin;
        letterCardGlowActive = false;
      }

      letterCardGlow.style.transform = `scale(${scale})`;
      letterCardGlow.style.opacity = scale > 0 ? 1 : 0;
    }
  }

  requestAnimationFrame(tick);
}
  
requestAnimationFrame(tick);

if (openLetter) {
  const handleOpenClick = () => {
    if (!cancelLetterPulse && getLetter) {
      frozenLetterScale = currentLetterScale;

      if (getLetterGlow) {
        const matrixGlow = getComputedStyle(getLetterGlow).transform;
        if (matrixGlow !== "none") {
          const matchGlow = matrixGlow.match(/matrix.*\((.+)\)/);
          if (matchGlow) {
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

    // --- Trigger Lid Animation ---
    if (!lidActive) {
      lidActive = true;
      lidStart = null;
      letterLid.style.zIndex = "900"; // reset initial z-index before animation
    }

    // --- Trigger Seal Fade ---
    if (closeSeal && !sealFadeActive) {
      sealFadeActive = true;
      sealFadeStart = null;
    }

    if (closeLetterBranch && !sealBranchFadeActive) {
      sealBranchFadeActive = true;
      sealBranchStart = null;
    }

    if (sealSparkGlow && !sealSparkGlowFadeActive) {
      sealSparkGlowFadeActive = true;
      sealSparkGlowStart = null;
    }

    if (!sealSparksActive) {
      sealSparksActive = true;
      sealSparksStart = null;
    }

    if (!letterCardActive && letterCard) {
      letterCardActive = true;
      letterCardStart = null;
    }

    if (!letterCardGlowActive && letterCardGlow) {
      letterCardGlowActive = true;
      letterCardGlowStart = null;
    }

    // Remove click listener after first click
    openLetter.removeEventListener("click", handleOpenClick);
  };

  openLetter.addEventListener("click", handleOpenClick);
}













