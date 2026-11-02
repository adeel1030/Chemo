// Light / dark look. "Auto" follows the phone or computer setting; a tap on any [data-theme-toggle] button
// cycles Auto → Dark → Light and remembers the choice on this device. The <head> of each page sets
// data-theme before the page draws (see the one-line script there), so there is no flash of the wrong colours.
(function () {
  const KEY = "chemophile-theme", ORDER = ["auto", "dark", "light"];
  const ICON = { auto: "◐", dark: "☾", light: "☀" }, LABEL = { auto: "Theme: automatic", dark: "Theme: dark", light: "Theme: light" };
  const get = () => { try { return localStorage.getItem(KEY) || "auto"; } catch (e) { return "auto"; } };
  function apply(t) {
    if (t === "auto") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
    document.querySelectorAll("[data-theme-toggle]").forEach(b => { b.textContent = ICON[t]; b.setAttribute("aria-label", LABEL[t] + " (tap to change)"); b.title = LABEL[t]; });
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-theme-toggle]");
    if (!b) return;
    const next = ORDER[(ORDER.indexOf(get()) + 1) % ORDER.length];
    try { if (next === "auto") localStorage.removeItem(KEY); else localStorage.setItem(KEY, next); } catch (err) {}
    apply(next);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => apply(get())); else apply(get());
})();
