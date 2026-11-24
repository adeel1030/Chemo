// Builds the study pages for Google: one page for each class (/class-10/) and one for each chapter
// (/class-10/chemical-reactions-and-equations/), from the live catalog that the admin panel saves.
// Also writes the chapter covers (assets/covers/), and sitemap.xml.
//
// Run:  node tools/build-pages.mjs            (reads the catalog from Firestore)
//       node tools/build-pages.mjs cat.json   (reads a saved copy of catalog/main)
// A GitHub Action runs it every night, so new chapters and changes in the admin panel reach Google on their own.
import vm from "vm";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://chemophile.maproductsindia.com";
const PROJECT = "chemophile-ec269";
const FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/catalog/`;
const today = new Date().toISOString().slice(0, 10);

// ---- the website's own chapter code (names, numbers, subjects), so the pages say exactly what the site says
const ctx = { console, localStorage: { getItem() { return null; }, setItem() {} }, document: { documentElement: { dataset: {} }, querySelector() { return null; }, getElementById() { return null; } } };
vm.createContext(ctx);
vm.runInContext(readFileSync(join(ROOT, "js/chapters.js"), "utf8") + `
;this.A = { applyCatalog, CHAPTERS: () => CHAPTERS, studyPaths, classSlug, clsName, kindOf, isPart, isUni, isJeeCls, KINDS, numIn, chNo, orderN, classList, SAMPLE_BOOKS: () => SAMPLE_BOOKS, BUSINESS };`, ctx);
const A = ctx.A;

async function getDoc(id) {
  const r = await fetch(FS + id);
  if (!r.ok) throw new Error(`catalog/${id}: ${r.status}`);
  const j = await r.json();
  return j.fields && j.fields.data ? JSON.parse(j.fields.data.stringValue) : null;
}
const file = process.argv[2];
const cat = file ? JSON.parse(JSON.parse(readFileSync(file, "utf8")).fields.data.stringValue) : await getDoc("main");
if (!cat || !A.applyCatalog(cat)) throw new Error("No catalog");
// Covers: saved as files so Google Images and WhatsApp previews can show them.
const covers = {};
if (!process.env.NO_COVERS) {
  for (let i = 0; i < Math.max(1, +cat.coverDocs || 1); i++) {
    try { Object.assign(covers, await getDoc(i ? `covers-${i + 1}` : "covers") || {}); } catch (e) { console.warn("covers", i, e.message); }
  }
}
// ---- build (js/study-build.js, the same code the admin panel's button uses), then write
const { buildStudy } = await import(new URL("../js/study-build.js", import.meta.url));
const res = buildStudy(A, cat, covers, p => existsSync(join(ROOT, p)), today);
const listFile = join(ROOT, "tools/study-pages.json");
const before = existsSync(listFile) ? JSON.parse(readFileSync(listFile, "utf8")) : [];
before.filter(p => !res.pages.includes(p)).forEach(p => { try { rmSync(join(ROOT, p, "index.html")); } catch (e) {} });
for (const f of res.files) { mkdirSync(dirname(join(ROOT, f.path)), { recursive: true }); writeFileSync(join(ROOT, f.path), f.text != null ? f.text : Buffer.from(f.b64, "base64")); }
writeFileSync(listFile, JSON.stringify(res.pages, null, 1) + "\n");
const n = res.counts;
console.log(`${res.pages.length} pages (${n.classes} class, ${n.chapters} chapter), ${n.covers} covers, sitemap with ${n.links} links.`);
