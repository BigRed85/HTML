import './timer-style.css'

//Timer variables in seconds
const TIME_LIMIT = 30;
const WARNING_TIME = 15;

//conversion ratios
const second = 1000
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

//global variables
var currentTime = 0;
var previousTime = 0;
var elapsedTime = 0;

//flags
var timerIsPaused = true;
var firstWarning = true;

//dom element variables
var timerDisplay;
var timerPauseBtn;
var timerStopBtn;
var timerStartBtn;

window.onload = () => {
    setUpTimerUI();
    startTimer();
}

function setUpTimerUI() {
    timerDisplay = document.getElementById("timerDisplay");
    timerPauseBtn = document.getElementById("timerPauseBtn");
    timerStopBtn = document.getElementById("timerStopBtn");
    timerStartBtn = document.getElementById("timerStartBtn");

    timerPauseBtn.addEventListener("click", () => pauseTimer());
    timerStopBtn.addEventListener('click', () => stopTimer());
    timerStartBtn.addEventListener('click', () => startTimer());
}

function startTimer() {
    if (!timerIsPaused) {
       return; 
    }
    
    timerIsPaused = false;
    previousTime = Date.now();
    timerLoop();
    //set the display to 0;
}

function stopTimer() {
    // this should stop the timer progression
    elapsedTime = 0;
    timerIsPaused = true;
}

function pauseTimer() {
    updateTimer();
    timerIsPaused = true;
}

function updateTimer() {
    if (timerIsPaused) {
        return;
    }

    currentTime = Date.now();
    let deltaTime = currentTime - previousTime;

    elapsedTime += deltaTime;

    previousTime = currentTime;
}

function timerLoop() {
    if (timerIsPaused || elapsedTime >= TIME_LIMIT * 1000) {
        return;
    }
    setTimeout(()=>timerLoop(), 50);
    updateTimer();
    warning();
    updateDisplay();
}

function updateDisplay() {
    let minutes = pad( Math.floor( elapsedTime/ minute ), 2);
    let seconds = pad( Math.floor( (elapsedTime % minute) / second ), 2 );
    let centiseconds = pad( Math.floor( (elapsedTime % second) / 10 ), 2 );

    let displayString = minutes + ":" + seconds + "." + centiseconds;

    timerDisplay.innerText = displayString;
}

function pad(num, size) {
    var s = "0000000" + num;
    return s.substring(s.length-size);
}

function warning() {
    if (elapsedTime >= (TIME_LIMIT - WARNING_TIME) * 1000) {
        timerDisplay.classList.add("blink");
        if (firstWarning) {
            firstWarning = false;
        }
    }
    else {
        timerDisplay.style.color = "black";
    }
}