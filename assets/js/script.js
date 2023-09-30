const selectors = {
  game: "[data-game]",
  restart: ".restart",
};

const game = document.querySelector(selectors.game);
const btnRestart = document.querySelector(selectors.restart);

const size = 3;

function createGamePoints() {
  const n = size ** 2;

  game.style.setProperty("--width", `${100 / size}%`);
  game.innerHTML = "";

  for (let i = 0; i < n; i++) {
    game.innerHTML += `<div class="place"></div>`;
  }

  game.dataset.unit = "x";
}

function restartGame() {
  createGamePoints();
}

function start() {
  createGamePoints();

  btnRestart.addEventListener("click", restartGame);
}

start();
