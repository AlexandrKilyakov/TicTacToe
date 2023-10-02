(function () {
  const size = 3;
  let victory = false;

  const selectors = {
    game: "[data-game]",
    restart: ".restart",
    point: ".point",
  };

  const game = document.querySelector(selectors.game);

  game.addEventListener("click", _clickPoint);

  const units = (() => {
    const _change = {
      x: "o",
      o: "x",
    };

    const step = (() => {
      let x = null,
        o = null;

      pubsub.on("gameplay_start", reset);
      pubsub.on("gameplay_restart", reset);

      function reset() {
        step.x = _arraySize();
        step.o = _arraySize();
      }

      function _arraySize() {
        const array = [];

        for (let i = 0; i < size; i++) {
          array.push([]);
        }

        return array;
      }

      return { x, o, reset };
    })();

    const check = (() => {
      // Проверка по горизонтали. Проверяем, заполнена ли строка
      function horizontal(array) {
        return array.some((element) => element.length == size);
      }

      // Проверка по вертикали. Проверяем, есть ли совпадения
      function vertically(array) {
        return array[0].some((item) => _totalNumber(0, item, array));
      }

      function diagonals(step) {
        let result = false;
        // Проверка по диагонали (по возрастанию)
        if (!isNaN(step[0])) {
          result = _diagonal(-1, 0, 1, step);
        }

        // Проверка по диагонали (по убыванию)
        if (!isNaN(step[size - 1]) && !result) {
          result = _diagonal(-1, size - 1, -1, step);
        }

        return result;
      }

      function _diagonal(i, item, step, arr) {
        i++;

        let check = _timeStop(i, arr);

        if (check != "ok") {
          return check;
        }

        return arr[i].includes(item) && _diagonal(i, item + step, step, arr);
      }

      function _totalNumber(i, item, arr) {
        i++;

        let check = _timeStop(i, arr);

        if (check != null) {
          return check;
        }

        return arr[i].includes(item) && _totalNumber(i, item, arr);
      }

      function _timeStop(i, arr) {
        let result = null;

        // Если дошли до конца массива или i меньше 0
        if (!arr[i] || i < 0) {
          result = true;
        }

        // Если пусто
        if (arr[i] && !arr[i].length) {
          result = false;
        }

        return result;
      }

      return { horizontal, vertically, diagonals };
    })();

    function getChangeUnit(unit) {
      return _change[unit];
    }

    function getUnit() {
      return game.dataset.unit;
    }

    function setUnit(value) {
      const unit = value || getUnit();
      game.dataset.unit = getChangeUnit(unit);
    }

    function victoryUnit(array) {
      const horizontal = check.horizontal(array);
      const vertically = check.vertically(array);
      const diagonal = check.diagonals(array);
      // console.clear();
      // console.table({ horizontal, vertically, diagonal });

      return horizontal || vertically || diagonal;
    }

    return {
      step: step,
      check: check,
      change: getChangeUnit,
      get: getUnit,
      set: setUnit,
      victory: victoryUnit,
    };
  })();

  const gameplay = (() => {
    const btnRestart = document.querySelector(selectors.restart);

    const _DEFAULT_STYLE = "--width";
    const _DEFAULT_PROPERTY = `${100 / size}%`;

    function start() {
      _createPoints();
      _events();
      pubsub.emit("gameplay_start");
    }

    function restart() {
      victory = false;
      _createPoints();
      pubsub.emit("gameplay_restart");
    }

    function _events() {
      btnRestart.addEventListener("click", restart);
    }

    function _createPoints() {
      game.style.setProperty(_DEFAULT_STYLE, _DEFAULT_PROPERTY);
      game.innerHTML = "";

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          game.innerHTML += `<div class="point" data-y="${y}" data-x="${x}"></div>`;
        }
      }

      units.set("o");
    }

    return { start, restart };
  })();

  function _clickPoint({ target }) {
    const point = target.closest(selectors.point);

    if (!point) {
      return;
    }
    const unit = units.get();
    point.classList.add(`here-${unit}`);
    units.step[unit][~~point.dataset.y].push(~~point.dataset.x);
    console.table(units.step[unit]);

    victory = units.victory(units.step[unit]);

    // Если победитель определен
    if (victory) {
      gameplay.restart();
      return;
    }

    units.set();
  }

  gameplay.start();
})();
