const static = (function () {
  const selectors = {
    player: `[data-static="player"] [data-value]`,
    tie: `[data-static="tie"] [data-value]`,
    bot: `[data-static="bot"] [data-value]`,
  };

  const units = {
    player: document.querySelector(selectors.player),
    tie: document.querySelector(selectors.tie),
    bot: document.querySelector(selectors.bot),
  };
})();
