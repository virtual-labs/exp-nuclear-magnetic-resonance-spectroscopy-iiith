"use strict";
let overallIteration = -2;
let divWidth;
let videoSpeed = 1;
let speedFactor = 1.0;
let yellow = "#cecc9b";

async function moveTube() {
  let image = document.getElementById("tube");
  image.setAttribute("opacity", "1");
  let a1 = anime.timeline({
    targets: "#tube",
    duration: 800,
    easing: "linear",
  });
  let transX = 630;
  let transY = -10;
  screenWidth();
  if (divWidth < 769) {
    transX = -10;
    transY = 500;
  }
  if (overallIteration === 2) {
    a1.add({
      duration: 1000,
      translateX: transX,
      translateY: transY,
      scale: 0.4,
    })
      .add({
        opacity: 0,
      })
      .add({
        translateX: 0,
        translateY: 0,
        scale: 1,
      });

    //"instruction" is the Instruction HTML element that will be visible only in wide screens, i.e, width greater than 768px
    document.getElementById("instruction").innerHTML =
      "Click on Observe button to observe what is happening inside the NMR Spectrometer and choose video speed according to your own liking.";

    //"observation" is the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
    document.getElementById("observation").innerHTML =
      "Click on Observe button to observe what is happening inside the NMR Spectrometer and choose video speed according to your own liking.";
    overallIteration++;
    restartAnimation = false;
  }
}

let fillTube = async () => {
  let path = document.getElementById("tube-path");
  let finalPosition = 1;
  let curPosition = 0;
  while (true) {
    if (curPosition > finalPosition) break;
    curPosition += 0.01;
    path.setAttribute("offset", curPosition);
    await new Promise((resolve) => setTimeout(resolve, 0.5));
  }
};

let fillPipette = async (color) => {
  const line = document.getElementById("half-grad2");
  const yFinalPosition = 0;
  document.getElementById("line").style.stopColor = color;
  let yPos = 100;
  const interval = window.setInterval(() => {
    if (yPos < yFinalPosition) {
      line.setAttribute("y1", "0.1%");
      return window.clearInterval(interval);
    }
    yPos -= 0.6;
    line.setAttribute("y1", `${yPos}%`);
  }, 1);
};

async function pourBenzene() {
  if (overallIteration === 1) {
    changeMessage();

    let image = document.getElementById("pipette");
    image.setAttribute("opacity", "1");
    image.style.pointerEvents = "none";
    let a1 = anime.timeline({
      targets: "#pipette",
      duration: 800,
      easing: "linear",
    });
    let startX = "-490%";
    let startY = "-100%";

    let endX = "-430%";
    let endY = "250%";

    screenWidth();

    a1.add({
      duration: 0,
      translateY: startY,
      translateX: startX,
    });
    fillPipette(yellow);
    await new Promise((r) => setTimeout(r, 1000));
    a1.add({
      duration: 500,
      translateX: endX,
    })
      .add({
        duration: 900,
        translateY: endY,
        update: function (anim) {
          fillTube();
        },
      })
      .add({
        opacity: 0,
      });

    document.getElementById("tube").setAttribute("onclick", "moveTube()");
    overallIteration++;
    document.getElementById("benzene").style.cursor = "default";
    document.getElementById("tube").style.cursor = "pointer";

    if (restartAnimation) {
      a1.restart();
    }
  }
}

let setupMessages = [
  "Click on the Benzene option in the Apparatus Menu to introduce it into the workspace.",
  "Click on the NMR Tube option in the Apparatus Menu to introduce it into the workspace.",
  "Click on the NMR Spectrometer option in the Apparatus Menu to introduce it into the workspace.",
];

let setup = 0;

function setupMessage() {
  //"instruction" is the Instruction HTML element that will be visible only in wide screens, i.e, width greater than 768px
  document.getElementById("instruction").innerHTML = setupMessages[setup];
  //"observation" is the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
  document.getElementById("observation").innerHTML = setupMessages[setup];
  setup++;
}

setupMessage();
async function visibility(x) {
  if (x === 1 && overallIteration === -2) {
    document.getElementById("benzene-row").style.visibility = "visible";
    overallIteration++;
    setupMessage();
  } else if (x === 2 && overallIteration === -1) {
    document.getElementById("tube-row").style.visibility = "visible";
    overallIteration++;
    setupMessage();
  } else if (x === 3 && overallIteration === 0) {
    document.getElementById("spectro-row").style.visibility = "visible";
    overallIteration++;
    changeMessage();
  }
}

let instructionMessages = [
  "Click on the Benzene beaker to transfer some amount of Benzene into the NMR Tube.",
  "Click on the Tube to place it into the NMR Spectrometer.",
];
let iter1 = -1;
function changeMessage() {
  iter1++;
  //"instruction" is the Instruction HTML element that will be visible only in wide screens, i.e, width greater than 768px
  document.getElementById("instruction").innerHTML = instructionMessages[iter1];
  //"observation" is the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
  document.getElementById("observation").innerHTML = instructionMessages[iter1];
}

document.getElementById("benzene").style.cursor = "pointer";

let iter2 = -1;
let observationMessages = [
  "Now observe the zoomed in animation of the NMR Spectrometer. It can be seen that the NMR Tube is rotated between Radio Frequency Generator and Radio Frequency Receiver while the Magnetic Field passes through it.",
  "The points on the graph are used to depict the Chemical Shifts.",
];

function observeMessage() {
  if (restartAnimation) {
    return;
  }
  iter2++;

  //"instruction" is the Instruction HTML element that will be visible only in wide screens, i.e, width greater than 768px
  document.getElementById("instruction").innerHTML = observationMessages[iter2];
  //"observation" is the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
  document.getElementById("observation").innerHTML = observationMessages[iter2];
}

function screenWidth() {
  divWidth = document.getElementById("workspace").clientWidth;
}

let originalSimulationHeight =
  document.getElementById("simulation").clientHeight;

document.getElementById("simulation").style.minHeight =
  originalSimulationHeight + "px";

let restartAnimation = false;

async function restart() {
  document.getElementById("simulation").style.height = originalSimulationHeight;

  document.getElementById("animation-video").style.display = "none";
  document.getElementById("plotted-graph-window").style.display = "none";

  //"head-instructions" is the Heading of the Intruction HTML element that will be visible only in wide screens, i.e., width greater than 768px
  document.getElementById("head-instructions").innerHTML = "Instructions";
  //"head-observations" is the Heading of the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
  document.getElementById("head-observations").innerHTML = "Instructions";
  //"instruction" is the Instruction HTML element that will be visible only in wide screens, i.e, width greater than 768px
  document.getElementById("instruction").innerHTML = "";
  //"observation" is the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
  document.getElementById("observation").innerHTML = "";
  overallIteration = -2;
  iter2 = -1;
  iter1 = -1;
  setup = 0;
  setupMessage();
  document.getElementById("apparatus-bottles").style.display = "block";
  document.getElementById("apparatus-spectro").style.display = "block";
  document.getElementById("benzene-row").style.visibility = "hidden";
  document.getElementById("spectro-row").style.visibility = "hidden";
  document.getElementById("tube-row").style.visibility = "hidden";
  document.getElementById("slidecontainer").style.display = "none";
  restartAnimation = true;

  document.getElementById("tube").style.cursor = "default";
  document.getElementById("benzene").style.cursor = "pointer";
  document.getElementById("spectro").style.cursor = "default";

  //Resetting the Cuvette
  let path = document.getElementById("tube-path");
  path.setAttribute("offset", "0%");
  document.getElementById("tube").style.cursor = "default";
  document.getElementById("tube").setAttribute("opacity", "1");
}

async function observe() {
  if (overallIteration === 3) {
    document.getElementById("slidecontainer").style.display = "block";
    document.getElementById("apparatus-bottles").style.display = "none";
    document.getElementById("apparatus-spectro").style.display = "none";
    document.getElementById("animation-video").style.display = "block";
    document.getElementById("animation-bottom-right").play();

    //"head-instructions" is the Heading of the Intruction HTML element that will be visible only in wide screens, i.e., width greater than 768px
    document.getElementById("head-instructions").innerHTML = "Observations";
    //"head-observations" is the Heading of the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
    document.getElementById("head-observations").innerHTML = "Observations";
    //"observation" is the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
    document.getElementById("observation").innerHTML = "";
    //"instruction" is the Instruction HTML element that will be visible only in wide screens, i.e, width greater than 768px
    document.getElementById("instruction").innerHTML = "";

    observeMessage();

    await new Promise((r) => setTimeout(r, 8000 * speedFactor));

    if (!restartAnimation) {
      overallIteration++;

      //"instruction" is the Instruction HTML element that will be visible only in wide screens, i.e, width greater than 768px
      document.getElementById("instruction").innerHTML =
        "Click on Observe option in the Control Menu again to see the graph.";
      //"observation" is the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
      document.getElementById("observation").innerHTML =
        "Click on Observe option in the Control Menu again to see the graph.";
    }
  } else if (overallIteration === 4) {
    observeMessage();

    document.getElementById("slidecontainer").style.display = "none";

    document.getElementById("animation-video").style.display = "none";
    document.getElementById("plotted-graph-window").style.display = "block";
    createGraph();

    overallIteration++;
    setTimeout(function () {
      //"instruction" is the Instruction HTML element that will be visible only in wide screens, i.e, width greater than 768px
      document.getElementById("instruction").innerHTML =
        "Click on Restart option in the Control Menu to restart the experiment from scratch.";
      //"observation" is the Intruction HTML element that will be visible only in small screens, i.e., width smaller than 769px
      document.getElementById("observation").innerHTML =
        "Click on Restart option in the Control Menu to restart the experiment from scratch.";
    }, 10000);
  }
}

let benz = document.getElementById("benzene");
benz.addEventListener("click", pourBenzene);

let tube = document.getElementById("tube");
tube.addEventListener("click", moveTube);

let slider = document.getElementById("slider");
let vid = document.getElementById("animation-bottom-right");
slider.oninput = function () {
  videoSpeed = slider.value;
  vid.playbackRate = videoSpeed;
  speedFactor = 1 / videoSpeed;
};

function createGraph() {
  let trace1 = {
    x: [1, 3, 5, 7, 9, 11],
    y: [0, 0, 0, 7.6, 0, 0],
    type: "bar",
    width: 0.05,
  };

  let data = [trace1];

  var layout = {
    title: "NMR Chemical Shift of Benzene",
    xaxis: {
      title: "ppm",
      showgrid: true,
      zeroline: false,
    },
    yaxis: {
      showgrid: false,
      zeroline: true,
      showline: false,
      showticklabels: false,
    },
  };

  Plotly.newPlot("chart-container", data, layout);
}
