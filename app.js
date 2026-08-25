// Compatibility shim for browsers that still have the pre-v2 index.html cached.
// The current app uses app-v2.js. This forces one versioned navigation so the
// browser re-fetches the latest GitHub Pages HTML instead of staying on the old UI.
(() => {
  const url = new URL(window.location.href);
  if (url.searchParams.get('ui') !== 'v2') {
    url.searchParams.set('ui', 'v2');
    url.searchParams.set('build', '20260825-3');
    window.location.replace(url.toString());
  }
})();
