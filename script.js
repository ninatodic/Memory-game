let images = [
  {
    path: "./img/I (0).jpg",
  },
  {
    path: "./img/I (1).jpg",
  },
  {
    path: "./img/I (2).jpg",
  },
  {
    path: "./img/I (3).jpg",
  },
  {
    path: "./img/I (4).jpg",
  },
  {
    path: "./img/I (5).jpg",
  },
  {
    path: "./img/I (6).jpg",
  },
  {
    path: "./img/I (7).jpg",
  },
  {
    path: "./img/I (8).jpg",
  },
  {
    path: "./img/I (9).jpg",
  },
  {
    path: "./img/I (10).jpg",
  },
  {
    path: "./img/I (11).jpg",
  },
];

// variables
const containerLevel = document.getElementById("startGame");
const containerGame = document.getElementById("game");
const backgroundImgPath = "./img/background.jpg";
const grid = document.getElementById("grid");
let cards = [];
let flipedCards = [];
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const moves = document.getElementById("moves");
const time = document.getElementById("time");
const easyBtn = document.getElementById("easy");
const mediumBtn = document.getElementById("medium");
const hardBtn = document.getElementById("hard");
const modal = document.getElementById("myModal");
const newGameBtn = document.getElementById("newGameBtn");
const chooseLevelBtn = document.getElementById("chooseLevelBtn");
const closeBtn = document.getElementById("close");
let level = "";
let movesNr = 0;
let matchNr = 0;
let seconds = 0;
let timeElapsed = "";

//Hide container with level options, show gameboard and start time
function startGame() {
  containerGame.style.display = "block";
  containerLevel.style.display = "none";
  if (level == "easy") {
    images = images.slice(0, 3);
  }
  if (level == "medium") {
    images = images.slice(0, 6);
  }
  if (level == "easy") {
    images = images.slice(0, 12);
  }
  images = [...images, ...images].sort(() => Math.random() - 0.5);
  distributeElements(level);
  cards = document.getElementsByClassName("el");
  timeElapsed = setInterval(showTime, 1000);
  listenForClick(cards);
}

// distribute cards on the table depending on the dificulty
function distributeElements(level) {
  if (level == "easy") {
    createElement(6);
    grid.classList.add("easyMode");
  } else if (level == "medium") {
    createElement(12);
    grid.classList.add("mediumMode");
  } else {
    createElement(24);
    grid.classList.add("hardMode");
    containerGame.style.width = "80%";
  }
}

//create cards and set background image
function createElement(numberOfElements) {
  for (var i = 0; i < numberOfElements; i++) {
    var img = document.createElement("img");
    img.setAttribute("src", backgroundImgPath);
    img.setAttribute("class", "el");
    grid.appendChild(img);
  }
}

//display time elapse
function showTime() {
  seconds++;
  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  let output =
    mins.toString().padStart(2, "0") + ":" + secs.toString().padStart(2, "0");

  time.innerHTML = output;
}

// flip clicked card
function flipCard(e) {
  cards[e].setAttribute("src", images[e].path);
  cards[e].style.pointerEvents = "none";
}

//check if fliped cards match, if they do make them dissapear or flip them back
async function checkMatch() {
  if (
    flipedCards[0].getAttribute("src") == flipedCards[1].getAttribute("src")
  ) {
    matchNr += 1;
    await delay(1000);
    flipedCards[0].style.visibility = "hidden";
    flipedCards[1].style.visibility = "hidden";
    flipedCards = [];
    isGameOver();
  } else {
    await delay(1000);
    flipedCards[0].setAttribute("src", backgroundImgPath);
    flipedCards[1].setAttribute("src", backgroundImgPath);
    flipedCards[0].style.pointerEvents = "auto";
    flipedCards[1].style.pointerEvents = "auto";
    flipedCards = [];
  }
  alowFliping();
}

//prevent fliping if two cards are already flipped
function preventFliping() {
  for (let e = 0; e < cards.length; e++) {
    cards[e].style.pointerEvents = "none";
  }
}

//alow flipping when checkMatch is finished
function alowFliping() {
  for (let e = 0; e < cards.length; e++) {
    cards[e].style.pointerEvents = "auto";
  }
}

//check is the game over to show finish screen
function isGameOver() {
  if (level == "easy") {
    if (matchNr == 3) {
      showFinishScreen();
    }
  } else if (level == "medium") {
    if (matchNr == 6) {
      showFinishScreen();
    }
  } else {
    if (matchNr == 12) {
      showFinishScreen();
    }
  }
}

//show finish screen
function showFinishScreen() {
  const finishTime = document.getElementById("time").innerHTML;

  document.getElementById("finishTime").innerHTML = finishTime;
  document.getElementById("finishedMoves").innerHTML = movesNr;

  modal.style.display = "block";
  clearInterval(timeElapsed);
}

// Update moves number
function changeMovesNr() {
  movesNr += 1;
  moves.innerHTML = `${movesNr}`;
}

// start new game on same level
function restartGame() {
  resetParameters();
  startGame();
}

// choose another level
function chooseLevel() {
  resetParameters();
  containerGame.style.display = "none";
  containerLevel.style.display = "block";
}

// set time and moves number and empty the grid
function resetParameters() {
  while (grid.hasChildNodes()) {
    grid.removeChild(grid.firstChild);
  }
  clearInterval(timeElapsed);
  seconds = 0;
  time.innerHTML = "00:00";
  moves.innerHTML = "0";
}

//event listeners

// start game - easy level
easyBtn.addEventListener("click", function (event) {
  level = "easy";
  startGame();
});
// start game - medium level
mediumBtn.addEventListener("click", function (event) {
  level = "medium";
  startGame();
});
// start game - hard level
hardBtn.addEventListener("click", function (event) {
  level = "hard";
  startGame();
});

//star a new game on same level
newGameBtn.addEventListener("click", restartGame);

//choose another level
chooseLevelBtn.addEventListener("click", chooseLevel);

//listen for click on each card
function listenForClick(cards) {
  for (let e = 0; e < cards.length; e++) {
    cards[e].addEventListener("click", function () {
      flipCard(e);
      flipedCards.push(cards[e]);
      if (flipedCards.length == 2) {
        preventFliping();
        changeMovesNr();
        checkMatch();
      }
    });
  }
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  restartGame();
});
