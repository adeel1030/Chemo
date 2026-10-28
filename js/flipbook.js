// Book-style reader with a page-turn animation. Used for the free samples (index.html)
// and for bought chapters (read.html). Needs St.PageFlip (page-flip 2.0.7) loaded first.
//
//   new Flipbook({
//     title, pageCount,
//     loadPage: async n => element,   // an <img> or <canvas> for page n (1-based)
//     start: 1, toc: [[name, page], ...], onPage: n => {}, download: { href, label }
//   }).open();
(function () {
  const CSS = `
  .fb { position: fixed; inset: 0; z-index: 70; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; color: #f3f2ff;
    background: radial-gradient(70% 60% at 50% 45%, #2c2577, #15134a 70%), #15134a; font-family: "Fira Sans", "Segoe UI", Roboto, system-ui, sans-serif;
    padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
    user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
  .fb[hidden] { display: none; }
  .fb-bar { display: flex; align-items: center; gap: 8px; padding: 10px 12px; }
  .fb-title { flex: 1; min-width: 0; }
  .fb-title b { display: block; font: 700 1rem/1.2 "Baloo 2", system-ui, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fb-title span { font-size: .8rem; color: #bcb9ea; font-variant-numeric: tabular-nums; }
  .fb-btn { background: rgba(255,255,255,.12); color: #f3f2ff; border: 0; border-radius: 999px; padding: 8px 14px; font: 600 .88rem inherit; font-family: inherit; cursor: pointer; text-decoration: none; white-space: nowrap; }
  .fb-btn:hover { background: rgba(255,255,255,.22); }
  .fb-btn.sun { background: #ffd24a; color: #2a2100; }
  .fb-btn:focus-visible, .fb-range:focus-visible { outline: 3px solid #ffd24a; outline-offset: 2px; }
  .fb-stage { position: relative; display: grid; place-items: center; min-height: 0; padding: 4px 8px; overflow: hidden; }
  .fb-book { margin: 0 auto; }
  .fb-page { background: #fff; overflow: hidden; }
  .fb-page > img, .fb-page > canvas { width: 100%; height: 100%; display: block; object-fit: contain; pointer-events: none; }
  .fb-ph { width: 100%; height: 100%; display: grid; place-items: center; align-content: center; gap: 10px; color: #6b6990; font-size: .9rem; background: #f6f6fb; }
  .fb-spin { width: 30px; height: 30px; border-radius: 50%; border: 4px solid #dddcee; border-top-color: #3b2fb8; animation: fbspin .9s linear infinite; }
  @keyframes fbspin { to { transform: rotate(360deg); } }
  .fb-nav { display: flex; align-items: center; gap: 10px; padding: 8px 14px 14px; max-width: 820px; width: 100%; margin: 0 auto; }
  .fb-range { flex: 1; min-width: 0; accent-color: #ffd24a; }
  .fb-hint { position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%); background: rgba(0,0,0,.55); padding: 6px 14px; border-radius: 999px; font-size: .85rem; pointer-events: none; transition: opacity .6s; }
  .fb-panel { position: absolute; inset: 0; z-index: 3; background: rgba(10,9,35,.6); display: flex; justify-content: flex-end; }
  .fb-panel[hidden] { display: none; }
  .fb-panel-body { width: min(400px, 100%); height: 100%; overflow-y: auto; background: #f6f6fb; color: #1b1a45; padding: 14px 16px 24px; user-select: text; }
  .fb-panel-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; }
  .fb-panel-top h2 { font: 800 1.25rem "Baloo 2", system-ui, sans-serif; margin: 0; }
  .fb-panel .fb-btn { background: #1b1a45; color: #fff; }
  .fb-jump { display: flex; gap: 8px; margin-bottom: 10px; }
  .fb-jump input { flex: 1; min-width: 0; font: 1rem inherit; padding: 8px 12px; border-radius: 10px; border: 2px solid #dddcee; }
  .fb-toc { list-style: none; margin: 0; padding: 0; }
  .fb-toc button { width: 100%; display: grid; grid-template-columns: 28px minmax(0, 1fr) auto; gap: 10px; align-items: center; text-align: left; background: none; border: 0; border-bottom: 1px solid #dddcee; padding: 11px 2px; font: inherit; color: inherit; cursor: pointer; }
  .fb-toc .n { width: 26px; height: 26px; border-radius: 50%; background: #1b1a45; color: #ffd24a; display: grid; place-items: center; font: 800 .8rem "Baloo 2", system-ui, sans-serif; }
  .fb-toc .p { color: #5d5b80; font-size: .88rem; font-variant-numeric: tabular-nums; }
  .fb-zoom { position: fixed; inset: 0; z-index: 4; background: #15134a; overflow: auto; touch-action: pan-x pan-y pinch-zoom; }
  .fb-zoom[hidden] { display: none; }
  .fb-zoom > canvas, .fb-zoom > img { display: block; width: min(1400px, 200vw); height: auto; margin: 0 auto; }
  .fb-zoom .fb-btn { position: fixed; top: calc(10px + env(safe-area-inset-top, 0px)); right: calc(12px + env(safe-area-inset-right, 0px)); background: #ffd24a; color: #2a2100; }
  @media (max-width: 520px) { .fb-btn { padding: 7px 11px; font-size: .82rem; } .fb-bar .fb-opt, .fb-lbl { display: none; } }
  @media (prefers-reduced-motion: reduce) { .fb-spin { animation-duration: 3s; } }
  `;
  let styled = false;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // A short paper "swish", made with the Web Audio API so no sound file is needed.
  let audio = null;
  function swish() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const len = Math.floor(audio.sampleRate * 0.28), buf = audio.createBuffer(1, len, audio.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      const src = audio.createBufferSource(), f = audio.createBiquadFilter(), g = audio.createGain();
      f.type = "bandpass"; f.Q.value = 0.8;
      f.frequency.setValueAtTime(900, audio.currentTime); f.frequency.linearRampToValueAtTime(3200, audio.currentTime + 0.25);
      g.gain.value = 0.18;
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(audio.destination); src.start();
    } catch (e) {}
  }

  class Flipbook {
    constructor(o) {
      this.o = Object.assign({ start: 1, toc: [] }, o);
      this.n = this.o.pageCount;
      this.cur = Math.min(Math.max(1, this.o.start), this.n);
      this.loaded = new Map(); // page → element
      this.sound = store.get("chemophile-sound") !== "off";
    }

    open() {
      if (!styled) { const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st); styled = true; }
      const o = this.o;
      const el = this.el = document.createElement("div");
      el.className = "fb";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-label", o.title);
      el.innerHTML = `
        <div class="fb-bar">
          <button class="fb-btn" type="button" data-fb="close" aria-label="Band karo">✕<span class="fb-lbl"> Band karo</span></button>
          <div class="fb-title"><b>${esc(o.title)}</b><span data-fb="count"></span></div>
          ${o.download ? `<a class="fb-btn sun fb-opt" href="${esc(o.download.href)}" download>${esc(o.download.label)}</a>` : ""}
          <button class="fb-btn fb-opt" type="button" data-fb="sound"></button>
          <button class="fb-btn" type="button" data-fb="zoom">Zoom</button>
          <button class="fb-btn sun" type="button" data-fb="toc">${o.toc.length ? "Topics" : "Page"}</button>
        </div>
        <div class="fb-stage"><div class="fb-book"></div><div class="fb-hint">Page ke kone ko kheencho ya swipe karo</div>
          <div class="fb-panel" hidden><div class="fb-panel-body">
            <div class="fb-panel-top"><h2>${o.toc.length ? "Topics" : "Page par jao"}</h2><button class="fb-btn" type="button" data-fb="toc-close">Band karo</button></div>
            <form class="fb-jump"><input type="number" inputmode="numeric" min="1" max="${this.n}" placeholder="Page number (1–${this.n})" aria-label="Page number"><button class="fb-btn" type="submit">Jao</button></form>
            <ol class="fb-toc">${o.toc.map(([name, p], i) => `<li><button type="button" data-go="${p}"><span class="n">${i + 1}</span><span>${name}</span><span class="p">p. ${p}</span></button></li>`).join("")}</ol>
          </div></div>
          <div class="fb-zoom" hidden><button class="fb-btn" type="button" data-fb="zoom-close">Band karo ✕</button></div>
        </div>
        <div class="fb-nav">
          <button class="fb-btn" type="button" data-fb="prev" aria-label="Pichla page">‹ Pichla</button>
          <input class="fb-range" type="range" min="1" max="${this.n}" value="${this.cur}" aria-label="Page">
          <button class="fb-btn" type="button" data-fb="next" aria-label="Agla page">Agla ›</button>
        </div>`;
      document.body.appendChild(el);
      this.prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.lastFocus = document.activeElement;

      const q = s => el.querySelector(s);
      this.$count = q('[data-fb="count"]');
      this.$range = q(".fb-range");
      this.$panel = q(".fb-panel");
      this.$zoom = q(".fb-zoom");
      this.updateSoundLabel();
      el.addEventListener("click", e => this.onClick(e));
      el.addEventListener("contextmenu", e => e.preventDefault());
      el.addEventListener("dragstart", e => e.preventDefault());
      this.$range.addEventListener("change", () => this.go(+this.$range.value));
      this.$range.addEventListener("input", () => { this.$count.textContent = `Page ${this.$range.value} / ${this.n}`; });
      q(".fb-jump").addEventListener("submit", e => {
        e.preventDefault();
        const v = parseInt(e.target.querySelector("input").value, 10);
        if (v) { this.$panel.hidden = true; this.go(v); }
      });
      this.onKey = e => {
        if (e.key === "Escape") { if (!this.$zoom.hidden) this.$zoom.hidden = true; else if (!this.$panel.hidden) this.$panel.hidden = true; else this.close(); }
        if (e.key === "ArrowRight") this.flip && this.flip.flipNext();
        if (e.key === "ArrowLeft") this.flip && this.flip.flipPrev();
        if ((e.ctrlKey || e.metaKey) && ["s", "p"].includes(e.key.toLowerCase())) e.preventDefault();
      };
      document.addEventListener("keydown", this.onKey);
      let t = null;
      this.onResize = () => { clearTimeout(t); t = setTimeout(() => this.build(), 250); };
      window.addEventListener("resize", this.onResize);
      setTimeout(() => { const h = q(".fb-hint"); if (h) h.style.opacity = "0"; }, 3500);
      this.build();
      q('[data-fb="close"]').focus();
      return this;
    }

    // (Re)creates the book for the current screen size. Two facing pages when the screen is wide, one when narrow.
    build() {
      const stage = this.el.querySelector(".fb-stage");
      const W = stage.clientWidth - 16, H = stage.clientHeight - 8;
      const ratio = 595 / 842;
      const spread = W > H && W >= 700;
      let pw = Math.floor(Math.min(spread ? W / 2 : W, H * ratio));
      pw = Math.max(pw, 200);
      const ph = Math.floor(pw / ratio);
      // destroy() also removes the old book element from the page.
      if (this.flip) { try { this.flip.destroy(); } catch (e) {} this.flip = null; }
      stage.querySelectorAll(".fb-book").forEach(x => x.remove());
      const book = document.createElement("div");
      book.className = "fb-book";
      book.style.width = (spread ? pw * 2 : pw) + "px";
      book.style.height = ph + "px";
      stage.prepend(book);
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
        mobileScrollSupport: false, flippingTime: 650, maxShadowOpacity: 0.45, drawShadow: true, startPage: this.cur - 1
      });
      this.flip.loadFromHTML(this.pages);
      this.flip.on("flip", e => this.setPage(e.data + 1));
      this.flip.on("changeState", e => { if (e.data === "flipping" && this.sound) swish(); });
      this.setPage(this.flip.getCurrentPageIndex() + 1);
    }

    placeholder(i) {
      const d = document.createElement("div");
      d.className = "fb-ph";
      d.innerHTML = `<div class="fb-spin"></div>Page ${i}`;
      return d;
    }

    setPage(n) {
      this.cur = n;
      const spread = this.flip && this.flip.getOrientation && this.flip.getOrientation() === "landscape";
      const label = spread && n > 1 && n < this.n ? `Page ${n}–${n + 1} / ${this.n}` : `Page ${n} / ${this.n}`;
      this.$count.textContent = label;
      this.$range.value = n;
      if (this.o.onPage) this.o.onPage(n);
      this.fill();
    }

    // Keep only the pages near the open one in memory.
    fill() {
      const from = Math.max(1, this.cur - 2), to = Math.min(this.n, this.cur + 4);
      for (let i = from; i <= to; i++) this.load(i);
      for (const [i, node] of this.loaded) {
        if (i < this.cur - 5 || i > this.cur + 7) {
          this.loaded.delete(i);
          const p = this.pages[i - 1];
          if (p && p.contains(node)) p.replaceChildren(this.placeholder(i));
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
        if (p) p.replaceChildren(node);
      } catch (e) {
        const p = this.pages[i - 1];
        if (p) p.querySelector(".fb-ph")?.replaceChildren(document.createTextNode(`Page ${i} load nahi hua. Internet check karo.`));
      } finally {
        this.pending.delete(i);
      }
    }

    go(n) {
      n = Math.min(Math.max(1, n), this.n);
      if (!this.flip) return;
      if (Math.abs(n - this.cur) <= 2) this.flip.flip(n - 1); else this.flip.turnToPage(n - 1);
      this.setPage(this.flip.getCurrentPageIndex() + 1);
    }

    updateSoundLabel() {
      this.el.querySelector('[data-fb="sound"]').textContent = this.sound ? "Awaaz: on" : "Awaaz: off";
    }

    onClick(e) {
      const go = e.target.closest("[data-go]");
      if (go) { this.$panel.hidden = true; this.go(+go.dataset.go); return; }
      const b = e.target.closest("[data-fb]");
      if (e.target === this.$panel) { this.$panel.hidden = true; return; }
      if (!b) return;
      const a = b.dataset.fb;
      if (a === "close") this.close();
      if (a === "prev") this.flip && this.flip.flipPrev();
      if (a === "next") this.flip && this.flip.flipNext();
      if (a === "toc") this.$panel.hidden = false;
      if (a === "toc-close") this.$panel.hidden = true;
      if (a === "sound") { this.sound = !this.sound; store.set("chemophile-sound", this.sound ? "on" : "off"); this.updateSoundLabel(); if (this.sound) swish(); }
      if (a === "zoom") this.zoom();
      if (a === "zoom-close") this.$zoom.hidden = true;
    }

    zoom() {
      const node = this.loaded.get(this.cur);
      if (!node) return;
      let copy;
      if (node.tagName === "CANVAS") {
        copy = document.createElement("canvas");
        copy.width = node.width; copy.height = node.height;
        copy.getContext("2d").drawImage(node, 0, 0);
      } else {
        copy = document.createElement("img");
        copy.src = node.src; copy.alt = node.alt || "";
      }
      this.$zoom.querySelectorAll("canvas, img").forEach(x => x.remove());
      this.$zoom.appendChild(copy);
      this.$zoom.hidden = false;
      this.$zoom.scrollTo(0, 0);
    }

    close() {
      if (!this.el) return;
      document.removeEventListener("keydown", this.onKey);
      window.removeEventListener("resize", this.onResize);
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
