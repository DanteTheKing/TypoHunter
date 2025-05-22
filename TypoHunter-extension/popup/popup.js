const toggle = document.getElementById("toggle");
toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});
chrome.storage.sync.get("enabled", (data) => {
  toggle.checked = data.enabled ?? true;
});
