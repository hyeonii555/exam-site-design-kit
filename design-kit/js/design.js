/* design.js — 시험 준비 사이트 디자인 키트
   모양에 필요한 동작만 한다: 화면 높이 맞춤, 보기 메뉴(어둡게·밝게, 글자 크기), 미끄러지는 손잡이, 메뉴 열고 닫기, 코드 칸 색·줄 번호.
   회사 사이트의 기능(파이썬 실행, 채점, 자료, 기록 저장)과 닿지 않는다. 저장하는 것은 k-theme, k-size 두 값뿐이다.
   이 파일은 고치지 않는다. 사이트 코드에서 부를 수 있는 것: window.kDesign.{fit, thumbs, paint, setTheme, setSize, toast} */
(function () {
  'use strict';
  var KEY_THEME = 'k-theme', KEY_SIZE = 'k-size';
  var FIT_H = 945, FIT_MINW = 1280, SIZE_K = [1.12, 1, 0.88];   // 작게 · 보통 · 크게 (기준 높이에 곱한다. 작을수록 글자가 커진다)

  function get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* 저장할 수 없는 브라우저면 이번 화면에만 */ } }
  function app() { return document.querySelector('.k-app'); }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---------- 화면 높이 맞춤: data-k-fit이 있으면 설계 높이(945)에 맞춰 통째로 키우거나 줄인다 ----------
  function sizeIndex() { var i = parseInt(get(KEY_SIZE), 10); return i >= 0 && i <= 2 ? i : 1; }
  function fit() {
    var a = app(); if (!a || !a.hasAttribute('data-k-fit')) return;
    var z = Math.min(window.innerHeight / (FIT_H * SIZE_K[sizeIndex()]), window.innerWidth / FIT_MINW);
    a.style.zoom = String(z); a.style.width = (window.innerWidth / z) + 'px'; a.style.height = (window.innerHeight / z) + 'px';
    thumbs();
  }

  // ---------- 보기 메뉴: [data-k-set-theme="dark|light"], [data-k-set-size="0|1|2"] 단추 ----------
  function setTheme(t) {
    var a = app(); if (!a) return; t = t === 'light' ? 'light' : 'dark';
    if (t === 'light') a.setAttribute('data-k-theme', 'light'); else a.removeAttribute('data-k-theme');
    put(KEY_THEME, t); syncView();
  }
  function setSize(i) { put(KEY_SIZE, String(i)); syncView(); fit(); }
  function syncView() {
    var a = app(), t = a && a.getAttribute('data-k-theme') === 'light' ? 'light' : 'dark', s = String(sizeIndex());
    all('[data-k-set-theme]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-k-set-theme') === t)); });
    all('[data-k-set-size]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-k-set-size') === s)); });
  }

  // ---------- 손잡이: .k-seg / .k-nav 의 칸 수(--k-n)와 고른 번호(--k-i)만 넣는다. 자리와 폭은 CSS가 계산한다 ----------
  // 고른 칸 = aria-current · aria-pressed="true" · aria-selected="true". 안에는 단추(a, button)와 .k-thumb만 둔다
  function thumbs() {
    all('.k-seg, .k-nav').forEach(function (g) {
      if (!g.querySelector(':scope > .k-thumb')) return;
      var items = all(':scope > a, :scope > button', g), on = -1;
      for (var i = 0; i < items.length; i++) {
        var x = items[i];
        if (x.hasAttribute('aria-current') || x.getAttribute('aria-pressed') === 'true' || x.getAttribute('aria-selected') === 'true') { on = i; break; }
      }
      var extra = all(':scope > *', g).filter(function (c) { return !c.classList.contains('k-thumb') && c.tagName !== 'A' && c.tagName !== 'BUTTON' && !c.hidden; });
      if (extra.length && !g._kWarned) { g._kWarned = true; if (window.console) console.warn('[design-kit] .k-seg / .k-nav 안에는 a, button, .k-thumb만 둬요. 손잡이가 어긋나요:', g); }
      g.style.setProperty('--k-n', String(items.length || 1));
      g.style.setProperty('--k-i', String(Math.max(on, 0)));
      if (on < 0) g.setAttribute('data-k-none', ''); else g.removeAttribute('data-k-none');
      g.setAttribute('data-k-ready', '');
    });
  }

  // ---------- 메뉴: [data-k-menu="메뉴 id"] 단추가 그 요소를 열고 닫는다. 밖을 누르거나 Esc면 닫는다 ----------
  var openMenu = null;
  function closeMenu(focusBack) {
    if (!openMenu) return; var m = openMenu; openMenu = null;
    m.pop.hidden = true; m.btn.setAttribute('aria-expanded', 'false'); if (focusBack) m.btn.focus();
  }
  function toggleMenu(btn) {
    var pop = document.getElementById(btn.getAttribute('data-k-menu')); if (!pop) return;
    if (openMenu && openMenu.pop === pop) { closeMenu(false); return; }
    closeMenu(false); pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); openMenu = { btn: btn, pop: pop }; thumbs();
  }

  // ---------- 코드 칸: pre[data-k-hl] 의 파이썬 코드에 색을 칠한다. data-k-lines면 줄 번호, data-k-lit="3-5,8"이면 그 줄을 밝히고, data-k-err="4"면 오류 줄로 ----------
  var KW = { 'import': 1, 'from': 1, 'as': 1, 'def': 1, 'return': 1, 'if': 1, 'elif': 1, 'else': 1, 'for': 1, 'in': 1, 'while': 1, 'lambda': 1, 'and': 1, 'or': 1,
    'not': 1, 'is': 1, 'None': 1, 'True': 1, 'False': 1, 'break': 1, 'continue': 1, 'with': 1, 'try': 1, 'except': 1, 'class': 1, 'pass': 1, 'yield': 1, 'raise': 1 };
  var TOK = /('''[\s\S]*?'''|"""[\s\S]*?"""|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|(#.*)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)|(\b\d+(?:\.\d+)?\b)/g;
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function colorLine(line) {
    var out = '', last = 0, m; TOK.lastIndex = 0;
    while ((m = TOK.exec(line))) {
      out += esc(line.slice(last, m.index));
      var t = esc(m[0]), c = m[1] ? 'k-t-str' : m[2] ? 'k-t-com' : m[3] ? (KW[m[0]] ? 'k-t-key' : 'k-t-fn') : m[4] ? (KW[m[0]] ? 'k-t-key' : '') : 'k-t-num';
      out += c ? '<span class="' + c + '">' + t + '</span>' : t; last = m.index + m[0].length;
    }
    return out + esc(line.slice(last));
  }
  function litSet(spec) {
    var on = {}; (spec || '').split(',').forEach(function (p) {
      var r = p.trim().split('-'), a = parseInt(r[0], 10), b = parseInt(r[1] || r[0], 10);
      if (a > 0 && b >= a) for (var i = a; i <= b; i++) on[i] = true;
    }); return on;
  }
  function paintOne(el, force) {
    var fresh = el._kSrc === undefined || el.innerHTML !== el._kPainted;   // 처음이거나, 칠한 뒤 사이트가 코드 글을 새로 넣었다
    if (!fresh && !force) return;
    if (fresh) el._kSrc = el.textContent.replace(/\n$/, '');
    var src = el._kSrc, lines = src.split('\n'), html = '';
    if (!el.hasAttribute('data-k-lines') && !el.hasAttribute('data-k-lit') && !el.hasAttribute('data-k-err')) html = lines.map(colorLine).join('\n');
    else {
      var start = parseInt(el.getAttribute('data-k-start'), 10) || 1, lit = litSet(el.getAttribute('data-k-lit')), bad = litSet(el.getAttribute('data-k-err'));
      for (var i = 0; i < lines.length; i++) {
        var n = start + i;
        html += '<span class="k-ln' + (lit[n] ? ' is-lit' : '') + (bad[n] ? ' is-err' : '') + '"><i>' + n + '</i><span>' + colorLine(lines[i]) + '</span></span>';
      }
    }
    el.innerHTML = html; el._kPainted = el.innerHTML;
  }
  function paint(root) { all('pre[data-k-hl]', root).forEach(paintOne); }

  // ---------- 알림 한 줄 ----------
  function toast(text) {
    var a = app(); if (!a) return; var old = a.querySelector(':scope > .k-toast'); if (old) old.remove();
    var t = document.createElement('div'); t.className = 'k-toast'; t.setAttribute('role', 'status'); t.textContent = text; a.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 1600);
  }

  // ---------- 시작: .k-app이 나중에(사이트 JS가 그린 뒤) 생겨도 그때 한 번 맞춘다 ----------
  var ready = false;
  function init() {
    var a = app(); if (!a || ready) return; ready = true;
    if (get(KEY_THEME) === 'light') a.setAttribute('data-k-theme', 'light');
    syncView(); paint(); fit(); thumbs();
  }
  function start() {
    init();
    window.addEventListener('resize', fit);
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-k-menu], [data-k-set-theme], [data-k-set-size]') : null;
      if (t && t.hasAttribute('data-k-menu')) { toggleMenu(t); return; }
      if (t && t.hasAttribute('data-k-set-theme')) { setTheme(t.getAttribute('data-k-set-theme')); return; }
      if (t && t.hasAttribute('data-k-set-size')) { setSize(parseInt(t.getAttribute('data-k-set-size'), 10)); return; }
      if (openMenu && !openMenu.pop.contains(e.target)) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openMenu) closeMenu(true); });
    // 사이트 코드가 aria 값을 바꾸면 손잡이가 따라가고, data-k-lit을 바꾸면 밝은 줄이 바뀌고, 코드 칸을 새로 넣으면 색이 들어간다
    if (window.MutationObserver) {
      var pending = false;
      new MutationObserver(function (list) {
        if (!ready) init();
        list.forEach(function (r) {
          var t = r.target;
          if (r.type === 'attributes') { if ((r.attributeName === 'data-k-lit' || r.attributeName === 'data-k-err') && t.matches && t.matches('pre[data-k-hl]')) paintOne(t, true); return; }
          if (t.nodeType === 1 && t.matches('pre[data-k-hl]')) { paintOne(t); return; }   // 코드 칸의 글이 바뀜(칠한 그대로면 그냥 지나간다)
          for (var i = 0; i < r.addedNodes.length; i++) {
            var n = r.addedNodes[i]; if (n.nodeType !== 1) continue;
            if (n.matches('pre[data-k-hl]')) paintOne(n); else if (n.querySelector('pre[data-k-hl]')) paint(n);
          }
        });
        if (!pending) { pending = true; window.requestAnimationFrame(function () { pending = false; thumbs(); }); }
      }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-current', 'aria-pressed', 'aria-selected', 'data-k-lit', 'data-k-err'] });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(thumbs);
  }
  window.kDesign = { fit: fit, thumbs: thumbs, paint: paint, setTheme: setTheme, setSize: setSize, toast: toast, init: init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
