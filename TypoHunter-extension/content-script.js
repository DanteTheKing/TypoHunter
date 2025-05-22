
(async function () {
  const typoMap = await fetch(chrome.runtime.getURL('dictionaries/common-typos.json')).then(res => res.json());

  function highlightAndFix(input) {
    const words = input.value.split(/(\b)/); // keep word boundaries
    let changed = false;
    const fixedWords = words.map(word => {
      const lower = word.toLowerCase();
      if (typoMap[lower]) {
        changed = true;
        return typoMap[lower];
      }
      return word;
    });

    if (changed) {
      input.style.outline = "2px solid #ff9900";
      setTimeout(() => {
        input.style.outline = "";
      }, 1000);
    }

    input.value = fixedWords.join("");
  }

  function applyToInputField(input) {
    input.addEventListener("input", () => highlightAndFix(input));
  }

  document.querySelectorAll("input[type='text'], textarea").forEach(applyToInputField);

  const observer = new MutationObserver(() => {
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
      if (!input.dataset.typoHunterAttached) {
        input.dataset.typoHunterAttached = "true";
        applyToInputField(input);
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
