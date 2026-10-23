// Lightweight app-runtime QA. This renders real templates and runs real handlers;
// it does not measure layout or replace browser or clinical review.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const modules = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
module.exports = function boot(profile, answers = {}, storage = {}, clock = '2026-10-21T12:00:00Z', options = {}) {
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
  const listeners = {};
  const ctx = { Date: ClockDate, document, console, scrollY: 0, scrollTo() {},
    localStorage: { getItem(k) { return storage[k] ?? null; }, setItem(k, v) { storage[k] = String(v); }, removeItem(k) { delete storage[k]; } },
    requestAnimationFrame() {}, setTimeout() {}, clearTimeout() {}, addEventListener(type, fn) { (listeners[type] ||= []).push(fn); } };
  if (options.history) {
    const states = [options.navigationState || null]; let index = 0;
    ctx.history = { get state() { return states[index]; },
      replaceState(value) { states[index] = JSON.parse(JSON.stringify(value)); },
      pushState(value) { states.splice(index+1); states.push(JSON.parse(JSON.stringify(value))); index++; },
      go(delta) { const next=index+delta; if(next<0||next>=states.length)return; index=next; for(const fn of listeners.popstate||[])fn({state:states[index]}); },
      back() { this.go(-1); }, forward() { this.go(1); } };
  }
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const file of modules) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file });
  const run = code => vm.runInContext(code, ctx);
  return { run, storage, html: () => elements['#main'].innerHTML };
};
