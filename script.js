console.log("connected");

/* Branch animation */

const getUpperBranch = document.querySelector("#topBranch");
const getLowerBranch = document.querySelector("#bottomBranch");
var BranchId;


let position = 15;
let direction = 1; // 1 for forward, -1 for backward
const minPosition = 0;
const maxPosition = 30; // Example boundaries
const speed = 0.12; // How much to move per frame

function branchMovement() {
  position += direction * speed;
  
  if (position >= maxPosition) {
        position = maxPosition; // Cap at max
        direction = -1; // Reverse direction
    } else if (position <= minPosition) {
        position = minPosition; // Cap at min
        direction = 1; // Reverse direction
  }

  getUpperBranch.style.transform = "rotate(" + position / 10 + "deg)";
  getLowerBranch.style.transform = "rotate(" + position / 10 + "deg)";

  BranchId = requestAnimationFrame(branchMovement);
}

BranchId = requestAnimationFrame(branchMovement);

/* Leaf animation */

const leafMinPosition = 0;
const leafMaxPosition = 30;
const leafSpeed = 0.0015;

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
          leafPosition = leafMaxPosition;
          leafDirection = -1;
        } else if (leafPosition <= leafMinPosition) {
          leafPosition = leafMinPosition;
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


/*

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
