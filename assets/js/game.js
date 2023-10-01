const TicTacToe = (function () {
  const selectors = {
    game: "[data-game]",
    restart: ".restart",
    point: ".point",
  };

  const game = document.querySelector(selectors.game);
  const btnRestart = document.querySelector(selectors.restart);

  const size = 3;
  const units = {
    change: {
      x: "o",
      o: "x",
    },
    step: {
      x: getArraySize(),
      o: getArraySize(),
    },
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

  function setUnit(value) {
    const unit = value || getUnit();
    game.dataset.unit = units.change[unit];
  }

  function victoryUnit(unit) {
    for (element of units.step[unit]) {
      // Заполнена ли строка
      if (element.length == size) {
        return true;
      }
    }

    // Проверка по диагонали (по возрастанию)
    if (!isNaN(units.step[unit][0])) {
      victory = diagonalCheck(-1, 0, 1, units.step[unit]);
    }

    // Проверка по диагонали (по убыванию)
    if (!isNaN(units.step[unit][size - 1]) && !victory) {
      victory = diagonalCheck(-1, size - 1, -1, units.step[unit]);
    }

    if (victory) {
      return victory;
    }

    // Есть ли совпадения
    return units.step[unit][0].some((item) =>
      elementMatches(0, item, units.step[unit])
    );
  }

  function arrayCheck(i, arr) {
    // Если дошли до конца массива
    if (arr.length <= i) {
      return true;
    }

    // Если пусто
    if (!arr[i].length) {
      return false;
    }

    return "ok";
  }

  function diagonalCheck(i, item, step, arr) {
    i++;

    let check = arrayCheck(i, arr);

    if (check != "ok") {
      return check;
    }

    return arr[i].includes(item) && diagonalCheck(i, item + step, step, arr);
  }

  function elementMatches(i, item, arr) {
    i++;

    let check = arrayCheck(i, arr);

    if (check != "ok") {
      return check;
    }

    return arr[i].includes(item) && elementMatches(i, item, arr);
  }

  function restartGame() {
    victory = false;
    units.step["x"] = getArraySize();
    units.step["o"] = getArraySize();

    createGamePoints();
  }

  function clickPoint(target) {
    const point = target.closest(selectors.point);

    if (!point) {
      return;
    }

    const unit = getUnit();
    point.classList.add(`here-${unit}`);
    units.step[unit][~~point.dataset.y].push(~~point.dataset.x);

    victory = victoryUnit(unit);

    // Если победитель определен
    if (victory) {
      restartGame();
      return;
    }

    setUnit();
  }

  function start() {
    createGamePoints();

    btnRestart.addEventListener("click", restartGame);
    game.addEventListener("click", ({ target }) => {
      clickPoint(target);
    });
  }

  start();
})();
