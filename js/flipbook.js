// Book reader used for the free samples (index.html) and for bought chapters (read.html).
// Needs St.PageFlip (page-flip 2.0.7) loaded first.
//
//   new Flipbook({
//     title, pageCount,
//     loadPage: async n => element,   // an <img> or <canvas> for page n (1-based)
//     start: 1, toc: [[name, page], ...], onPage: n => {}, onClose: () => {},
//     download: { href, label },       // optional button
//     marks: [pages], onMarks: list => {}   // optional bookmarks (both needed to show the ★ button)
//     onDoubt: page => {}                   // optional "Ask a doubt" button (the page being read is passed)
//   }).open();
//
// Two ways to read: Book (pages turn; two facing pages on a wide screen) and Scroll (pages one under another).
// Zoom works on whatever is on screen, both pages of a spread included: pinch or double-tap on a phone;
// double-click, Ctrl + scroll or the − / + buttons on a laptop. The menus hide while reading (tap the middle
// to bring them back), the screen stays on, and a thin line at the top shows the topic and page.
(function () {
  const CSS = `
  .fb { position: fixed; inset: 0; z-index: 70; overflow: hidden; overscroll-behavior: contain; color: #f3f2ff;
    background: radial-gradient(70% 60% at 50% 45%, #2c2577, #15134a 70%), #15134a; font-family: "Fira Sans", "Segoe UI", Roboto, system-ui, sans-serif;
    user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }
  .fb.night { background: #0b0a1f; }
  .fb[hidden] { display: none; }
  .fb:focus { outline: none; }
  .fb-btn { background: rgba(255,255,255,.12); color: #f3f2ff; border: 0; border-radius: 999px; padding: 8px 14px; font: 600 .88rem inherit; font-family: inherit; cursor: pointer; text-decoration: none; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; }
  .fb-btn:hover { background: rgba(255,255,255,.22); }
  .fb-btn.sun { background: #ffd24a; color: #2a2100; }
  .fb-btn[aria-pressed="true"] { background: #ffd24a; color: #2a2100; }
  .fb-btn:focus-visible, .fb-range:focus-visible, .fb-seg button:focus-visible { outline: 3px solid #ffd24a; outline-offset: 2px; }
  .fb-btn svg { width: 18px; height: 18px; flex: none; }

  /* The page area fills the screen; the menus float over it and hide while reading. */
  .fb-stage { position: absolute; inset: 0; overflow: hidden; touch-action: none; }
  .fb-zw { position: absolute; top: calc(30px + env(safe-area-inset-top, 0px)); bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    left: calc(8px + env(safe-area-inset-left, 0px)); right: calc(8px + env(safe-area-inset-right, 0px)); display: grid; place-items: center; transform-origin: 0 0; }
  .fb.scrollmode .fb-stage { touch-action: auto; }
  .fb.zoomed .fb-stage { cursor: grab; }
  .fb.panning .fb-stage { cursor: grabbing; }
  .fb.panning .fb-zw { will-change: transform; }
  .fb-book { margin: 0 auto; }
  .fb-page { background: #fff; overflow: hidden; }
  .fb-page > img, .fb-page > canvas { width: 100%; height: 100%; display: block; object-fit: contain; pointer-events: none; }
  .fb-ph { width: 100%; height: 100%; display: grid; place-items: center; align-content: center; gap: 10px; color: #6b6990; font-size: .9rem; background: #f6f6fb; }
  .fb-spin { width: 30px; height: 30px; border-radius: 50%; border: 4px solid #dddcee; border-top-color: #3b2fb8; animation: fbspin .9s linear infinite; }
  @keyframes fbspin { to { transform: rotate(360deg); } }
  .fb-scroll { position: absolute; inset: 0; overflow: auto; touch-action: pan-x pan-y; overscroll-behavior: contain;
    padding: calc(36px + env(safe-area-inset-top, 0px)) 8px calc(96px + env(safe-area-inset-bottom, 0px)); }
  .fb-scroll[hidden], .fb-zw[hidden] { display: none; }
  .fb-col { margin: 0 auto; display: grid; gap: 30px; }
  .fb-sp { position: relative; background: #fff; aspect-ratio: 595 / 842; box-shadow: 0 10px 28px rgba(0,0,0,.4); border-radius: 3px; }
  .fb-sp.ok { aspect-ratio: auto; }
  .fb-sp > img, .fb-sp > canvas { width: 100%; height: auto; display: block; pointer-events: none; border-radius: 3px; }
  .fb-sp::after { content: attr(data-n); position: absolute; left: 50%; bottom: -22px; transform: translateX(-50%); font-size: .74rem; color: #8f8cc4; }
  .fb.night .fb-book, .fb.night .fb-sp { filter: sepia(.4) brightness(.78) contrast(1.06); }

  /* Always-on thin line: progress, topic and page. */
  .fb-line { position: absolute; top: 0; left: 0; right: 0; z-index: 1; pointer-events: none; padding: calc(8px + env(safe-area-inset-top, 0px)) calc(14px + env(safe-area-inset-right, 0px)) 0 calc(14px + env(safe-area-inset-left, 0px));
    display: flex; justify-content: space-between; gap: 14px; font-size: .78rem; color: #bcb9ea;
    height: calc(28px + env(safe-area-inset-top, 0px)); background: rgba(21,19,74,.94); box-shadow: 0 6px 14px rgba(0,0,0,.18); }
  .fb.night .fb-line { background: rgba(11,10,31,.95); }
  .fb-line .fb-topic { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fb-line .fb-pno { flex: none; font-variant-numeric: tabular-nums; }
  .fb-prog { position: absolute; left: 0; right: 0; top: env(safe-area-inset-top, 0px); height: 3px; background: rgba(255,255,255,.08); }
  .fb-prog b { display: block; height: 100%; width: 0; background: #ffd24a; transition: width .3s ease; }

  .fb-bar, .fb-nav { position: absolute; left: 0; right: 0; z-index: 2; transition: opacity .25s ease, transform .25s ease; }
  .fb-bar { top: 0; display: flex; align-items: center; gap: 8px; padding: calc(8px + env(safe-area-inset-top, 0px)) calc(12px + env(safe-area-inset-right, 0px)) 22px calc(12px + env(safe-area-inset-left, 0px));
    background: linear-gradient(#15134a 60%, rgba(21,19,74,0)); }
  .fb-title { flex: 1; min-width: 0; }
  .fb-title b { display: block; font: 700 1rem/1.2 "Baloo 2", system-ui, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fb-title span { font-size: .8rem; color: #bcb9ea; font-variant-numeric: tabular-nums; }
  .fb-nav { bottom: 0; padding: 22px calc(14px + env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) calc(14px + env(safe-area-inset-left, 0px));
    background: linear-gradient(rgba(21,19,74,0), #15134a 50%); }
  .fb-nav-in { max-width: 920px; margin: 0 auto; display: flex; align-items: center; gap: 10px; }
  .fb-range { flex: 1; min-width: 0; accent-color: #ffd24a; }
  .fb-zc { display: flex; align-items: center; gap: 4px; }
  .fb-zc .fb-btn { padding: 8px 12px; min-width: 40px; justify-content: center; font-variant-numeric: tabular-nums; }
  .fb.calm .fb-bar { opacity: 0; transform: translateY(-14px); pointer-events: none; }
  .fb.calm .fb-nav { opacity: 0; transform: translateY(14px); pointer-events: none; }
  .fb-hint { position: absolute; left: 50%; bottom: calc(96px + env(safe-area-inset-bottom, 0px)); z-index: 3; transform: translateX(-50%); width: max-content; max-width: calc(100% - 32px);
    text-align: center; background: rgba(0,0,0,.66); padding: 8px 16px; border-radius: 14px; font-size: .86rem; line-height: 1.4; pointer-events: none; transition: opacity .6s; }
  .fb-toast { position: absolute; left: 50%; top: calc(56px + env(safe-area-inset-top, 0px)); z-index: 3; transform: translateX(-50%); background: rgba(0,0,0,.7); padding: 6px 14px; border-radius: 999px; font-size: .85rem; pointer-events: none; opacity: 0; transition: opacity .3s; }
  .fb-toast.on { opacity: 1; }

  /* Side panels: topics and bookmarks, and view settings. */
  .fb-panel { position: absolute; inset: 0; z-index: 5; background: rgba(10,9,35,.6); display: flex; justify-content: flex-end; }
  .fb-panel[hidden] { display: none; }
  .fb-panel-body { width: min(400px, 100%); height: 100%; overflow-y: auto; background: #f6f6fb; color: #1b1a45; padding: calc(14px + env(safe-area-inset-top, 0px)) 16px calc(24px + env(safe-area-inset-bottom, 0px)); user-select: text; }
  .fb-panel-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px; }
  .fb-panel h2 { font: 800 1.25rem "Baloo 2", system-ui, sans-serif; margin: 0; }
  .fb-panel h3 { font: 700 .78rem "Fira Sans", system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #5d5b80; margin: 18px 0 6px; }
  .fb-panel .fb-btn { background: #1b1a45; color: #fff; }
  .fb-panel .fb-btn[aria-pressed="true"] { background: #ffd24a; color: #2a2100; }
  .fb-jump { display: flex; gap: 8px; margin-bottom: 4px; }
  .fb-jump input { flex: 1; min-width: 0; font: 1rem inherit; padding: 8px 12px; border-radius: 10px; border: 2px solid #dddcee; }
  .fb-toc { list-style: none; margin: 0; padding: 0; }
  .fb-toc button { width: 100%; display: grid; grid-template-columns: 28px minmax(0, 1fr) auto; gap: 10px; align-items: center; text-align: left; background: none; border: 0; border-bottom: 1px solid #dddcee; padding: 11px 2px; font: inherit; color: inherit; cursor: pointer; }
  .fb-toc button.here { background: #fff3c4; }
  .fb-toc .n { width: 26px; height: 26px; border-radius: 50%; background: #1b1a45; color: #ffd24a; display: grid; place-items: center; font: 800 .8rem "Baloo 2", system-ui, sans-serif; }
  .fb-toc .p { color: #5d5b80; font-size: .88rem; font-variant-numeric: tabular-nums; }
  .fb-empty { color: #5d5b80; font-size: .9rem; margin: 4px 0; }
  .fb-seg { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #e9e8f5; border-radius: 999px; padding: 4px; }
  .fb-seg button { border: 0; background: none; border-radius: 999px; padding: 10px; font: 700 .92rem inherit; font-family: inherit; color: #5d5b80; cursor: pointer; }
  .fb-seg button[aria-pressed="true"] { background: #1b1a45; color: #ffd24a; }
  .fb-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid #dddcee; }
  .fb-row b { display: block; }
  .fb-row small { display: block; color: #5d5b80; font-size: .8rem; }
  .fb-row .fb-zc .fb-btn { background: #1b1a45; color: #fff; }
  .fb-keys { font-size: .84rem; color: #5d5b80; line-height: 1.9; margin: 6px 0 0; padding: 0; list-style: none; }
  .fb-keys kbd { font: 700 .78rem "Fira Sans", system-ui, sans-serif; background: #fff; border: 1px solid #dddcee; border-bottom-width: 2px; border-radius: 6px; padding: 1px 6px; color: #1b1a45; }

  @media (max-width: 699px) { .fb-nav .fb-zc { display: none; } }
  @media (max-width: 520px) { .fb-btn { padding: 7px 11px; font-size: .82rem; } .fb-bar .fb-opt, .fb-lbl { display: none; } }
  @media (prefers-reduced-motion: reduce) { .fb-spin { animation-duration: 3s; } .fb-bar, .fb-nav, .fb-prog b { transition: none; } }
  `;
  const ICON = {
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/></svg>`,
    starOn: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/></svg>`,
    view: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M4 17h6M18 7h2M14 17h6"/><circle cx="16" cy="7" r="2"/><circle cx="12" cy="17" r="2"/></svg>`,
    full: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>`
  };
  const RATIO = 595 / 842, ZMAX = 2.5, PREF = "chemophile-view";
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Remembered between visits on this device: reading mode, night mode, scroll-mode zoom, how many tips were shown.
  const prefs = {
    get() { let p = {}; try { p = JSON.parse(localStorage.getItem(PREF) || "{}") || {}; } catch (e) {} return Object.assign({ mode: "book", night: false, sz: 1, tips: 0 }, p); },
    set(p) { try { localStorage.setItem(PREF, JSON.stringify(p)); } catch (e) {} }
  };
  const touchFirst = () => matchMedia("(pointer: coarse)").matches;
  let styled = false;

  class Flipbook {
    constructor(o) {
      this.o = Object.assign({ start: 1, toc: [] }, o);
      this.n = this.o.pageCount;
      this.cur = Math.min(Math.max(1, this.o.start), this.n);
      this.loaded = new Map(); // page → element
      this.p = prefs.get();
      this.z = 1; this.tx = 0; this.ty = 0;
      this.marksOn = Array.isArray(this.o.marks) && typeof this.o.onMarks === "function";
      this.marks = new Set(this.marksOn ? this.o.marks.map(Number) : []);
    }

    open() {
      if (!styled) { const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st); styled = true; }
      const o = this.o, fsOK = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
      const el = this.el = document.createElement("div");
      el.className = "fb" + (this.p.night ? " night" : "");
      el.tabIndex = -1;
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-label", o.title);
      const zc = `<span class="fb-zc"><button class="fb-btn" type="button" data-fb="zout" aria-label="Zoom out">−</button><button class="fb-btn" type="button" data-fb="zfit" aria-label="Fit to screen" title="Fit to screen"><span data-fb="zlabel">100%</span></button><button class="fb-btn" type="button" data-fb="zin" aria-label="Zoom in">+</button></span>`;
      el.innerHTML = `
        <div class="fb-stage"><div class="fb-zw"></div><div class="fb-scroll" hidden><div class="fb-col"></div></div></div>
        <div class="fb-line" aria-hidden="true"><i class="fb-prog"><b></b></i><span class="fb-topic"></span><span class="fb-pno"></span></div>
        <div class="fb-bar">
          <button class="fb-btn" type="button" data-fb="close" aria-label="Close">✕<span class="fb-lbl"> Close</span></button>
          <div class="fb-title"><b>${esc(o.title)}</b><span data-fb="count"></span></div>
          ${o.download ? `<a class="fb-btn sun fb-opt" href="${esc(o.download.href)}" download>${esc(o.download.label)}</a>` : ""}
          ${this.marksOn ? `<button class="fb-btn" type="button" data-fb="mark" aria-pressed="false" aria-label="Bookmark this page" title="Bookmark this page (B)">${ICON.star}</button>` : ""}
          ${o.onDoubt ? `<button class="fb-btn" type="button" data-fb="doubt" aria-label="Ask Adeel Sir a doubt about this page" title="Ask a doubt about this page">❓<span class="fb-lbl">Doubt</span></button>` : ""}
          <button class="fb-btn" type="button" data-fb="view" aria-label="View settings" title="View: book or scroll, night mode, zoom, full screen">${ICON.view}<span class="fb-lbl">View</span></button>
          <button class="fb-btn sun" type="button" data-fb="toc">${o.toc.length ? "Topics" : "Pages"}</button>
        </div>
        <div class="fb-nav"><div class="fb-nav-in">
          <button class="fb-btn" type="button" data-fb="prev" aria-label="Previous page">‹<span class="fb-lbl"> Previous</span></button>
          <input class="fb-range" type="range" min="1" max="${this.n}" value="${this.cur}" aria-label="Page">
          <button class="fb-btn" type="button" data-fb="next" aria-label="Next page"><span class="fb-lbl">Next </span>›</button>
          ${zc}
        </div></div>
        <div class="fb-hint" aria-live="polite"></div>
        <div class="fb-toast" role="status"></div>
        <div class="fb-panel" data-panel="toc" hidden><div class="fb-panel-body">
          <div class="fb-panel-top"><h2>${o.toc.length ? "Topics" : "Go to page"}</h2><button class="fb-btn" type="button" data-fb="panel-close">Close</button></div>
          <form class="fb-jump"><input type="number" inputmode="numeric" min="1" max="${this.n}" placeholder="Page number (1–${this.n})" aria-label="Page number"><button class="fb-btn" type="submit">Go</button></form>
          ${this.marksOn ? `<h3>My bookmarks</h3><ol class="fb-toc fb-marks"></ol>` : ""}
          ${o.toc.length ? `<h3>Topics</h3><ol class="fb-toc fb-topics">${o.toc.map(([name, p], i) => `<li><button type="button" data-go="${p}"><span class="n">${i + 1}</span><span>${name}</span><span class="p">p. ${p}</span></button></li>`).join("")}</ol>` : ""}
        </div></div>
        <div class="fb-panel" data-panel="view" hidden><div class="fb-panel-body">
          <div class="fb-panel-top"><h2>View</h2><button class="fb-btn" type="button" data-fb="panel-close">Done</button></div>
          <h3>How to read</h3>
          <div class="fb-seg" role="group" aria-label="Reading mode"><button type="button" data-mode="book">📖 Book</button><button type="button" data-mode="scroll">↕ Scroll</button></div>
          <p class="fb-empty" style="margin-top: 8px">Book: turn pages like a real book. Scroll: pages one under another, like a PDF.</p>
          <div class="fb-row"><div><b>Night mode</b><small>Softer, warmer pages for reading at night</small></div><button class="fb-btn" type="button" data-fb="night" aria-pressed="${this.p.night}">${this.p.night ? "On" : "Off"}</button></div>
          <div class="fb-row"><div><b>Zoom</b><small>${touchFirst() ? "Or pinch, or double-tap the page" : "Or double-click the page, or Ctrl + scroll"}</small></div>${zc}</div>
          ${fsOK ? `<div class="fb-row"><div><b>Full screen</b><small>Hide everything except the book</small></div><button class="fb-btn" type="button" data-fb="full" aria-pressed="false">${ICON.full}<span data-fb="full-label">Go full screen</span></button></div>` : ""}
          <h3>Shortcuts</h3>
          <ul class="fb-keys">${touchFirst()
            ? `<li>Tap the right or left side: next or previous page</li><li>Tap the middle: show or hide the menus</li><li>Pinch or double-tap: zoom; drag to move around</li>`
            : `<li><kbd>→</kbd> <kbd>←</kbd> <kbd>Space</kbd> turn pages</li><li><kbd>+</kbd> <kbd>−</kbd> zoom, <kbd>0</kbd> fit</li><li><kbd>F</kbd> full screen${this.marksOn ? ", <kbd>B</kbd> bookmark" : ""}, <kbd>Esc</kbd> close</li><li>Click the right or left side to turn; drag to move when zoomed</li>`}</ul>
        </div></div>`;
      document.body.appendChild(el);
      this.prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.lastFocus = document.activeElement;

      const q = s => el.querySelector(s);
      this.$stage = q(".fb-stage"); this.$zw = q(".fb-zw"); this.$scroll = q(".fb-scroll"); this.$col = q(".fb-col");
      this.$count = q('[data-fb="count"]'); this.$range = q(".fb-range");
      this.$topic = q(".fb-topic"); this.$pno = q(".fb-pno"); this.$prog = q(".fb-prog b");
      this.$hint = q(".fb-hint"); this.$toast = q(".fb-toast");
      el.addEventListener("click", e => this.onClick(e));
      el.addEventListener("contextmenu", e => e.preventDefault());
      el.addEventListener("dragstart", e => e.preventDefault());
      this.$range.addEventListener("change", () => this.go(+this.$range.value));
      this.$range.addEventListener("input", () => { this.$count.textContent = `Page ${this.$range.value} / ${this.n}`; });
      q(".fb-jump").addEventListener("submit", e => {
        e.preventDefault();
        const v = parseInt(e.target.querySelector("input").value, 10);
        if (v) { this.panel(null); this.go(v); }
      });
      this.onKey = e => this.key(e);
      document.addEventListener("keydown", this.onKey);
      this.wireBook();
      this.wireScroll();

      // Menus: shown at first, then hidden after a few quiet seconds. A mouse near the top or bottom brings them back.
      el.addEventListener("pointermove", e => {
        if (e.pointerType === "mouse" && (e.clientY < 90 || e.clientY > window.innerHeight - 100)) this.chrome(true);
      });
      ["fb-bar", "fb-nav"].forEach(c => {
        q("." + c).addEventListener("pointerenter", () => { this.hover = true; clearTimeout(this.calmT); });
        q("." + c).addEventListener("pointerleave", () => { this.hover = false; this.chrome(true); });
      });

      // Phones resize the screen a little when the address bar shows or hides; only rebuild for a real change
      // (rotation, a new window size, full screen), and never in the middle of a page turn.
      let t = null;
      this.onResize = () => {
        clearTimeout(t);
        t = setTimeout(() => {
          const w = this.$stage.clientWidth, h = this.$stage.clientHeight;
          if (Math.abs(w - this.sw) < 40 && Math.abs(h - this.sh) < 140) return;
          if (this.state !== "read") return this.onResize();
          this.build();
        }, 250);
      };
      window.addEventListener("resize", this.onResize);
      this.onFs = () => {
        const on = !!(document.fullscreenElement || document.webkitFullscreenElement);
        const b = q('[data-fb="full"]');
        if (b) { b.setAttribute("aria-pressed", String(on)); q('[data-fb="full-label"]').textContent = on ? "Exit full screen" : "Go full screen"; }
      };
      document.addEventListener("fullscreenchange", this.onFs);
      document.addEventListener("webkitfullscreenchange", this.onFs);
      // Keep the screen on while the book is open (where the browser allows it).
      this.onVis = () => { if (document.visibilityState === "visible" && this.el) this.keepAwake(); };
      document.addEventListener("visibilitychange", this.onVis);
      this.keepAwake();

      this.build();
      this.chrome(true);
      this.tip();
      el.focus({ preventScroll: true });
      return this;
    }

    // ---------- building the two modes ----------
    // Book mode on a phone held sideways is two tiny pages, so a sideways phone reads in Scroll mode unless the
    // student picks Book in this session.
    build() {
      this.sw = this.$stage.clientWidth; this.sh = this.$stage.clientHeight;
      const sidewaysPhone = touchFirst() && this.sw > this.sh && this.sh < 520;
      this.mode = this.choice || (sidewaysPhone ? "scroll" : this.p.mode === "scroll" ? "scroll" : "book");
      this.el.classList.toggle("scrollmode", this.mode === "scroll");
      this.el.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === this.mode)));
      if (this.flip) { try { this.flip.destroy(); } catch (e) {} this.flip = null; }
      this.$zw.replaceChildren();
      this.$col.replaceChildren();
      if (this.mode === "scroll") this.buildScroll(); else this.buildBook();
    }

    buildBook() {
      this.$scroll.hidden = true; this.$zw.hidden = false;
      this.z = 1; this.tx = 0; this.ty = 0; this.applyT();
      const W = this.$zw.clientWidth, H = this.$zw.clientHeight;
      const spread = W > H && W >= 700;
      let pw = Math.floor(Math.min(spread ? W / 2 : W, H * RATIO));
      pw = Math.max(pw, 200);
      const ph = Math.floor(pw / RATIO);
      const book = document.createElement("div");
      book.className = "fb-book";
      book.style.width = (spread ? pw * 2 : pw) + "px";
      book.style.height = ph + "px";
      this.$zw.appendChild(book);
      this.$book = book;
      this.pages = [];
      for (let i = 1; i <= this.n; i++) {
        const p = document.createElement("div");
        p.className = "fb-page";
        p.dataset.density = i === 1 || i === this.n ? "hard" : "soft";
        p.appendChild(this.loaded.get(i) || this.placeholder(i));
        book.appendChild(p);
        this.pages.push(p);
      }
      this.flip = new St.PageFlip(book, {
        width: pw, height: ph, size: "fixed", showCover: true, usePortrait: !spread,
        mobileScrollSupport: false, useMouseEvents: false, flippingTime: 600, maxShadowOpacity: 0.45, drawShadow: true, startPage: this.cur - 1
      });
      this.flip.loadFromHTML(this.pages);
      this.state = "read"; this.queued = 0;
      this.flip.on("flip", e => this.setPage(e.data + 1));
      // A turn asked for during an animation runs right after it, instead of being lost.
      this.flip.on("changeState", e => {
        this.state = e.data;
        if (e.data === "read" && this.queued) { const d = this.queued; this.queued = 0; this.turn(d); }
      });
      this.setPage(this.flip.getCurrentPageIndex() + 1);
    }

    buildScroll() {
      this.$zw.hidden = true; this.$scroll.hidden = false;
      this.state = "read"; this.$book = null;
      this.pages = [];
      for (let i = 1; i <= this.n; i++) {
        const p = document.createElement("div");
        p.className = "fb-sp";
        p.dataset.n = `Page ${i}`;
        const node = this.loaded.get(i);
        p.appendChild(node || this.placeholder(i));
        if (node) p.classList.add("ok");
        this.$col.appendChild(p);
        this.pages.push(p);
      }
      this.z = clamp(+this.p.sz || 1, 1, ZMAX);
      this.layoutScroll();
      this.applyT();
      const n = this.cur;
      requestAnimationFrame(() => { this.$scroll.scrollTop = Math.max(0, this.pages[n - 1].offsetTop - 40); this.setPage(n); });
    }

    // Scroll mode: the page column is as wide as the screen allows (at most 860 px), times the zoom.
    layoutScroll() {
      const base = Math.min(this.$scroll.clientWidth - 16, 860);
      this.$col.style.width = Math.round(base * this.z) + "px";
    }

    placeholder(i) {
      const d = document.createElement("div");
      d.className = "fb-ph";
      d.innerHTML = `<div class="fb-spin"></div>Page ${i}`;
      return d;
    }

    // ---------- page state ----------
    setPage(n) {
      this.cur = n;
      const spread = this.mode === "book" && this.flip && this.flip.getOrientation && this.flip.getOrientation() === "landscape";
      const two = spread && n > 1 && n < this.n;
      this.$count.textContent = two ? `Page ${n}–${n + 1} / ${this.n}` : `Page ${n} / ${this.n}`;
      this.$range.value = n;
      this.$pno.textContent = two ? `${n}–${n + 1} / ${this.n}` : `${n} / ${this.n}`;
      this.$prog.style.width = `${Math.round(((two ? n + 1 : n) / this.n) * 100)}%`;
      const t = this.topicAt(n);
      this.$topic.innerHTML = t ? `${t.i + 1}. ${t.name}` : esc(this.o.title);
      this.el.querySelectorAll(".fb-topics button").forEach((b, i) => b.classList.toggle("here", !!t && i === t.i));
      this.markUI();
      if (this.o.onPage) this.o.onPage(n);
      this.fill();
    }
    topicAt(n) {
      let found = null;
      this.o.toc.forEach(([name, p], i) => { if (p <= n) found = { name, i }; });
      return found;
    }

    // Keep only the pages near the open one in memory.
    fill() {
      const from = Math.max(1, this.cur - 2), to = Math.min(this.n, this.cur + 4);
      for (let i = from; i <= to; i++) this.load(i);
      for (const [i, node] of this.loaded) {
        if (i < this.cur - 5 || i > this.cur + 7) {
          this.loaded.delete(i);
          const p = this.pages[i - 1];
          if (p && p.contains(node)) { p.replaceChildren(this.placeholder(i)); p.classList.remove("ok"); }
        }
      }
    }

    async load(i) {
      if (this.loaded.has(i) || this.pending?.has(i)) return;
      (this.pending = this.pending || new Set()).add(i);
      try {
        const node = await this.o.loadPage(i);
        if (!this.el || Math.abs(i - this.cur) > 7) return;
        this.loaded.set(i, node);
        const p = this.pages[i - 1];
        if (p) {
          // In Scroll mode a page that grows above the reading place would push the page being read down.
          const keep = this.mode === "scroll" && i < this.cur ? this.$scroll.scrollHeight - this.$scroll.scrollTop : null;
          p.replaceChildren(node); p.classList.add("ok");
          if (keep !== null) this.$scroll.scrollTop = this.$scroll.scrollHeight - keep;
        }
      } catch (e) {
        const p = this.pages[i - 1];
        if (p) p.querySelector(".fb-ph")?.replaceChildren(document.createTextNode(`Page ${i} could not load. Check your internet.`));
      } finally {
        this.pending.delete(i);
      }
    }

    turn(dir) {
      if (this.mode === "scroll") return this.go(this.cur + dir);
      if (!this.flip) return;
      if (this.z > 1.01) this.zoomTo(1);
      if (this.state !== "read") { this.queued = dir; return; }
      if (dir > 0) this.flip.flipNext(); else this.flip.flipPrev();
    }

    go(n) {
      n = Math.min(Math.max(1, n), this.n);
      if (this.mode === "scroll") {
        this.$scroll.scrollTo({ top: Math.max(0, this.pages[n - 1].offsetTop - 40), behavior: Math.abs(n - this.cur) <= 1 ? "smooth" : "auto" });
        this.setPage(n);
        return;
      }
      if (!this.flip) return;
      if (this.z > 1.01) this.zoomTo(1);
      if (Math.abs(n - this.cur) <= 2) this.flip.flip(n - 1); else this.flip.turnToPage(n - 1);
      this.setPage(this.flip.getCurrentPageIndex() + 1);
    }

    // ---------- zoom ----------
    // Book mode zooms the whole book (both pages of a spread) around a point with a CSS transform; the page
    // images are drawn again from the full picture, so text stays sharp. Scroll mode makes the pages wider.
    zoomAt(z, cx, cy) {
      z = clamp(z, 1, ZMAX);
      if (this.mode === "scroll") return this.scrollZoom(z, cx, cy);
      const o = this.origin(), fx = cx - o.x, fy = cy - o.y;
      const px = (fx - this.tx) / this.z, py = (fy - this.ty) / this.z;
      this.z = z; this.tx = fx - px * z; this.ty = fy - py * z;
      this.clampPan(); this.applyT();
    }
    zoomTo(z) {
      const r = this.$stage.getBoundingClientRect();
      this.zoomAt(z, r.left + r.width / 2, r.top + r.height / 2);
    }
    zoomStep(dir) { this.zoomTo(dir > 0 ? Math.min(ZMAX, Math.round((this.z + 0.25) * 4) / 4) : Math.max(1, Math.round((this.z - 0.25) * 4) / 4)); }
    origin() { const r = this.$stage.getBoundingClientRect(); return { x: r.left + this.$zw.offsetLeft, y: r.top + this.$zw.offsetTop }; }
    // When zoomed in, the book can be moved but never off screen; when it is smaller than the screen it stays centred.
    clampPan() {
      if (!this.$book || this.z <= 1.001) { this.z = 1; this.tx = 0; this.ty = 0; return; }
      const W = this.$zw.clientWidth, H = this.$zw.clientHeight, b = this.$book, z = this.z;
      const fit = (t, lo, size, view) => size * z <= view ? (view - size * z) / 2 - lo * z : clamp(t, view - (lo + size) * z, -lo * z);
      this.tx = fit(this.tx, b.offsetLeft, b.offsetWidth, W);
      this.ty = fit(this.ty, b.offsetTop, b.offsetHeight, H);
    }
    applyT() {
      if (this.mode !== "scroll") this.$zw.style.transform = this.z > 1.001 ? `translate(${this.tx}px, ${this.ty}px) scale(${this.z})` : "";
      this.el.classList.toggle("zoomed", this.z > 1.01 && this.mode !== "scroll");
      this.el.querySelectorAll('[data-fb="zlabel"]').forEach(s => { s.textContent = this.z > 1.01 ? `${Math.round(this.z * 100)}%` : "Fit"; });
    }
    scrollZoom(z, cx, cy) {
      const sc = this.$scroll, r = sc.getBoundingClientRect(), fx = cx - r.left, fy = cy - r.top;
      const ox = (sc.scrollLeft + fx) / sc.scrollWidth, oy = (sc.scrollTop + fy) / sc.scrollHeight;
      this.z = z; this.layoutScroll();
      sc.scrollLeft = ox * sc.scrollWidth - fx; sc.scrollTop = oy * sc.scrollHeight - fy;
      this.p.sz = Math.round(z * 100) / 100; prefs.set(this.p);
      this.applyT();
    }

    // ---------- touch, mouse and wheel in Book mode ----------
    // One finger: a tap on the right or left side turns the page, a tap in the middle shows or hides the menus,
    // a sideways swipe turns, and when zoomed in a drag moves the page. Two fingers: pinch to zoom.
    wireBook() {
      const st = this.$stage, pts = new Map();
      let g = null;
      const rel = e => ({ x: e.clientX, y: e.clientY });
      st.addEventListener("pointerdown", e => {
        if (this.mode !== "book" || e.button > 0) return;
        try { st.setPointerCapture(e.pointerId); } catch (err) {}
        pts.set(e.pointerId, rel(e));
        if (pts.size === 2) {
          const [a, b] = [...pts.values()], o = this.origin();
          const mid = { x: (a.x + b.x) / 2 - o.x, y: (a.y + b.y) / 2 - o.y };
          g = { pinch: true, d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, px: (mid.x - this.tx) / this.z, py: (mid.y - this.ty) / this.z, z0: this.z };
          this.el.classList.add("panning");
        } else if (pts.size === 1) {
          g = { x0: e.clientX, y0: e.clientY, tx0: this.tx, ty0: this.ty, moved: false, type: e.pointerType };
        }
      });
      st.addEventListener("pointermove", e => {
        if (!pts.has(e.pointerId) || !g) return;
        pts.set(e.pointerId, rel(e));
        if (g.pinch && pts.size >= 2) {
          const [a, b] = [...pts.values()], o = this.origin();
          const mid = { x: (a.x + b.x) / 2 - o.x, y: (a.y + b.y) / 2 - o.y };
          this.z = clamp(g.z0 * Math.hypot(a.x - b.x, a.y - b.y) / g.d0, 1, ZMAX);
          this.tx = mid.x - g.px * this.z; this.ty = mid.y - g.py * this.z;
          this.clampPan(); this.applyT();
          return;
        }
        const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) g.moved = true;
        if (this.z > 1.01 && g.moved) {
          this.el.classList.add("panning");
          this.tx = g.tx0 + dx; this.ty = g.ty0 + dy;
          this.clampPan(); this.applyT();
        }
      });
      const end = e => {
        if (!pts.has(e.pointerId)) return;
        pts.delete(e.pointerId);
        if (!g) return;
        if (g.pinch) {
          if (pts.size === 1) { const [p] = [...pts.values()]; g = { x0: p.x, y0: p.y, tx0: this.tx, ty0: this.ty, moved: true }; return; }
          g = null; this.el.classList.remove("panning");
          if (this.z < 1.08) { this.z = 1; this.clampPan(); this.applyT(); }
          return;
        }
        const s = g; g = null; this.el.classList.remove("panning");
        if (e.type === "pointercancel") return;
        const dx = e.clientX - s.x0, dy = e.clientY - s.y0;
        if (!s.moved) return this.tap(e.clientX, e.clientY);
        if (this.z <= 1.01 && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) this.turn(dx < 0 ? 1 : -1);
      };
      st.addEventListener("pointerup", end);
      st.addEventListener("pointercancel", end);
      // Ctrl + scroll (and a laptop trackpad pinch) zooms; when zoomed, scrolling moves the page; otherwise
      // one scroll gesture turns one page.
      let acc = 0, lock = 0, idle = null;
      st.addEventListener("wheel", e => {
        // A mouse wheel step is about 100; a trackpad pinch sends many small steps. Either way, at most ~35% per step.
        if (e.ctrlKey) { e.preventDefault(); this.zoomAt(this.z * Math.exp(-clamp(e.deltaY, -40, 40) * 0.008), e.clientX, e.clientY); return; }
        if (this.mode !== "book") return;
        e.preventDefault();
        if (this.z > 1.01) { this.tx -= e.deltaX; this.ty -= e.deltaY; this.clampPan(); this.applyT(); return; }
        acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        clearTimeout(idle); idle = setTimeout(() => { acc = 0; }, 220);
        if (Math.abs(acc) > 60 && Date.now() > lock) { this.turn(acc > 0 ? 1 : -1); acc = 0; lock = Date.now() + 550; }
      }, { passive: false });
    }

    // A tap: double-tap (or double-click) in the middle, or anywhere when zoomed, zooms in or back out.
    tap(x, y) {
      const now = Date.now(), last = this.lastTap, zone = this.zoneAt(x);
      const dbl = last && now - last.t < 320 && Math.hypot(x - last.x, y - last.y) < 40 && (last.zone === 0 || this.z > 1.01 || this.mode === "scroll");
      if (dbl) {
        clearTimeout(this.tapT); this.lastTap = null;
        if (this.z > 1.01) { if (this.mode === "scroll") this.zoomAt(1, x, y); else this.zoomTo(1); }
        else this.zoomAt(2, x, y);
        return;
      }
      this.lastTap = { t: now, x, y, zone };
      if (this.z > 1.01 || zone === 0 || this.mode === "scroll") {
        clearTimeout(this.tapT);
        this.tapT = setTimeout(() => this.chrome(this.el.classList.contains("calm")), 300);
        return;
      }
      this.turn(zone);
    }
    // Left 30% of the book: back; right 30%: forward; the middle: menus.
    zoneAt(x) {
      if (this.mode === "scroll" || !this.$book) return 0;
      const r = this.$book.getBoundingClientRect(), f = (x - r.left) / r.width;
      return f < 0.3 ? -1 : f > 0.7 ? 1 : 0;
    }

    // ---------- Scroll mode ----------
    wireScroll() {
      const sc = this.$scroll;
      let raf = 0;
      sc.addEventListener("scroll", () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (this.mode !== "scroll") return;
          const line = sc.scrollTop + sc.clientHeight * 0.35;
          let n = 1;
          for (let i = 0; i < this.pages.length; i++) { if (this.pages[i].offsetTop <= line) n = i + 1; else break; }
          if (n !== this.cur) this.setPage(n);
        });
      }, { passive: true });
      // Taps (a scroll is not a tap: the browser cancels the pointer when the page starts to move).
      let down = null;
      sc.addEventListener("pointerdown", e => { down = e.button > 0 ? null : { x: e.clientX, y: e.clientY, id: e.pointerId }; });
      sc.addEventListener("pointercancel", () => { down = null; });
      sc.addEventListener("pointerup", e => {
        const d = down; down = null;
        if (!d || d.id !== e.pointerId || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10) return;
        this.tap(e.clientX, e.clientY);
      });
      // Pinch with two fingers changes the page width; one finger scrolls as usual.
      let pinch = null;
      const two = t => ({ d: Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY) || 1, x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });
      sc.addEventListener("touchstart", e => { if (e.touches.length === 2) { const m = two(e.touches); pinch = { d0: m.d, z0: this.z }; } }, { passive: true });
      sc.addEventListener("touchmove", e => {
        if (!pinch || e.touches.length !== 2) return;
        e.preventDefault();
        const m = two(e.touches), z = clamp(pinch.z0 * m.d / pinch.d0, 1, ZMAX);
        if (Math.abs(z - this.z) > 0.02) this.scrollZoom(z, m.x, m.y);
      }, { passive: false });
      sc.addEventListener("touchend", e => { if (e.touches.length < 2) pinch = null; });
    }

    // ---------- menus, panels, settings ----------
    chrome(show) {
      clearTimeout(this.calmT);
      this.el.classList.toggle("calm", !show);
      if (show) this.calmT = setTimeout(() => { if (!this.hover && !this.openPanel) this.el.classList.add("calm"); }, 3200);
    }
    panel(name) {
      this.el.querySelectorAll(".fb-panel").forEach(p => { p.hidden = p.dataset.panel !== name; });
      this.openPanel = name;
      if (name) { this.chrome(true); if (name === "toc") this.renderMarks(); }
      else { this.chrome(true); this.el.focus({ preventScroll: true }); }
    }
    setMode(m) {
      if (m === this.mode) return;
      this.choice = m; this.p.mode = m; prefs.set(this.p);
      this.build();
      this.toast(m === "scroll" ? "Scroll mode" : "Book mode");
    }
    setNight(on) {
      this.p.night = on; prefs.set(this.p);
      this.el.classList.toggle("night", on);
      const b = this.el.querySelector('[data-fb="night"]');
      if (b) { b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "On" : "Off"; }
    }
    fullscreen() {
      const d = document;
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else { const f = this.el.requestFullscreen || this.el.webkitRequestFullscreen; if (f) Promise.resolve(f.call(this.el)).catch(() => {}); }
    }
    async keepAwake() {
      try { if (navigator.wakeLock && !this.wake) { this.wake = await navigator.wakeLock.request("screen"); this.wake.addEventListener("release", () => { this.wake = null; }); } } catch (e) {}
    }
    toast(t) {
      this.$toast.textContent = t; this.$toast.classList.add("on");
      clearTimeout(this.toastT); this.toastT = setTimeout(() => this.$toast.classList.remove("on"), 1400);
    }
    // A short tip, shown on the first few openings only.
    tip() {
      if (this.p.tips >= 3) { this.$hint.remove(); return; }
      this.p.tips++; prefs.set(this.p);
      this.$hint.textContent = touchFirst()
        ? "Tap the sides to turn · Pinch or double-tap to zoom · Tap the middle for the menu"
        : "Click the sides or use ← → to turn · Double-click or Ctrl + scroll to zoom";
      setTimeout(() => { if (this.$hint) this.$hint.style.opacity = "0"; }, 4500);
    }

    // ---------- bookmarks ----------
    markUI() {
      const b = this.el.querySelector('[data-fb="mark"]');
      if (!b) return;
      const on = this.marks.has(this.cur);
      b.setAttribute("aria-pressed", String(on));
      b.innerHTML = on ? ICON.starOn : ICON.star;
      b.setAttribute("aria-label", on ? `Remove the bookmark on page ${this.cur}` : `Bookmark page ${this.cur}`);
    }
    toggleMark() {
      if (!this.marksOn) return;
      const n = this.cur, on = !this.marks.has(n);
      if (on) this.marks.add(n); else this.marks.delete(n);
      this.markUI(); this.renderMarks();
      this.toast(on ? `★ Page ${n} bookmarked` : `Bookmark on page ${n} removed`);
      this.o.onMarks([...this.marks].sort((a, b) => a - b));
    }
    setMarks(list) { this.marks = new Set((list || []).map(Number)); this.markUI(); this.renderMarks(); }
    renderMarks() {
      const box = this.el && this.el.querySelector(".fb-marks");
      if (!box) return;
      const list = [...this.marks].sort((a, b) => a - b);
      box.innerHTML = list.length ? list.map(p => { const t = this.topicAt(p); return `<li><button type="button" data-go="${p}"><span class="n">★</span><span>${t ? t.name : "Page " + p}</span><span class="p">p. ${p}</span></button></li>`; }).join("")
        : `<li class="fb-empty">No bookmarks yet. Tap ☆ on top to mark the page you are on.</li>`;
    }

    // ---------- keys and clicks ----------
    key(e) {
      if (!this.el || e.target.closest("input, textarea, select")) return;
      const k = e.key, onButton = e.target.closest("button, a");
      if (k === "Escape") {
        e.preventDefault();
        if (this.openPanel) this.panel(null);
        else if (this.z > 1.01 && this.mode === "book") this.zoomTo(1);
        else this.close();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && ["s", "p"].includes(k.toLowerCase())) { e.preventDefault(); return; }
      if (e.ctrlKey || e.metaKey || e.altKey || this.openPanel) return;
      const act = {
        ArrowRight: () => this.turn(1), ArrowLeft: () => this.turn(-1), PageDown: () => this.turn(1), PageUp: () => this.turn(-1),
        "+": () => this.zoomStep(1), "=": () => this.zoomStep(1), "-": () => this.zoomStep(-1), "0": () => this.zoomTo(1),
        f: () => this.fullscreen(), F: () => this.fullscreen(), b: () => this.toggleMark(), B: () => this.toggleMark(),
        " ": () => this.mode === "scroll" ? this.$scroll.scrollBy({ top: this.$scroll.clientHeight * 0.85 * (e.shiftKey ? -1 : 1), behavior: "smooth" }) : this.turn(e.shiftKey ? -1 : 1)
      }[k];
      if (!act || (k === " " && onButton)) return;
      // In Scroll mode the arrow keys up and down scroll as usual; left and right go page by page.
      e.preventDefault();
      act();
    }

    onClick(e) {
      const go = e.target.closest("[data-go]");
      if (go) { this.panel(null); this.go(+go.dataset.go); return; }
      const m = e.target.closest("[data-mode]");
      if (m) { this.setMode(m.dataset.mode); return; }
      if (e.target.classList.contains("fb-panel")) { this.panel(null); return; }
      const b = e.target.closest("[data-fb]");
      if (!b) return;
      const a = b.dataset.fb;
      if (a === "zlabel") return this.zoomTo(1);
      ({
        close: () => this.close(), prev: () => this.turn(-1), next: () => this.turn(1),
        toc: () => this.panel("toc"), view: () => this.panel("view"), "panel-close": () => this.panel(null),
        doubt: () => this.o.onDoubt && this.o.onDoubt(this.cur),
        zin: () => this.zoomStep(1), zout: () => this.zoomStep(-1), zfit: () => this.zoomTo(1),
        night: () => this.setNight(!this.p.night), full: () => this.fullscreen(), mark: () => this.toggleMark()
      }[a] || (() => {}))();
      if (["prev", "next", "zin", "zout", "zfit", "mark"].includes(a)) this.chrome(true);
    }

    close() {
      if (!this.el) return;
      document.removeEventListener("keydown", this.onKey);
      window.removeEventListener("resize", this.onResize);
      document.removeEventListener("fullscreenchange", this.onFs);
      document.removeEventListener("webkitfullscreenchange", this.onFs);
      document.removeEventListener("visibilitychange", this.onVis);
      clearTimeout(this.calmT); clearTimeout(this.tapT); clearTimeout(this.toastT);
      if (document.fullscreenElement === this.el || document.webkitFullscreenElement === this.el) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} }
      if (this.wake) { this.wake.release().catch(() => {}); this.wake = null; }
      try { this.flip && this.flip.destroy(); } catch (e) {}
      this.el.remove();
      this.el = null;
      this.loaded.clear();
      document.body.style.overflow = this.prevOverflow || "";
      if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus();
      if (this.o.onClose) this.o.onClose();
    }
  }
  window.Flipbook = Flipbook;
})();
