/**********************************************************
 * DOM REFERENCES
 **********************************************************/
const letterlidShadow   = document.querySelector(".letterLidShadow");
const archShadow        = document.querySelector(".bgrArchShadow");

const letterBody        = document.querySelector(".letterBody");
const letterComponents  = document.querySelector(".letterComponents");
const letterLidBox      = document.querySelector(".letterLidBox");

const letterCard        = document.querySelector(".letterCard");
const letterCardGlow    = document.querySelector(".letterCardGlow");
const letterLid         = document.querySelector(".letterLid");

const closeSeal         = document.querySelector(".sealBody");
const closeLetterBranch = document.querySelector(".letterBranchBox");
const sealSparks        = document.querySelectorAll(".sealSpark");
const sealSparkGlow     = document.querySelector(".sealSparkBgrGlow");

const backgroundOverlay = document.querySelector(".bgrMultiply");
const getLightOverlay   = document.querySelector(".bgrOverlayWrapper");
const getLightOverlay2  = document.querySelector(".bgrTopOverlay");

const openLetter        = document.querySelector(".letterWrapper");
const getLetter         = document.querySelector(".letterBox");
const getLetterGlow     = document.querySelector(".letterGlow");

const getsparkBoxes     = document.querySelectorAll(".sparkBox");
const getInitialParagraphs = document.querySelectorAll(".initialParagraph");
const getParagraphLines    = document.querySelectorAll(".paragraphLine");
const getParagraphGlows    = document.querySelectorAll(".paragraphGlow");

const indexBranchTwo    = document.querySelector(".bottomBranchContainer");

/* Containers to mount cloned SVG branches */
const TOP_BRANCH_CONTAINER    = ".topBranchContainer";
const BOTTOM_BRANCH_CONTAINER = ".bottomBranchContainer";

/**********************************************************
 * CONFIGURATION
 **********************************************************/
const svgTemplates = [
  { src: "Assets/svg/topBranchGraphicNew.min.svg",    container: TOP_BRANCH_CONTAINER,    assignId: "topBranch" },
  { src: "Assets/svg/bottomBranchGraphicNew.min.svg", container: BOTTOM_BRANCH_CONTAINER, assignId: "bottomBranch" }
];

/* Leaf selectors inside your SVGs */
const leafSelectors = [".prefix__leaf"];

/* Branch rotation (sway) */
const branchMin = 0;
const branchMax = 30;
const branchSpeed = 0.15;

/* Leaf animation (throttled + batched) */
const leafBatchCount   = 4;   // split visible leaves into this many batches
const leafThrottleRate = 3;   // update leaves every N frames

/* Letter Card Glow timings */
const glowIndependentDelay = 2700;
const glowInDuration  = 2000;
const glowOutDuration = 1500;
const glowScaleMin = 0;
const glowScaleMax = 25;

/* Letter Card translate timings */
const cardDelay           = 1550;
const cardStage1Duration  = 400;
const cardStage2Duration  = 400;
const cardStage3Duration  = 800;
const cardStage4Duration  = 3400;

const cardPosStart = 0;
const cardPosMid1  = -3;
const cardPosMid2  = 0;
const cardPosMid3  = -35;
const cardPosEnd   = 48;

const cardZindexInitial = 700;
const cardZindexFinal   = 900;
const cardZindexDelay   = 2700;

/* Letter Lid rotation */
const lidDelay      = 800;
const lidDuration   = 1500;
const lidZindexDelay= 1500;
const lidStartRot   = 0;
const lidEndRot     = 180;

/* Seal timings */
const sealDuration        = 800;
const sealSparkGlowOffset = 200;
const sealSparksOffset    = 200;

/* Background overlay */
const overlayDelay      = 2000;
const overlayDuration   = 1500;
const overlayOpacityMax = 1;
const overlayOpacityMin = 0.92;

const bgrFadeDuration = 1000;
const bgrFadeDelay    = 4000;

/* Light overlay pulse/fade */
const delayLightOverlay = 2000;
const lightStartScale   = 0.001;
const lightMaxScale     = 1.1;
const lightMinPulse     = 1.0;

/* Letter entrance/pulse */
const startY         = 8;
const startRotation  = -270;
const startScale     = 0.1;
const letterPosition = -140;
const letterRotation = 0;
const letterScale    = 1;
const letterDuration = 2500;
const pulseMaxScale  = 1.1;
const pulseDuration  = 4000;
const letterGlowMin  = 0.7;
const letterGlowMax  = 1;
const startDelay     = 25000;

/* Spinning sparks (inside sparkBoxes) */
const minAngle   = 0;
const maxAngle   = 360;
const angleSpeed = 1;

/**********************************************************
 * STATE
 **********************************************************/
let lastTimestamp = null;

/* Branch sway state */
let branchPosition = 15;
let branchDirection = 1;
let branchLastTime = null;

/* Leaves state */
let leaves = [];
let activeLeaves = [];
const leafMap = new WeakMap(); // element -> leaf
let currentBatch = 0;
let leafThrottleCounter = 0;

/* Light overlay */
let lightFadeActive = false;
let lightFadeStartTime = null;
let lightOverlayStartTime = null;
let lightScale = lightStartScale;
let lightPhase = "grow";
let lightDirection = -1;
let lightOverlayFrozen = false;
let frozenLightScale = lightStartScale;

/* Background overlay fade */
let bgrOverlayStartTime;
let bgrFadeActive = false;
let bgrFadeStart  = null;
let bgrFadeComplete = false;

/* Letter card / glow */
let letterCardActive = false;
let letterCardStart  = null;
let letterCardZindexChanged = false;

let letterCardGlowActive = false;
let letterCardGlowStart  = null;

/* Lid */
let lidActive = false;
let lidStart  = null;

/* Letter pulse freeze */
let cancelLetterPulse = false;
let frozenLetterScale = null;
let frozenGlowScale   = null;
let glowFade = false;
let glowOpacity = 1;
let currentLetterScale = 1;

/* Seal fades */
let sealFadeActive = false;
let sealFadeStart  = null;

let sealBranchFadeActive = false;
let sealBranchStart  = null;

let sealSparkGlowFadeActive = false;
let sealSparkGlowStart  = null;

let sealSparksActive = false;
let sealSparksStart  = null;

/* Seal sparks (DOM, not in sparkBoxes) */
const sealSparkData = [];

/**********************************************************
 * UTILITIES
 **********************************************************/
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

/**********************************************************
 * SVG CLONING (TOP & BOTTOM BRANCHES)
 **********************************************************/
async function loadAndMountBranches() {
  for (const { src, container, assignId } of svgTemplates) {
    const target = document.querySelector(container);
    if (!target) continue;

    try {
      const svgText = await fetch(src).then(r => r.text());
      const parser  = new DOMParser();
      const svgDoc  = parser.parseFromString(svgText, "image/svg+xml");
      const svgEl   = svgDoc.documentElement;

      const wrapper = document.createElement("div");
      wrapper.className = "branch";
      if (assignId) wrapper.id = assignId;

      wrapper.appendChild(svgEl);
      target.appendChild(wrapper);

      // Ensure SVG is in DOM before initializing leaves
      await new Promise(r => setTimeout(r, 0));
      initLeavesForBranch(wrapper);
    } catch(e) {}
  }

  updateActiveLeaves();
}


/* Initialize leaves in a single mounted branch wrapper */
function initLeavesForBranch(branchWrapper) {
  const leafTargets = branchWrapper.querySelectorAll(leafSelectors.join(","));
  if (!leafTargets.length) return;

  // Create per-branch leaves array for local reference
  const branchLeaves = [];

  // Prepare transform style optimizations
  leafTargets.forEach(leafTarget => {
    const leafObj = {
      el: leafTarget,
      active: true, // always start active
      obsDebounce: null,
      pos: Math.random() * 6 - 3,
      dir: Math.random() < 0.5 ? 1 : -1,
      speed: 2 + Math.random() * 4,
      maxAngle: 10 + Math.random() * 35,
      prevPos: null
    };

    leaves.push(leafObj);
    leafMap.set(leafTarget, leafObj);
    branchLeaves.push(leafObj);

    // Style optimizations
    try {
      leafTarget.style.willChange = "transform";
      leafTarget.style.transformBox = "fill-box";
      leafTarget.style.transform = `rotate(${leafObj.pos}deg) translateZ(0)`;
    } catch (e) {}
  });

  // Attach leaves to this branch for quick toggling
  branchWrapper.leaves = branchLeaves;

  // --- One observer per branch ---
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const isVisible = entry.isIntersecting;

      // Toggle visibility for all leaves in this branch
      if (branchWrapper.leaves) {
        branchWrapper.leaves.forEach(l => {
          l.active = isVisible;
        });
      }
    });

    // Schedule async update once per frame
    Promise.resolve().then(updateActiveLeaves);
  }, {
    root: null,
    rootMargin: "100px 0px", // looser margin to prevent flicker on scroll
    threshold: 0.1
  });

  // Observe the branch container, not individual leaves
  observer.observe(branchWrapper);

  let visibilityTick = 0;
  setInterval(() => {
    visibilityTick = (visibilityTick + 1) % 2;
    branchWrapper.style.willChange = visibilityTick ? "transform" : "opacity";
  }, 3000);
}


/* Rebuild cached visible list once (not per frame) */
function updateActiveLeaves() {
  activeLeaves = leaves.filter(l => l.active);
  activeLeaves.forEach(l => (l.prevPos = l.pos));
}

/**********************************************************
 * LEAF SWAY (THROTTLED + BATCHED)
 **********************************************************/
function updateLeaves(delta) {
  leafThrottleCounter++;
  if (leafThrottleCounter < leafThrottleRate) return;
  leafThrottleCounter = 0;

  if (!activeLeaves.length) return;

  const batchSize = Math.ceil(activeLeaves.length / leafBatchCount);
  const start = currentBatch * batchSize;
  const end   = start + batchSize;
  const batchLeaves = activeLeaves.slice(start, end);

  for (let i = 0; i < batchLeaves.length; i++) {
    const leaf = batchLeaves[i];

    leaf.pos += leaf.dir * leaf.speed * delta;

    if (Math.abs(leaf.pos) > leaf.maxAngle) {
      leaf.dir *= -1;
      leaf.pos = Math.sign(leaf.pos) * leaf.maxAngle;
    }

    if (Math.abs(leaf.pos - (leaf.prevPos ?? leaf.pos)) >= 0.1) {
      leaf.el.style.transform = `rotate(${leaf.pos}deg) translateZ(0)`;
      leaf.prevPos = leaf.pos;
    }
  }

  currentBatch = (currentBatch + 1) % leafBatchCount;
}

/**********************************************************
 * PARAGRAPH MASKS
 **********************************************************/
getParagraphLines.forEach(l => {
  try { l.style.willChange = "mask-position,-webkit-mask-position"; l.style.setProperty('--mask-x','100%'); } catch(e){}
});
getParagraphGlows.forEach(l => {
  try { l.style.willChange = "mask-position,-webkit-mask-position"; l.style.setProperty('--mask-x','650%'); } catch(e){}
});

function animateMask(line, start, end, duration){
  let startTime = null;
  function step(ts){
    if(!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);
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
  function step(ts){
    if(!startTime) startTime = ts;
    const elapsed = ts - startTime;
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

/**********************************************************
 * SPINNING SPARKS (sparkBoxes)
 **********************************************************/

/* --- Spark Animation System (Optimized & Inline) --- */

// SVG sources mapped to their containers
const sparkTemplates = [
  { src: "Assets/svg/backgroundSparksStart.svg", container: ".sparkGrpStart" },
  { src: "Assets/svg/backgroundSparkMiddle.svg", container: ".sparkGrpMiddle" },
  { src: "Assets/svg/backgroundSparkEnd.svg", container: ".sparkGrpEnd" }
];

const sparkBoxes = [];
const sparkCache = [];
const sparkBatchCount = 4;
let sparkCurrentBatch = 0;
let sparkFrameThrottle = 0;
const sparkThrottleRate = 2; // update every 2 frames (for mobile perf)

/* Load and mount all sparks once */
async function loadAndMountSparks() {
  for (const { src, container } of sparkTemplates) {
    const target = document.querySelector(container);
    if (!target) continue;

    try {
      const svgText = await fetch(src).then(r => r.text());
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svgEl = svgDoc.documentElement;

      // Wrap SVG for style consistency
      const wrapper = document.createElement("div");
      wrapper.className = "sparkBox";
      wrapper.appendChild(svgEl);
      target.appendChild(wrapper);

      initSparksForBox(wrapper);
    } catch (err) {
      console.warn("Failed to load spark SVG:", src, err);
    }
  }

  observeSparkBoxes();
}

/* Initialize spark elements within each loaded SVG */
function initSparksForBox(wrapper) {
  const sparks = wrapper.querySelectorAll(".spark");
  if (!sparks.length) return;

  const boxData = {
    el: wrapper,
    sparks: [],
    active: true
  };

  sparks.forEach(spark => {
    const sparkObj = {
      el: spark,
      angle: Math.random() * 360,
      speed: 3 + Math.random() * 4
    };

    spark.style.transformOrigin = "center";
    spark.style.transformBox = "fill-box";
    spark.style.willChange = "transform";
    spark.style.transform = `rotate(${sparkObj.angle}deg) translateZ(0)`;

    boxData.sparks.push(sparkObj);
    sparkCache.push(sparkObj);
  });

  sparkBoxes.push(boxData);
}

/* Observe visibility per spark group */
const sparkObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const box = sparkBoxes.find(b => b.el === entry.target);
    if (box) box.active = entry.isIntersecting;
  });
}, { root: null, rootMargin: "200px 0px", threshold: 0.05 });

function observeSparkBoxes() {
  sparkBoxes.forEach(box => sparkObserver.observe(box.el));
}

/* --- Spark rotation update (called inside tick) --- */
function updateSparks(delta) {
  sparkFrameThrottle++;
  if (sparkFrameThrottle < sparkThrottleRate) return;
  sparkFrameThrottle = 0;

  const batchSize = Math.ceil(sparkCache.length / sparkBatchCount);
  const start = sparkCurrentBatch * batchSize;
  const end = start + batchSize;
  const batch = sparkCache.slice(start, end);

  batch.forEach(sparkObj => {
    const parentBox = sparkBoxes.find(b => b.sparks.includes(sparkObj));
    if (!parentBox || !parentBox.active) return;

    sparkObj.angle += sparkObj.speed * delta;
    if (sparkObj.angle > 360) sparkObj.angle -= 360;
    sparkObj.el.style.transform = `rotate(${sparkObj.angle}deg) translateZ(0)`;
  });

  sparkCurrentBatch = (sparkCurrentBatch + 1) % sparkBatchCount;
}

/* Initialize sparks once */
loadAndMountSparks();


/**********************************************************
 * SEAL SPARKS (plain DOM elements)
 **********************************************************/
sealSparks.forEach(spark => {
  const computed = getComputedStyle(spark);
  const matrix = computed.transform;
  let tx = 0, ty = 0, rot = 0;
  if (matrix && matrix !== "none") {
    const match = matrix.match(/matrix\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(",").map(v => parseFloat(v.trim()));
      const a = values[0], b = values[1], e = values[4], f = values[5];
      tx = e; ty = f; rot = Math.atan2(b, a) * (180 / Math.PI);
    }
  }
  sealSparkData.push({ el: spark, tx, ty, rot, startTime: null, opacity: 0 });
  spark.style.opacity = 0;
  spark.style.transform = "translate(0px,0px) rotate(0deg)";
  spark.style.willChange = "opacity, transform";
});

/**********************************************************
 * LETTER / LIGHT / OVERLAY / CARD / LID HELPERS
 **********************************************************/
function alwaysApplyLightScale(){
  if (getLightOverlay)  getLightOverlay.style.transform  = `scale(${lightScale}) translateZ(0)`;
  if (getLightOverlay2) getLightOverlay2.style.transform = `scale(${lightScale}) translateZ(0)`;
}

/**********************************************************
 * MAIN RAF LOOP
 **********************************************************/
function tick(timestamp){
  if(!lastTimestamp) lastTimestamp = timestamp;
  const delta = Math.min((timestamp - lastTimestamp) / 16.666, 5);
  lastTimestamp = timestamp;

  /* --- Branch sway --- */
  if(!branchLastTime) branchLastTime = timestamp;
  let branchDelta = Math.min((timestamp - branchLastTime) / 16.666, 5);
  branchLastTime = timestamp;

  branchPosition += branchDirection * branchSpeed * branchDelta;
  if (branchPosition >= branchMax) { branchPosition = branchMax; branchDirection = -1; }
  else if (branchPosition <= branchMin) { branchPosition = branchMin; branchDirection = 1; }

  const branchRotation = `rotate(${branchPosition / 10}deg)`;
  const getUpperBranch = document.querySelector("#topBranch");
  const getLowerBranch = document.querySelector("#bottomBranch");
  if (getUpperBranch) getUpperBranch.style.transform = branchRotation;
  if (getLowerBranch) getLowerBranch.style.transform = branchRotation;

  /* --- Leaf sway (throttled + batched) --- */
  updateLeaves(delta);
  updateSparks(delta);

  /* --- Background overlay auto fade --- */
  if (!bgrOverlayStartTime) bgrOverlayStartTime = timestamp;
  const overlayElapsed = timestamp - bgrOverlayStartTime;

  if (!bgrFadeActive && !bgrFadeComplete) {
    if (overlayElapsed >= overlayDelay) {
      const fadeElapsed = overlayElapsed - overlayDelay;
      const progress = Math.min(fadeElapsed / overlayDuration, 1);
      const currentOpacity = overlayOpacityMax - (overlayOpacityMax - overlayOpacityMin) * progress;
      if (backgroundOverlay) backgroundOverlay.style.opacity = currentOpacity;
    }
  }

  /* --- Background overlay manual fade --- */
  if (bgrFadeActive && backgroundOverlay && !bgrFadeComplete) {
    if (!bgrFadeStart) bgrFadeStart = timestamp;

    const elapsed = timestamp - bgrFadeStart;
    let fadeProgress = 0;

    if (elapsed >= bgrFadeDelay) {
      const fadeElapsed = elapsed - bgrFadeDelay;
      fadeProgress = Math.min(fadeElapsed / bgrFadeDuration, 1);
    }

    const eased = easeOutCubic(fadeProgress);
    const startOpacity = overlayOpacityMin;
    const currentOpacity = startOpacity * (1 - eased);
    backgroundOverlay.style.opacity = Math.max(currentOpacity, 0);

    if (fadeProgress >= 1) {
      backgroundOverlay.style.opacity = 0;
      bgrFadeActive = false;
      bgrFadeComplete = true;
    }
  }

  /* --- Light overlay pulse/fade --- */
  if (!lightOverlayStartTime) lightOverlayStartTime = timestamp;
  const elapsedLight = timestamp - lightOverlayStartTime;

  if (!lightFadeActive && !lightOverlayFrozen) {
    if (elapsedLight < delayLightOverlay) {
      lightScale = lightStartScale;
    } else {
      if (lightPhase === "grow") {
        lightScale += 0.012 * delta;
        if (lightScale >= lightMaxScale) {
          lightScale = lightMaxScale;
          lightPhase = "pulse";
        }
      } else if (lightPhase === "pulse") {
        lightScale += lightDirection * 0.001 * delta;
        if (lightScale >= lightMaxScale) lightDirection = -1;
        if (lightScale <= lightMinPulse) lightDirection = 1;
      }
    }
  } else if (lightFadeActive) {
    if (!lightOverlayFrozen) {
      frozenLightScale = lightScale;
      lightOverlayFrozen = true;
    }
    lightScale = frozenLightScale;

    if (!lightFadeStartTime) lightFadeStartTime = timestamp;
    const fadeElapsedTotal = timestamp - lightFadeStartTime;

    let fadeProgress = 0;
    if (fadeElapsedTotal >= bgrFadeDelay) {
      const fadeElapsed = fadeElapsedTotal - bgrFadeDelay;
      fadeProgress = Math.min(fadeElapsed / bgrFadeDuration, 1);
    }

    const eased = easeOutCubic(fadeProgress);
    const opacityVal = 1 - eased;
    if (getLightOverlay)  getLightOverlay.style.opacity  = opacityVal;
    if (getLightOverlay2) getLightOverlay2.style.opacity = opacityVal;

    if (archShadow) {
      const current = parseFloat(getComputedStyle(archShadow).opacity) || 1;
      const target = 0.2;
      const archOpacity = current + (target - current) * eased;
      archShadow.style.opacity = archOpacity;
    }

    if (fadeProgress >= 1) {
      lightFadeActive = false;
    }
  }

  alwaysApplyLightScale();
  if (!lightFadeActive && !lightOverlayFrozen) {
    if (getLightOverlay)  getLightOverlay.style.opacity  = 1;
    if (getLightOverlay2) getLightOverlay2.style.opacity = 1;
  }


  /* --- Letter entrance + pulse --- */
  let pulseBaselineScale = null;
  if(getLetter){
    let elapsedLetter = timestamp;

    if(elapsedLetter >= startDelay){
      const animTime = elapsedLetter - startDelay;

      const entranceProgress = Math.min(animTime / letterDuration, 1);
      const easedProgress = easeOutCubic(entranceProgress);

      const finalY = startY + (letterPosition - startY) * easedProgress;
      const finalRotation = startRotation + (letterRotation - startRotation) * easedProgress;

      if(entranceProgress < 1){
        const currentScale = startScale + (letterScale - startScale) * easedProgress;
        getLetter.style.transform = `translateY(${finalY}%) rotateY(${finalRotation}deg) scale(${currentScale})`;
        currentLetterScale = currentScale;
      } else {
        if(pulseBaselineScale === null){
          pulseBaselineScale = startScale + (letterScale - startScale) * 1;
        }

        if(!cancelLetterPulse){
          const pulseElapsed = animTime - letterDuration;
          const t = pulseElapsed / pulseDuration * Math.PI * 2;
          const sine = Math.sin(t - Math.PI / 2);
          const pulseProgress = (sine + 1) / 2;

          const pulseScale = pulseBaselineScale + (pulseMaxScale - pulseBaselineScale) * pulseProgress;

          getLetter.style.transform = `translateY(${finalY}%) rotateY(${finalRotation}deg) scale(${pulseScale})`;
          currentLetterScale = pulseScale;

          if(getLetterGlow && !glowFade){
            const glowScale = letterGlowMin + ((pulseScale - pulseBaselineScale) / (pulseMaxScale - pulseBaselineScale)) * (letterGlowMax - letterGlowMin);
            getLetterGlow.style.transform = `scale(${glowScale})`;
            getLetterGlow.style.opacity = "1";
          }
        } else {
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

  /* --- Seal fade --- */
  if (sealFadeActive && closeSeal) {
    if (!sealFadeStart) sealFadeStart = timestamp;
    const sealElapsed = timestamp - sealFadeStart;
    const progress = Math.min(sealElapsed / sealDuration, 1);
    const eased = easeOutCubic(progress);
    const opacityVal = 1 - eased;
    closeSeal.style.opacity = opacityVal;
    const scaleVal = 1 + 0.15 * eased;
    closeSeal.style.transform = `scale(${scaleVal}) translateZ(0)`;
    if (progress >= 1) {
      closeSeal.style.opacity = 0;
      closeSeal.style.transform = `scale(${scaleVal}) translateZ(0)`;
      closeSeal.style.pointerEvents = "none";
      sealFadeActive = false;
    }
  }

  /* --- Seal Branch fade --- */
  if (sealBranchFadeActive && closeLetterBranch) {
    if (!sealBranchStart) sealBranchStart = timestamp;
    const branchElapsed = timestamp - sealBranchStart;
    const progress = Math.min(branchElapsed / sealDuration, 1);
    const eased = easeOutCubic(progress);
    const opacityVal = 1 - eased;
    closeLetterBranch.style.opacity = opacityVal;
    const scaleVal = 1 + 0.15 * eased;
    closeLetterBranch.style.transform = `scale(${scaleVal}) translateZ(0)`;
    if (progress >= 1) {
      closeLetterBranch.style.opacity = 0;
      closeLetterBranch.style.transform = `scale(${scaleVal}) translateZ(0)`;
      closeLetterBranch.style.pointerEvents = "none";
      sealBranchFadeActive = false;
    }
  }

  /* --- Seal Spark Glow --- */
  if (sealSparkGlowFadeActive && sealSparkGlow) {
    if (!sealSparkGlowStart) {
      sealSparkGlowStart = timestamp;
      sealSparkGlow.style.opacity = 0;
      sealSparkGlow.style.transform = "scale(0.8) translateZ(0)";
    }

    const elapsed = timestamp - sealSparkGlowStart;

    if (elapsed < sealSparkGlowOffset) {
      sealSparkGlow.style.opacity = 0;
    } else {
      const adjustedElapsed = elapsed - sealSparkGlowOffset;
      const fadeInDuration = 350;
      const holdDuration   = 50;
      const fadeOutDuration= 800;
      const totalDuration  = fadeInDuration + holdDuration + fadeOutDuration;
      const progress = Math.min(adjustedElapsed / totalDuration, 1);

      let opacityVal;
      if (adjustedElapsed <= fadeInDuration) {
        const t = adjustedElapsed / fadeInDuration;
        opacityVal = easeOutCubic(t);
      } else if (adjustedElapsed <= fadeInDuration + holdDuration) {
        opacityVal = 1;
      } else {
        const t = (adjustedElapsed - fadeInDuration - holdDuration) / fadeOutDuration;
        opacityVal = 1 - easeOutCubic(t);
      }

      const scaleGrowthSpeed = 0.0008;
      const baseScale = 0.8;
      const continuousScale = baseScale + adjustedElapsed * scaleGrowthSpeed;

      sealSparkGlow.style.opacity = opacityVal;
      sealSparkGlow.style.transform = `scale(${continuousScale}) translateZ(0)`;

      if (adjustedElapsed >= totalDuration) {
        sealSparkGlow.style.opacity = 0;
        sealSparkGlowFadeActive = false;
      }
    }
  }

  /* --- Seal Sparks (DOM elements) --- */
  if (sealSparksActive) {
    if (!sealSparksStart) sealSparksStart = timestamp;
    const elapsed = timestamp - sealSparksStart;

    if (elapsed < sealSparksOffset) {
      sealSparkData.forEach(sparkObj => {
        try {
          sparkObj.el.style.opacity = 0;
          sparkObj.el.style.transform = "translate(0px, 0px) scale(0.8) translateZ(0)";
        } catch (e) {}
      });
    } else {
      const adjustedElapsed = elapsed - sealSparksOffset;

      const translateDuration   = 1500;
      const opacityInDuration   = 200;
      const opacityHoldDuration = 0;
      const opacityOutDuration  = 500;
      const opacityTotal = opacityInDuration + opacityHoldDuration + opacityOutDuration;

      let anyActive = false;

      sealSparkData.forEach(sparkObj => {
        const { el, tx, ty } = sparkObj;

        let transform;
        if (adjustedElapsed < translateDuration) {
          const t = adjustedElapsed / translateDuration;
          const eased = easeOutCubic(t);
          const x = tx * eased;
          const y = ty * eased;
          transform = `translate(${x}px, ${y}px)`;
          anyActive = true;
        } else {
          transform = `translate(${tx}px, ${ty}px)`;
        }

        let opacity;
        if (adjustedElapsed < opacityInDuration) {
          const t = adjustedElapsed / opacityInDuration;
          opacity = Math.min(Math.max(easeOutCubic(t), 0), 1);
          anyActive = true;
        } else if (adjustedElapsed < opacityInDuration + opacityHoldDuration) {
          opacity = 1;
          anyActive = true;
        } else if (adjustedElapsed < opacityTotal) {
          const t = (adjustedElapsed - opacityInDuration - opacityHoldDuration) / opacityOutDuration;
          opacity = Math.min(Math.max(1 - Math.pow(t, 3), 0), 1);
          anyActive = true;
        } else {
          opacity = 0;
        }

        try {
          el.style.transform = transform + " translateZ(0)";
          el.style.opacity = opacity;
        } catch (e) {}
      });

      if (!anyActive) {
        sealSparksActive = false;
        sealSparksStart = null;
      }
    }
  }

  /* --- Letter Lid rotation --- */
  if (lidActive && letterLid) {
    if (!lidStart) lidStart = timestamp;
    const elapsed = timestamp - lidStart;

    if (elapsed >= lidDelay) {
      const rotElapsed = elapsed - lidDelay;
      const progress = Math.min(rotElapsed / lidDuration, 1);
      const eased = easeOutCubic(progress);
      const currentRot = lidStartRot + (lidEndRot - lidStartRot) * eased;
      letterLid.style.transform = `rotateX(${currentRot}deg)`;

      if (letterlidShadow) {
        if (progress < 0.5) {
          letterlidShadow.style.filter = "brightness(0.8)";
        } else {
          letterlidShadow.style.filter = "none";
        }
      }
    }

    if (elapsed >= lidZindexDelay) {
      letterLid.style.zIndex = "600";
    }

    if (elapsed >= lidDelay + lidDuration && elapsed >= lidZindexDelay) {
      lidActive = false;
    }
  }

  /* --- Letter Card translate --- */
  if (letterCardActive && letterCard) {
    if (!letterCardStart) {
      letterCardStart = timestamp;
      letterCard.style.zIndex = cardZindexInitial;
      letterCardZindexChanged = false;
    }

    const elapsed = timestamp - letterCardStart;

    if (!letterCardZindexChanged && elapsed >= cardZindexDelay) {
      letterCard.style.zIndex = cardZindexFinal;
      letterCardZindexChanged = true;
    }

    if (elapsed >= cardDelay) {
      const t = elapsed - cardDelay;
      let y = cardPosStart;
      let scaleX = 1;
      let scaleY = 1;

      const stage4Delay = 1800;

      if (t < cardStage1Duration) {
        const p = t / cardStage1Duration;
        const eased = easeOutCubic(p);
        y = cardPosStart + (cardPosMid1 - cardPosStart) * eased;

      } else if (t < cardStage1Duration + cardStage2Duration) {
        const p = (t - cardStage1Duration) / cardStage2Duration;
        const eased = easeOutCubic(p);
        y = cardPosMid1 + (cardPosMid2 - cardPosMid1) * eased;

      } else if (t < cardStage1Duration + cardStage2Duration + cardStage3Duration) {
        const p = (t - cardStage1Duration - cardStage2Duration) / cardStage3Duration;
        const eased = easeOutCubic(p);
        y = cardPosMid2 + (cardPosMid3 - cardPosMid2) * eased;

      } else if (t < cardStage1Duration + cardStage2Duration + cardStage3Duration + cardStage4Duration + stage4Delay) {
        const t4 = t - (cardStage1Duration + cardStage2Duration + cardStage3Duration);

        if (t4 < stage4Delay) {
          y = cardPosMid3;
          scaleX = 1;
          scaleY = 1;
        } else {
          const p = (t4 - stage4Delay) / cardStage4Duration;
          const eased = easeOutCubic(Math.min(p, 1));
          const easedScale = Math.pow(Math.min(p, 1), 1.2);
          y = cardPosMid3 + (cardPosEnd - cardPosMid3) * eased;

          const clampedP = Math.min(p, 1);
          scaleX = 1 + (1.9 - 1.0) * easedScale;
          scaleY = 1 + (2.0 - 1.0) * easedScale;

          if (clampedP >= 0.2 && indexBranchTwo && !indexBranchTwo.triggered) {
            indexBranchTwo.style.zIndex = 200;
            indexBranchTwo.triggered = true;
          }

          if (clampedP >= 0.2 && letterCard && !letterCard.triggered) {
            letterCard.style.filter = "drop-shadow(0px 0px 3px rgba(0,0,0,0.3))";
            letterCard.triggered = true;
          }
        }

      } else {
        y = cardPosEnd;
        scaleX = 1.9;
        scaleY = 2.0;
        letterCardActive = false;
      }

      letterCard.style.transform = `translateY(${y}svh) scale(${scaleX}, ${scaleY})`;
    }
  }

  /* --- Letter Card Glow --- */
  if (letterCardGlowActive && letterCardGlow) {
    if (!letterCardGlowStart) letterCardGlowStart = timestamp;
    const elapsed = timestamp - letterCardGlowStart;

    if (elapsed < glowIndependentDelay) {
      letterCardGlow.style.opacity = 0;
      letterCardGlow.style.transform = `scale(${glowScaleMin})`;
    } else {
      const adjustedElapsed = elapsed - glowIndependentDelay;
      let scale = glowScaleMin;
      let opacity = 1;

      if (adjustedElapsed < glowInDuration) {
        const p = adjustedElapsed / glowInDuration;
        const eased = easeOutCubic(p);
        scale = glowScaleMin + (glowScaleMax - glowScaleMin) * eased;
        opacity = 1;

      } else if (adjustedElapsed < glowInDuration + glowOutDuration) {
        const p = (adjustedElapsed - glowInDuration) / glowOutDuration;
        const eased = easeOutCubic(p);
        scale = glowScaleMax + (glowScaleMin - glowScaleMax) * eased;
        opacity = 1 - eased;
        letterBody.style.opacity = 0;
        letterComponents.style.opacity = 0;
        letterLidBox.style.opacity = 0;

      } else {
        scale = glowScaleMin;
        opacity = 0;
        letterCardGlowActive = false;
      }

      letterCardGlow.style.transform = `scale(${scale})`;
      letterCardGlow.style.opacity = opacity;
    }
  }

  requestAnimationFrame(tick);
}

/**********************************************************
 * CLICK HANDLER
 **********************************************************/
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

    if (!lidActive) {
      lidActive = true;
      lidStart = null;
      letterLid.style.zIndex = "900";
    }

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

    if (!lightFadeActive) {
      lightFadeActive = true;
      lightFadeStartTime = null;
    }

    if (!bgrFadeActive) {
      bgrFadeActive = true;
      bgrFadeStart = null;
    }

    openLetter.removeEventListener("click", handleOpenClick);
  };

  openLetter.addEventListener("click", handleOpenClick);
}

/**********************************************************
 * STARTUP
 **********************************************************/
loadAndMountBranches();     // clone & mount the two SVG branches and init leaves
requestAnimationFrame(tick); // kick off RAF loop
