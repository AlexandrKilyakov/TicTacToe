(function () {
  const selectors = {
    player: `[data-static="player"] [data-value]`,
    tie: `[data-static="tie"] [data-value]`,
    bot: `[data-static="bot"] [data-value]`,
  };

  const units = {
    player: getUnit("player"),
    tie: getUnit("tie"),
    bot: getUnit("bot"),
  };

  function getUnit(name) {
    const element = document.querySelector(selectors[name]);

    return {
      DOM: element,
      counter: 0,
    };
  }

  function start() {
    console.log(units);
    for (item of units) {
      item.DOM.innerHTML = item.counter;
    }
  }

  function setValue(array) {
    if (array.victory) {
      units[array.name].DOM.innerHTML = ++units[array.name].counter;
    } else {
      units["tie"].DOM.innerHTML = ++units["tie"].counter;
    }
  }

  pubsub.on("static_start", start);
  pubsub.on("static_restart", setValue);
})();
