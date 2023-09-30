const selectors = {
  game: "[data-game]",
  restart: ".restart",
  point: ".point",
};

const game = document.querySelector(selectors.game);
const btnRestart = document.querySelector(selectors.restart);

const size = 3;
const stopGame = "finish";
const changeUnit = {
  x: "o",
  o: "x",
};
const stepUnits = {
  x: getArraySize(),
  o: getArraySize(),
};

let victory = false;

function createGamePoints() {
  game.style.setProperty("--width", `${100 / size}%`);
  game.innerHTML = "";

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      game.innerHTML += `<div class="point" data-y="${y}" data-x="${x}"></div>`;
    }
  }

  setUnit("o");
}

function getArraySize() {
  const array = [];

  for (let i = 0; i < size; i++) {
    array.push([]);
  }

  return array;
}

function getUnit() {
  return game.dataset.unit;
}

function setUnit(unit) {
  game.dataset.unit = changeUnit[unit];
}

function diagonalCheck(i, item, step, arr) {
  i++;

  // Если дошли до конца массива
  if (arr.length <= i) {
    return true;
  }

  return arr[i].includes(item) && diagonalCheck(i, item + step, step, arr);
}

function elementMatches(i, item, arr) {
  i++;

  // Если дошли до конца массива
  if (arr.length <= i) {
    return true;
  }

  return arr[i].includes(item) && elementMatches(i, item, arr);
}

function victoryUnit(unit) {
  for (element of stepUnits[unit]) {
    // Если пусто
    if (!element.length) {
      return false;
    }

    // Заполнена ли строка
    if (element.length == size) {
      return true;
    }
  }

  // Проверка по диагонали (по возрастанию)
  if (!isNaN(stepUnits[unit][0])) {
    victory = diagonalCheck(-1, 0, 1, stepUnits[unit]);
  }

  // Проверка по диагонали (по убыванию)
  if (!isNaN(stepUnits[unit][size - 1]) && !victory) {
    victory = diagonalCheck(-1, size - 1, -1, stepUnits[unit]);
  }

  if (victory) {
    return victory;
  }

  // Есть ли совпадения
  return stepUnits[unit][0].some((item) =>
    elementMatches(0, item, stepUnits[unit])
  );
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
  // console.log(stepUnits);
  stepUnits[unit][~~point.dataset.y].push(~~point.dataset.x);
  victory = victoryUnit(unit);

  // console.log(victory);

  if (victory) {
    return;
  }

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

// По горизонтали: Разница 1, уравень один
// 1|1 1|2 1|3
// 2|4 2|5 2|6
// 3|7 3|8 3|9

// По вертикали: Разница 3, уравень возрастает на 1
// 1|1 2|4 3|7
// 1|2 2|5 3|8
// 1|3 2|6 3|9

// По диагонали:
// 1|1 2|5 3|9 Разница 4, уравень возрастает на 1
// 1|3 2|5 3|7 Разница 2, уравень возрастает на 1

//  Что искать?
// 1. Заполнены ли 3 ячейки одного ряда
// 2. Заполнены ли 3 ячейки разного ряда
// 3. Найти в них закономерность (одинаковую разность)

// Победа
// 1. Если длина ряда равна длине размера 3 / 3
// 2. Если во всех столбцах есть совпадение
// 3. Если есть по возрастанию или убыванию
