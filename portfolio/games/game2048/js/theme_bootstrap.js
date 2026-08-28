(function applyInitialTheme() {
  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem("xiaolin-2048-theme");
  } catch (error) {
    // Use the system preference when local storage is unavailable.
  }
  var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = savedTheme || (systemDark ? "dark" : "light");
})();
