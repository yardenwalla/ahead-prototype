/* Some in-app viewers block browser storage. Without it, anything a parent saves
   (questions, visits, firsts, photos) would silently disappear. Fall back to memory
   so everything works for the visit, and let the app say it won't be kept. */
(function () {
  let ok = true;
  try { const k = '__ahead_probe'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); } catch (e) { ok = false; }
  window.AHEAD_STORAGE_PERSISTS = ok;
  if (ok) return;
  const data = {};
  const mem = {
    getItem: k => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: k => { delete data[k]; },
    clear: () => { Object.keys(data).forEach(k => delete data[k]); },
    key: i => Object.keys(data)[i] ?? null,
    get length() { return Object.keys(data).length; }
  };
  try { Object.defineProperty(window, 'localStorage', { value: mem, configurable: true }); } catch (e) {}
  try { Object.defineProperty(window, 'sessionStorage', { value: mem, configurable: true }); } catch (e) {}
})();
