/* Ahead · They/them grammar.
   Most copy is written for "he" or "she" and swapped to the family's pronouns. For "they", the verb after it
   has to change too ("they rolls" → "they roll", "Is they" → "Are they"), and a sentence can't start with a
   lowercase "they". This pass fixes the visible text after every render, only for families who chose they/them. */
(function () {
  const IRREG = { has: 'have', is: 'are', was: 'were', does: 'do', goes: 'go', "doesn’t": 'don’t', "isn’t": 'aren’t', "wasn’t": 'weren’t', "hasn’t": 'haven’t', "doesn't": "don't", "isn't": "aren't", "wasn't": "weren't", "hasn't": "haven't" };
  const KEEP = new Set(['always', 'sometimes', 'perhaps', 'as', 'us', 'yes', 'besides', 'its', 'this', 'thus', 'plus', 'less', 'unless', 'across', 'towards', 'afterwards', 'nearly', 'mostly']);
  const verb = w => {
    const l = w.toLowerCase();
    if (IRREG[l]) return IRREG[l];
    if (KEEP.has(l) || !/s$/.test(l) || /(ss|us|is)$/.test(l) || l.length < 3) return null;
    if (/[^aeiou]ies$/.test(l)) return l.slice(0, -3) + 'y';
    if (/(ches|shes|xes|zes|sses|oes)$/.test(l)) return l.slice(0, -2);
    return l.slice(0, -1);
  };
  const keepCase = (from, to) => from[0] === from[0].toUpperCase() ? to[0].toUpperCase() + to.slice(1) : to;
  window.theyGrammar = text => String(text)
    .replace(/\b([Tt]hey)(\s+)(?:(also|still|usually|often|just|now|really|only|already|never|even)\s+)?([A-Za-z’']+)\b/g, (all, t, sp, adv, w) => {
      const v = verb(w); return v ? t + sp + (adv ? adv + ' ' : '') + keepCase(w, v) : all; })
    .replace(/\bthey’s\b/g, 'they’re').replace(/\bThey’s\b/g, 'They’re')
    .replace(/\b(Is|Was|Has|Does) they\b/g, (all, a) => ({ Is: 'Are', Was: 'Were', Has: 'Have', Does: 'Do' })[a] + ' they')
    .replace(/\b(is|was|has|does) they\b/g, (all, a) => ({ is: 'are', was: 'were', has: 'have', does: 'do' })[a] + ' they')
    .replace(/([.!?]\s+)they\b/g, (all, pre) => pre + 'They');
  const fixTree = root => {
    if (!root || typeof document === 'undefined' || typeof document.createTreeWalker !== 'function') return;
    const w = document.createTreeWalker(root, 4); let n;
    while ((n = w.nextNode())) { if (!/\bthey\b|\bthey’s\b/i.test(n.nodeValue)) continue; const f = window.theyGrammar(n.nodeValue); if (f !== n.nodeValue) n.nodeValue = f; }
  };
  const on = () => typeof profile !== 'undefined' && profile && profile.pronouns === 'they';
  const prev = window.render;
  if (typeof prev === 'function') window.render = render = function (...a) {
    const out = prev.apply(this, a);
    try { if (on()) { fixTree(document.getElementById('main')); document.querySelectorAll('.hub-toast').forEach(fixTree); } } catch (e) {}
    return out;
  };
  // Changes made inside a page without a full render (a stepper step, a toast) get the same pass.
  try {
    if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined' && document.body) {
      let busy = false;
      new MutationObserver(ms => { if (busy || !on()) return; busy = true; try { ms.forEach(m => m.addedNodes.forEach(x => x.nodeType === 1 ? fixTree(x) : x.nodeType === 3 && fixTree(x.parentNode))); } catch (e) {} busy = false; })
        .observe(document.body, { childList: true, subtree: true });
    }
  } catch (e) {}
})();
