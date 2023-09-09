let isPositionSelected = false;
let isOrientationSelected = false;
let isJoueurSelected = false;
let isFirstPinpointInPair = false;
let pinpointCount = 0;
let pinpointData = [];


function selectControl(index) {
  const buttons = document.getElementsByClassName("control-button");
  for (let i = 0; i < buttons.length; i++) {
    if (i === index) {
      buttons[i].classList.add("selected");
    } else {
      buttons[i].classList.remove("selected");
    }
      isFirstPinpointInPair = false;
  }

  const footballPitchDiv = document.getElementById("footballPitch");
  if (index === 0) {
    // Hide footballPitch div and disable pinpoint placement for Position option
    footballPitchDiv.classList.add("hidden");
    isPositionSelected = false;
    isOrientationSelected = false;
    isJoueurSelected = false;
    pinpointCount = 0;
  } else if (index === 1) {
    // Show footballPitch div and enable pinpoint placement for Orientation option
    footballPitchDiv.classList.remove("hidden");
    isPositionSelected = true;
    isOrientationSelected = false;
    isJoueurSelected = false;
    pinpointCount = 0;
  } else if (index === 2) {
    // Show footballPitch div and enable pinpoint placement for 3 Touches Loss with Orientation
    footballPitchDiv.classList.remove("hidden");
    isPositionSelected = false;
    isOrientationSelected = true;
    isJoueurSelected = false;
    pinpointCount = 0;
  } else if (index === 3) {
    // Hide footballPitch div and disable pinpoint placement for Joueur option
    footballPitchDiv.classList.add("hidden");
    isPositionSelected = false;
    isOrientationSelected = false;
    isJoueurSelected = true;
    pinpointCount = 0;
  }
}
function scaleCoordinate(value, max) {
  return (value / max) * 100;
}

function placePinpoint(event) {
  const footballPitchDiv = document.getElementById("footballPitch");
  const pitchWidth = footballPitchDiv.clientWidth;
  const pitchHeight = footballPitchDiv.clientHeight;
  const x = scaleCoordinate(event.clientX - footballPitchDiv.offsetLeft, pitchWidth);
  const y = scaleCoordinate(event.clientY - footballPitchDiv.offsetTop, pitchHeight);

  const pinpoint = document.createElement("div");
  pinpoint.className = "pinpoint";
  pinpoint.style.left = x + "%";
  pinpoint.style.top = y + "%";
  footballPitchDiv.appendChild(pinpoint);
  pinpointCount++;

  if (isPositionSelected && pinpointCount === 1) {
    // Open the fifth modal after placing the first pinpoint for Position option
    openFifthModal();
    const pinpointDataEntry = { x, y, x1: 0, y1: 0 }; // Set x1 and y1 to 0 for Position option
    pinpointData.push(pinpointDataEntry);
  } else if (isOrientationSelected) {
    if (pinpointCount === 1) {
      // For Orientation option, store the coordinates of the first pinpoint in a pair
      pinpointData.push({ x, y, x1: 0, y1: 0 }); // Set x1 and y1 to 0 for the first pinpoint
      isFirstPinpointInPair = true; // Set the flag for the next pair
    } else {
      // Store the coordinates of the second pinpoint in the pair and open the first modal
      const lastIndex = pinpointData.length - 1;
      pinpointData[lastIndex].x1 = x;
      pinpointData[lastIndex].y1 = y;
      openFirstModal();
    }
  }
}



function openFifthModal() {
  document.getElementById("fifth-modal-container").classList.add("show-modal");
}

function openFirstModal() {
  document.getElementById("first-modal-container").classList.add("show-modal");
}

function closeAllModals() {
  const modalContainers = document.getElementsByClassName("modal__container");
  for (const container of modalContainers) {
    container.classList.remove("show-modal");
  }
}

document.getElementById("footballPitch").addEventListener("click", placePinpoint);

const closeButtonElements = document.getElementsByClassName("close-modal");
for (const closeButton of closeButtonElements) {
  closeButton.addEventListener("click", () => {
    closeAllModals();
    pinpointCount = 0; // Reset the pinpoint count when all modals are closed
  });
}

document.getElementById("Recovery").addEventListener("click", openFourthModal);
document.getElementById("Loss").addEventListener("click", openFourthModal);
document.getElementById("3TouchesLoss").addEventListener("click", openFourthModal);

function openFourthModal() {
  // Close the current open fifth modal, if any
  const fifthModal = document.getElementById("fifth-modal-container");
  if (fifthModal.classList.contains("show-modal")) {
    fifthModal.classList.remove("show-modal");
  }

  // Code to open the fourth modal goes here
  document.getElementById("fourth-modal-container").classList.add("show-modal");
}

function openThirdModal() {
  // Code to open the third modal goes here
  document.getElementById("third-modal-container").classList.add("show-modal");
}

document.getElementById("Pass").addEventListener("click", openOtherModals);
document.getElementById("FailedPass").addEventListener("click", openOtherModals);
document.getElementById("Progression").addEventListener("click", openOtherModals);
document.getElementById("Call").addEventListener("click", openOtherModals);

function openOtherModals() {
  // Close the current open first modal, if any
  const firstModal = document.getElementById("first-modal-container");
  if (firstModal.classList.contains("show-modal")) {
    firstModal.classList.remove("show-modal");
  }

  // Code to open the second and fourth modals goes here
  if (this.id === "Pass" || this.id === "FailedPass") {
    document.getElementById("second-modal-container").classList.add("show-modal");
  } else if (this.id === "Progression" || this.id === "Call") {
    document.getElementById("fourth-modal-container").classList.add("show-modal");
  }
}

for (let i = 1; i <= 23; i++) {
  document.getElementById(`player${i}`).addEventListener("click", () => {
    closeAllModals();
    pinpointCount = 0;
  });

  document.getElementById(`receiver${i}`).addEventListener("click", () => {
    closeAllModals();
    pinpointCount = 0;
  });

  document.getElementById(`passer${i}`).addEventListener("click", () => {
    closeAllModals();
    pinpointCount = 0;
    openThirdModal(); // Open the third modal when passer{i} is clicked
  });
}

function getPinpointCoordinates() {
  return pinpointData.map(({ x, y, x1, y1 }) => [x, y, x1, y1]);
}

function exportPinpointCoordinatesToCSV() {
  const coordinates = getPinpointCoordinates();
  let csvContent = "x,y,x1,y1,label,player,receiver\n";
  for (const [x, y, x1, y1] of coordinates) {
    csvContent += `${x},${y},${x1},${y1}\n`;
  }

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pinpoints.csv";
  a.click();
}