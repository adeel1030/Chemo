// Firebase setup shared by read.html and admin.html.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, LOGIN_DOMAIN } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
// admin.html sets <html data-firebase-app="admin"> so the admin login is kept apart from the student login.
// Otherwise both pages share one session in the same browser and each logs the other out.
const appName = document.documentElement.dataset.firebaseApp;
export const app = configured ? (appName ? initializeApp(firebaseConfig, appName) : initializeApp(firebaseConfig)) : null;
export const auth = configured ? getAuth(app) : null;
export const db = configured ? getFirestore(app) : null;

export const ID_PATTERN = /^[a-z0-9][a-z0-9._-]{2,23}$/;
export const idToEmail = id => `${id.trim().toLowerCase()}@${LOGIN_DOMAIN}`;
export const emailToId = email => email.split("@")[0];

// Page documents are named like "11-1_007" (Class 11, Chapter 1, page 7).
export const pageId = (ch, n) => `${ch}_${String(n).padStart(3, "0")}`;

// A random ID kept in this browser. The first device a student logs in on is bound to their account.
export function deviceId() {
  const k = "chemophile-device";
  try {
    let id = localStorage.getItem(k);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
      localStorage.setItem(k, id);
    }
    return id;
  } catch (e) {
    return null;
  }
}

export function deviceInfo() {
  const ua = navigator.userAgent;
  const os = /Android/.test(ua) ? "Android" : /iPhone|iPad|iPod/.test(ua) ? "iPhone/iPad" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "Device";
  const br = /Edg\//.test(ua) ? "Edge" : /SamsungBrowser/.test(ua) ? "Samsung Internet" : /CriOS|Chrome\//.test(ua) ? "Chrome" : /Firefox|FxiOS/.test(ua) ? "Firefox" : /Safari/.test(ua) ? "Safari" : "Browser";
  return `${os} · ${br}`;
}

export const chapterKey = c => `${c.cls}-${c.n}`;
// CHAPTERS comes from js/chapters.js, a classic script, so it is a global binding rather than a window property.
export const findChapter = k => [...(typeof CHAPTERS !== "undefined" ? CHAPTERS : []), ...(typeof SOON_CHAPTERS !== "undefined" ? SOON_CHAPTERS : [])]
  .find(c => chapterKey(c) === k);
// The admin's catalog (books, chapters, prices) laid over js/chapters.js. Returns the raw catalog, or null.
export async function loadCatalog() {
  if (!db || typeof applyCatalog === "undefined") return null;
  try {
    const s = await getDoc(doc(db, "catalog", "main"));
    if (!s.exists()) return null;
    const cat = JSON.parse(s.data().data);
    return applyCatalog(cat) ? cat : null;
  } catch (e) { console.warn("catalog", e); return null; }
}
export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
