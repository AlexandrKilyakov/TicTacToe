(function () {
  const size = 3;
  let victory = false;

  const selectors = {
    game: "[data-game]",
    restart: ".restart",
    point: ".point",
  };

  const game = document.querySelector(selectors.game);
  const btnRestart = document.querySelector(selectors.restart);

  const units = {
    change: {
      x: "o",
      o: "x",
    },
    step: {
      reset: function () {
        this.x = getArraySize();
        this.o = getArraySize();
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

        if (check != "ok") {
          return check;
        }

        return (
          arr[i].includes(item) && this.diagonal(i, item + step, step, arr)
        );
      },
      diagonals: function (unit) {
        // Проверка по диагонали (по возрастанию)
        if (!isNaN(units.step[unit][0])) {
          victory = this.diagonal(-1, 0, 1, units.step[unit]);
        }

        // Проверка по диагонали (по убыванию)
        if (!isNaN(units.step[unit][size - 1]) && !victory) {
          victory = this.diagonal(-1, size - 1, -1, units.step[unit]);
        }

        return victory;
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
      console.clear();
      console.table({ horizontal, vertically, diagonal });

      return horizontal || vertically || diagonal;
    },
  };
  const gameplay = {
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
      btnRestart.addEventListener("click", gameplay.restart);
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

  function getArraySize() {
    const array = [];

    for (let i = 0; i < size; i++) {
      array.push([]);
    }

    return array;
  }

  gameplay.start();
})();
