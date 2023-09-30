const selectors = {
  game: "[data-game]",
  restart: ".restart",
  point: ".point",
};

const game = document.querySelector(selectors.game);
const btnRestart = document.querySelector(selectors.restart);

const size = 3;
const changeUnit = {
  x: "o",
  o: "x",
};

function createGamePoints() {
  const n = size ** 2;

  game.style.setProperty("--width", `${100 / size}%`);
  game.innerHTML = "";

  for (let i = 0; i < n; i++) {
    game.innerHTML += `<div class="point"></div>`;
  }

  setUnit("o");
}

function getUnit() {
  return game.dataset.unit;
}

function setUnit(unit) {
  game.dataset.unit = changeUnit[unit];
}

function restartGame() {
  createGamePoints();
}

function clickPoint(target) {
  const point = target.closest(selectors.point);

  if (!point) {
    return;
  }

  const unit = getUnit();

  point.classList.add(`here-${unit}`);
  setUnit(unit);
}

function start() {
  createGamePoints();

  btnRestart.addEventListener("click", restartGame);
  game.addEventListener("click", ({ target }) => {
    clickPoint(target);
  });
}

start();
