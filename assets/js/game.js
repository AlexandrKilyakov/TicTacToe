(function () {
  const size = 3;
  let victory = false;

  const selectors = {
    game: "[data-game]",
    restart: ".restart",
    point: ".point",
  };

  const game = document.querySelector(selectors.game);

  const units_ = (() => {
    const _change = {
      x: "o",
      o: "x",
    };

    const step = (() => {
      let x = null,
        y = null;

      function reset() {
        x = _arraySize();
        y = _arraySize();
      }

      function _arraySize() {
        const array = [];

        for (let i = 0; i < size; i++) {
          array.push([]);
        }

        return array;
      }

      reset();

      return { x, y, reset };
    })();

    const check = (() => {
      // Проверка по горизонтали. Проверяем, заполнена ли строка
      function horizontal(unit, array) {
        return array[unit].some((element) => element.length == size);
      }

      // Проверка по вертикали. Проверяем, есть ли совпадения
      function vertically(unit, array) {
        return array[unit][0].some((item) =>
          _totalNumber(0, item, array[unit])
        );
      }

      function diagonals(unit, step) {
        let result = false;
        // Проверка по диагонали (по возрастанию)
        if (!isNaN(step[unit][0])) {
          result = _diagonal(-1, 0, 1, step[unit]);
        }

        // Проверка по диагонали (по убыванию)
        if (!isNaN(step[unit][size - 1]) && !result) {
          result = _diagonal(-1, size - 1, -1, step[unit]);
        }

        return result;
      }

      function _diagonal(i, item, step, arr) {
        i++;

        let check = _timeStop(i, arr);

        if (check != "ok") {
          return check;
        }

        return (
          arr[i].includes(item) && this.diagonal(i, item + step, step, arr)
        );
      }

      function _totalNumber(i, item, arr) {
        i++;

        let check = _timeStop(i, arr);

        if (check != null) {
          return check;
        }

        return arr[i].includes(item) && this.totalNumber(i, item, arr);
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

    function victoryUnit(unit) {
      const horizontal = check.horizontal(unit);
      const vertically = check.vertically(unit);
      const diagonal = check.diagonals(unit);
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

  const units = {
    change: {
      x: "o",
      o: "x",
    },
    step: {
      reset: function () {
        this.x = this.arraySize();
        this.o = this.arraySize();
      },
      arraySize: function () {
        const array = [];

        for (let i = 0; i < size; i++) {
          array.push([]);
        }

        return array;
      },
    },
    check: {
      horizontal: function (unit) {
        // Проверка по горизонтали. Проверяем, заполнена ли строка
        for (element of units.step[unit]) {
          if (element.length == size) {
            return true;
          }
        }

        return false;
      },
      vertically: function (unit) {
        // Проверка по вертикали. Проверяем, есть ли совпадения
        return units.step[unit][0].some((item) =>
          this.totalNumber(0, item, units.step[unit])
        );
      },
      diagonal: function (i, item, step, arr) {
        i++;

        let check = this.timeStop(i, arr);
        console.log(i, arr[i], arr[i].includes(item));

        if (check != "ok") {
          return check;
        }

        return (
          arr[i].includes(item) && this.diagonal(i, item + step, step, arr)
        );
      },
      diagonals: function (unit) {
        let result = false;
        console.clear();
        // Проверка по диагонали (по возрастанию)
        if (!isNaN(units.step[unit][0])) {
          result = this.diagonal(-1, 0, 1, units.step[unit]);
        }

        // Проверка по диагонали (по убыванию)
        if (!isNaN(units.step[unit][size - 1]) && !result) {
          result = this.diagonal(-1, size - 1, -1, units.step[unit]);
        }

        return result;
      },
      totalNumber: function (i, item, arr) {
        i++;

        let check = this.timeStop(i, arr);

        if (check != "ok") {
          return check;
        }

        return arr[i].includes(item) && this.totalNumber(i, item, arr);
      },
      timeStop: function (i, arr) {
        let result = "ok";

        // Если дошли до конца массива или i меньше 0
        if (!arr[i] || i < 0) {
          result = true;
        }

        // Если пусто
        if (arr[i] && !arr[i].length) {
          result = false;
        }

        return result;
      },
    },
    get: function () {
      return game.dataset.unit;
    },
    set: function (value) {
      const unit = value || units.get();
      game.dataset.unit = units.change[unit];
    },
    victory: function (unit) {
      const horizontal = this.check.horizontal(unit);
      const vertically = this.check.vertically(unit);
      const diagonal = this.check.diagonals(unit);
      // console.clear();
      // console.table({ horizontal, vertically, diagonal });

      return horizontal || vertically || diagonal;
    },
  };

  const gameplay = {
    btnRestart: document.querySelector(selectors.restart),
    start: function () {
      units.step.reset();
      this.createPoints();
      this.events();
    },
    restart: function () {
      victory = false;
      units.step.reset();
      this.createPoints();
    },
    events: function () {
      this.btnRestart.addEventListener("click", gameplay.restart.bind(this));
      game.addEventListener("click", ({ target }) => {
        this.clickPoint(target);
      });
    },
    createPoints: function () {
      game.style.setProperty("--width", `${100 / size}%`);
      game.innerHTML = "";

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          game.innerHTML += `<div class="point" data-y="${y}" data-x="${x}"></div>`;
        }
      }

      units.set("o");
    },
    clickPoint: function (target) {
      const point = target.closest(selectors.point);

      if (!point) {
        return;
      }

      const unit = units.get();
      point.classList.add(`here-${unit}`);
      units.step[unit][~~point.dataset.y].push(~~point.dataset.x);

      victory = units.victory(unit);

      // Если победитель определен
      if (victory) {
        gameplay.restart();
        return;
      }

      units.set();
    },
  };

  gameplay.start();
})();
