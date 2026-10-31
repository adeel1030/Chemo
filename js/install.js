// "Install app" buttons for the reader and the admin panel, and the service worker that makes them installable.
// Buttons with data-install show only when the browser offers installing; elements with data-ios-tip show on
// iPhone/iPad, where installing is done from the Share menu instead.
(function () {
  let offer = null;
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const buttons = () => document.querySelectorAll("[data-install]");
  addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    offer = e;
    if (!standalone) buttons().forEach(b => { b.hidden = false; });
  });
  addEventListener("appinstalled", () => { offer = null; buttons().forEach(b => { b.hidden = true; }); });
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-install]");
    if (!b || !offer) return;
    offer.prompt();
    await offer.userChoice.catch(() => {});
    offer = null;
    buttons().forEach(x => { x.hidden = true; });
  });
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone;
  const tips = () => document.querySelectorAll("[data-ios-tip]").forEach(t => { t.hidden = !ios; });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tips); else tips();
  if ("serviceWorker" in navigator) addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
})();
