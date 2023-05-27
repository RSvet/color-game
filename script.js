"use strict";
const squareContainer = document.querySelector(".square-grid");
const colorCode = document.querySelector(".color-code");
const modeButtons = document.querySelector(".game-mode");
const newGameButton = document.querySelector(".btn__new-game");
const message = document.querySelector(".text-play");
const header = document.querySelector(".title-area");
const winMessage = document.querySelector(".win-message");
const winAudio = document.getElementById("win-sound");
const questionText = document.querySelector(".head-text");

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getRandomColor = function () {
  return `rgb(${Array.from({ length: 3 }, () => getRandomNumber(0, 255))})`;
};

const makeColorsArr = function (gameMode) {
  const numberOfOptions = gameMode === "easy" ? 3 : 6;
  let colors = [];
  for (let i = 0; i < numberOfOptions; i++) {
    colors[i] = getRandomColor();
  }
  return colors;
};

const makeSquares = function (colorArr) {
  squareContainer.textContent = "";
  colorArr.forEach(() =>
    squareContainer.insertAdjacentHTML(
      "afterbegin",
      '<div class="square-option"><p class="square-text">try again</p></div>'
    )
  );
  document.querySelectorAll(".square-option").forEach((square, i) => {
    square.style.backgroundColor = square.style.color = colorArr[i];
  });
};

const restart = function (mode) {
  message.textContent = "";
  const colors = makeColorsArr(mode);
  makeSquares(colors);
  const chosenColor = colors[getRandomNumber(0, colors.length - 1)];
  colorCode.textContent = chosenColor;
  winMessage.classList.remove("play-win");
  header.style.backgroundColor = "rgb(116, 143, 252)";
  questionText.style.opacity = "1";
  return chosenColor;
};

const goodGuess = function (options, trueColor) {
  options.forEach((option) => {
    option.style.backgroundColor = trueColor;
    option.classList.remove("chosen-option");
  });
  header.style.backgroundColor = trueColor;
  winMessage.style.color = trueColor;
  message.textContent = "Correct";
  winMessage.classList.add("play-win");
  questionText.style.opacity = "0";
  winAudio.play();
};

const badGuess = function (chosenAnswer) {
  chosenAnswer.classList.add("chosen-option");
  chosenAnswer.style.backgroundColor = "transparent";
  chosenAnswer.querySelector("p").classList.add("chosen-text");
};

// initialization of the game
const init = function () {
  let gameMode = "hard";
  let play = true;
  const colors = makeColorsArr(gameMode);
  makeSquares(colors);
  let secretColor = colors[getRandomNumber(0, colors.length - 1)];
  colorCode.textContent = secretColor;

  //event listeners  on click

  // easy/hard mode buttons
  modeButtons.addEventListener("click", function (e) {
    this.querySelectorAll(".btn").forEach((btn) =>
      btn.classList.remove("active")
    );
    const modeButton = e.target.closest(".btn");
    if (!modeButton) return;
    play = true;
    modeButton.classList.add("active");
    gameMode = modeButton.textContent.toLowerCase();
    secretColor = restart(gameMode);
  });

  //new game button
  newGameButton.addEventListener("click", function () {
    play = true;
    secretColor = restart(gameMode);
  });

  //click events on squares
  squareContainer.addEventListener("click", function (e) {
    if (!play) return;
    const chosenOption = e.target.closest(".square-option");
    if (!chosenOption) return;
    const chosenOptionColor = chosenOption.style.backgroundColor.replaceAll(
      " ",
      ""
    );
    if (chosenOptionColor === secretColor) {
      goodGuess(this.querySelectorAll(".square-option"), secretColor);
      play = false;
    } else badGuess(chosenOption);
  });
};

init();
