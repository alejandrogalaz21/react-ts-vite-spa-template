// Runs before first paint (loaded synchronously in <head>) so the page never flashes the wrong
// theme. External file instead of an inline script: compatible with a strict CSP (script-src self).
(function () {
  var theme;
  try {
    theme = localStorage.getItem('app.theme');
  } catch {
    // Storage blocked: fall back to the system preference.
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
})();
