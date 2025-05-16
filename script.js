console.log("connected");

const getOverlays = document.querySelectorAll(".bgrOverlay");

getOverlays.forEach(overlay => {
    console.log(overlay);
});

var array = ['some', 'array', 'containing', 'words'];
var interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
array.forEach(function (el, index) {
  setTimeout(function () {
    console.log(el);
  }, index * interval);
});
console.log('Loop finished.');