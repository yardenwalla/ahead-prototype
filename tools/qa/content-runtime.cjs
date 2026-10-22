// Lightweight app-runtime QA. This renders real templates and runs real handlers;
// it does not measure layout or replace browser or clinical review.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const modules = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
module.exports = function boot(profile, answers = {}, storage = {}, clock = '2026-10-21T12:00:00Z') {
  storage['ahead-v2-profile'] = JSON.stringify(profile);
  storage['ahead-v2-answers'] = JSON.stringify(answers);
  const elements = {};
  const element = () => ({ innerHTML: '', value: '', checked: false, hidden: false,
    classList: { toggle() {}, add() {}, remove() {} }, querySelectorAll() { return []; },
    querySelector() { return null; }, setAttribute() {}, getAttribute() { return null; },
    scrollIntoView() {}, focus() {}, remove() {}, setCustomValidity() {}, reportValidity() {} });
  const document = { querySelector(s) { return ['.monthstrip', '.month.active'].includes(s) ? null : elements[s] ||= element(); },
    querySelectorAll() { return []; }, getElementById() { return null; }, addEventListener() {} };
  const NativeDate = Date;
  class ClockDate extends NativeDate { constructor(...a) { super(...(a.length ? a : [clock])); } static now() { return new NativeDate(clock).getTime(); } }
  const ctx = { Date: ClockDate, document, console, scrollY: 0, scrollTo() {},
    localStorage: { getItem(k) { return storage[k] ?? null; }, setItem(k, v) { storage[k] = String(v); }, removeItem(k) { delete storage[k]; } },
    requestAnimationFrame() {}, setTimeout() {}, clearTimeout() {}, addEventListener() {} };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const file of modules) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file });
  const run = code => vm.runInContext(code, ctx);
  return { run, storage, html: () => elements['#main'].innerHTML };
};
