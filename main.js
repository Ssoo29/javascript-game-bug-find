"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");
const popUp = document.querySelector(".pop-up");
const popUpRefresh = document.querySelector(".pop-up__refresh");
const popUpText = document.querySelector(".pop-up__message");

let started = false;
let score = 0;
let timer = undefined;
gameScore.innerHTML = CARROT_COUNT;

function startGame() {
  started = true;
  initGame();
  score = 0;
  showStopButton();
  showTimerAndScore();
  startGameTimer();
}

function stopGame() {
  started = false;
  clearInterval(timer);
  hidePopUp();
  gameBtn.style.visibility = "hidden";
  showPopUpText("REPLAY ?");
}

function hidePopUp() {
  popUp.classList.remove("pop-up--hide");
}

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener("click", () => {
  popUp.classList.add("pop-up--hide");
  startGame();
});

field.addEventListener("click", (e) => {
  if (!started) {
    return;
  }
  const target = e.target;
  if (target.matches(".carrot")) {
    target.remove();
    score++;
    updateScoreBoard();
    if (CARROT_COUNT === score) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    stopGame();
    finishGame(false);
  }
});

function finishGame(win) {
  started = false;
  stopGame();
  hideGameButton();
  hidePopUp();
  showPopUpText(win ? "YOU WON !" : "YOU LOSE !");
}

function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

function updateScoreBoard() {
  gameScore.innerHTML = CARROT_COUNT - score;
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimer(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(false);
      return;
    }
    updateTimer(--remainingTimeSec);
  }, 1000);
}

function updateTimer(time) {
  const minute = Math.floor(time / 60);
  const second = time % 60;
  gameTimer.innerHTML = `${minute} : ${second}`;
}

function initGame() {
  field.innerHTML = "";
  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", CARROT_COUNT, "img/bug.png");
}

function showStopButton() {
  const icon = gameBtn.querySelector(".fa-play");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-remove");
}

function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}

function showPopUpText(text) {
  popUpText.innerHTML = text;
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("src", imgPath);
    item.setAttribute("class", className);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

initGame();
