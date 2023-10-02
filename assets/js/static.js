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
    const counter = 0;

    element.innerHTML = counter;

    return {
      DOM: element,
      counter: counter,
    };
  }

  function setValue(array) {
    if (array.victory) {
      units[array.name].DOM.innerHTML = ++units[array.name].counter;
    } else {
      units["tie"].DOM.innerHTML = ++units["tie"].counter;
    }
  }

  pubsub.on("static_restart", setValue);
})();
