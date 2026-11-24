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
;this.A = { applyCatalog, CHAPTERS: () => CHAPTERS, studyPaths, classSlug, clsName, kindOf, isPart, isUni, isJeeCls, KINDS, numIn, chNo, orderN, classList, SAMPLE_BOOKS, BUSINESS, bookPart, PART };`, ctx);
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
mkdirSync(join(ROOT, "assets/covers"), { recursive: true });
const coverPath = c => {
  const k = `${c.cls}-${c.n}`, d = covers[k];
  const m = typeof d === "string" && d.match(/^data:image\/(webp|jpeg|png);base64,(.+)$/);
  if (m) { const name = `assets/covers/${k}.${m[1] === "jpeg" ? "jpg" : m[1]}`; writeFileSync(join(ROOT, name), Buffer.from(m[2], "base64")); return name; }
  for (const ext of ["webp", "jpg", "png"]) if (existsSync(join(ROOT, `assets/covers/${k}.${ext}`))) return `assets/covers/${k}.${ext}`;
  return null;
};

// ---- helpers
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Text shown on the page: formulas keep their <sub>/<sup> (CuSO<sub>4</sub>); everything else is plain text.
const rich = s => esc(s).replace(/&lt;(\/?)(sub|sup)&gt;/g, "<$1$2>");
// Text in titles and descriptions: the tags dropped (CuSO4).
const plain = s => String(s ?? "").replace(/<\/?(sub|sup)>/g, "");
const clip = (s, n) => { s = String(s).replace(/\s+/g, " ").trim(); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…"; };
const json = o => JSON.stringify(o).replace(/</g, "\\u003c");
const paths = A.studyPaths();
const chapters = A.CHAPTERS().filter(c => !A.isPart(c)).sort((a, b) => a.cls - b.cls || A.orderN(a) - A.orderN(b));
const classes = A.classList().filter(k => chapters.some(c => c.cls === k));
const school = k => !A.isUni(k);
const subjectOf = c => { const k = A.kindOf(c); return k === "special" ? "Chemistry" : A.KINDS[k].subject; };
// What a chapter is called in search: "Class 10 Science Chapter 9", "Class 11 Physics Chapter 1", "Class 12 JEE/NEET special".
function label(c) {
  const k = A.kindOf(c), cn = A.clsName(c.cls), n = A.numIn(c);
  if (!school(c.cls)) return `${cn} ${A.KINDS[k].subject === "Chemistry" ? "Organic Chemistry" : A.KINDS[k].subject}`;
  if (k === "special") return A.isJeeCls(c.cls) ? `${cn} Chemistry, JEE/NEET special` : `${cn} Chemistry, bonus booklet`;
  if (c.cls <= 10) return `${cn} Science Chapter ${n}`;
  return `${cn} ${A.KINDS[k].subject} Chapter ${n}`;
}
const subtopics = s => String(s || "").split(" · ").map(t => t.replace(/\s+\d+$/, "").trim()).filter(Boolean);
const coverOf = new Map(chapters.map(c => [`${c.cls}-${c.n}`, coverPath(c)]));
const CLASS_COLOR = { 9: "#3d0c50", 10: "#0d4a45", 11: "#22215f", 12: "#5a1424" };
const color = cls => CLASS_COLOR[cls] || "#22215f";
const sampleOf = cls => (A.SAMPLE_BOOKS || {})[cls];

function shell({ title, desc, path, image, color: col, body, ld, cls }) {
  const url = SITE + "/" + path;
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Mohd Adeel Khan (Adeel Sir)">
<meta name="theme-color" content="${col}">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/logo/icon-32.png">
<link rel="apple-touch-icon" href="/assets/logo/apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Chemophile">
<meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/${image || "assets/logo/og.png"}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Fira+Sans:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/study.css">
<script type="application/ld+json">${json(ld)}</script>
</head>
<body style="--c: ${col}">
<header class="top"><div class="wrap">
  <a class="brand" href="/"><img src="/assets/logo/icon-96.png" alt="" width="36" height="36"><span>Chemophile<small>by Adeel Sir</small></span></a>
  <nav><a href="/${cls ? `?class=${cls}` : ""}#free-test">Free test</a><a href="/read.html#signup">Sign up free</a><a class="cta" href="/${cls ? `?class=${cls}` : ""}#pack">Order</a></nav>
</div></header>
${body}
<footer class="foot"><div class="wrap">
  <nav class="classes" aria-label="Study by class">${classes.map(k => `<a href="/${A.classSlug(k)}/">${esc(A.clsName(k))}</a>`).join("")}</nav>
  <p><b>Chemophile</b> · Hinglish booklets by Mohd Adeel Khan (Adeel Sir), MSc BEd (JMI) · WhatsApp <a href="https://wa.me/919953821875">9953821875</a></p>
  <p><a href="/">Home</a> · <a href="/policies.html#terms">Terms</a> · <a href="/policies.html#refund">Refund</a> · <a href="/policies.html#privacy">Privacy</a></p>
</div></footer>
</body>
</html>
`;
}
const crumbs = items => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + "/" + path })) });
const org = { "@type": "Organization", "@id": SITE + "/#org", name: "Chemophile", url: SITE + "/", logo: SITE + "/assets/logo/icon-512.png" };
const author = { "@type": "Person", name: "Mohd Adeel Khan", alternateName: "Adeel Sir", jobTitle: "Chemistry teacher", description: "MSc BEd (JMI)" };

// ---- chapter pages
const out = [];
for (const c of chapters) {
  const key = `${c.cls}-${c.n}`, path = paths.get(key), cs = A.classSlug(c.cls), cn = A.clsName(c.cls), lab = label(c), subj = subjectOf(c);
  const topics = (c.topics || []).map(t => Array.isArray(t) ? { name: t[0], sec: t[1], subs: subtopics(t[3]) } : { name: String(t), sec: "", subs: [] });
  const img = coverOf.get(key);
  const nums = [c.pages && `${c.pages} pages`, c.fig && `${c.fig} figures and diagrams`, c.solved && `${c.solved} solved examples`, c.practice && `${c.practice} practice questions`, c.qbank && `${c.qbank}-question bank with solutions`, c.qr].filter(Boolean);
  const title = `${plain(c.title)}: ${lab} Notes in Hinglish | Chemophile`;
  const uni = !school(c.cls);
  const desc = clip(`${c.title} (${lab}) in easy Hinglish by Adeel Sir: ${topics.length ? topics.length + (uni ? " topics, " : " NCERT section-wise topics, ") : ""}${c.solved ? c.solved + " solved examples, " : ""}${uni ? "clear diagrams and mechanisms." : "diagrams and board answers in English."}${c.tag ? " " + plain(c.tag) : ""}`, 158);
  const same = chapters.filter(x => x.cls === c.cls && subjectOf(x) === subj);
  const other = chapters.filter(x => x.cls === c.cls && subjectOf(x) !== subj);
  const body = `<main>
<section class="hero"><div class="wrap hero-in">
  <div>
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/${cs}/">${esc(cn)}</a> › <span>${esc(A.chNo(c))}</span></nav>
    <p class="eyebrow">${esc(lab)}</p>
    <h1>${esc(c.title)}</h1>
    ${c.tag ? `<p class="tag">${esc(c.tag)}</p>` : ""}
    <p class="lede">${uni ? "Notes in easy Hinglish by Adeel Sir: every idea explained step by step, with clear diagrams and worked examples." : `Notes in easy Hinglish by Adeel Sir: every topic starts with an everyday example, then a clear diagram, then the board answer in English. NCERT section-wise${A.isJeeCls(c.cls) ? ", with JEE/NEET extra boxes" : ""}.`}</p>
    ${nums.length ? `<ul class="nums">${nums.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    <div class="acts">
      <a class="btn sun" href="/?class=${c.cls}#ch${key}">Get this chapter</a>
      ${sampleOf(c.cls) ? `<a class="btn line" href="/${esc(sampleOf(c.cls).pdf)}">Free sample (PDF)</a>` : ""}
      <a class="btn line" href="/?class=${c.cls}#free-test">Free 5-question test</a>
    </div>
  </div>
  ${img ? `<img class="cover" src="/${img}" alt="Cover of Chemophile ${esc(cn)} ${esc(A.chNo(c))}: ${esc(c.title)}" width="360" height="509">` : ""}
</div></section>
<div class="wrap grid">
  <article>
    ${topics.length ? `<h2>What's inside: ${topics.length} topics</h2>
    <ol class="topics">${topics.map(t => `<li><h3>${rich(t.name)}${t.sec ? ` <small>${rich(t.sec)}</small>` : ""}</h3>${t.subs.length ? `<ul>${t.subs.map(s => `<li>${rich(s)}</li>`).join("")}</ul>` : ""}</li>`).join("")}</ol>` : `<h2>About this chapter</h2><p>${esc(c.title)} for ${esc(cn)}, explained in Hinglish with diagrams, solved examples and board answers in English.</p>`}
    ${(c.highlights || []).length ? `<h2>Also in this chapter</h2><ul class="hl">${c.highlights.map(h => `<li>${rich(h)}</li>`).join("")}</ul>` : ""}
    ${uni ? "" : `<h2>How every topic is taught</h2>
    <ul class="how"><li><b>Adeel Sir ka example:</b> the idea from something you see every day</li><li><b>A clear, labelled diagram</b> on every page</li><li><b>Exam mein aise likho:</b> the board answer in English, ready to learn</li><li><b>Galti mat karna:</b> the mistakes that cost marks</li><li><b>Ab tumhari baari:</b> questions to try yourself</li></ul>`}
    <p class="cta-line">Read it on your phone with the Chemophile app, or get the printed booklet. <a href="/?class=${c.cls}#ch${key}">See price and order →</a></p>
  </article>
  <aside>
    <h2>${esc(cn)} ${esc(subj)}</h2>
    <ul class="side">${same.map(x => `<li${x === c ? ' class="here"' : ""}><a href="/${paths.get(`${x.cls}-${x.n}`)}">${esc(A.chNo(x))}: ${esc(x.short || x.title)}</a></li>`).join("")}</ul>
    ${other.length ? `<p class="more"><a href="/${cs}/">All ${esc(cn)} chapters →</a></p>` : ""}
  </aside>
</div>
</main>`;
  const ld = { "@context": "https://schema.org", "@graph": [crumbs([["Home", ""], [cn, cs + "/"], [c.title, path]]), {
    "@type": "LearningResource", name: `${c.title} (${lab})`, description: desc, url: SITE + "/" + path, inLanguage: ["en-IN", "hi-IN"],
    educationalLevel: cn, learningResourceType: "Study notes", teaches: topics.map(t => plain(t.name)).slice(0, 20), about: subj,
    isPartOf: { "@type": "Book", name: (cat.books || []).find(b => +b.cls === c.cls)?.name || `Chemophile ${cn}` },
    image: img ? SITE + "/" + img : undefined, author, publisher: org, isAccessibleForFree: false } ] };
  out.push([path, shell({ title, desc, path, image: img, color: color(c.cls), body, ld, cls: c.cls })]);
}

// ---- class pages
for (const k of classes) {
  const cs = A.classSlug(k) + "/", cn = A.clsName(k), list = chapters.filter(c => c.cls === k);
  const subs = [...new Set(list.map(subjectOf))].sort((a, b) => ["Chemistry", "Physics", "Biology", "Maths"].indexOf(a) - ["Chemistry", "Physics", "Biology", "Maths"].indexOf(b));
  const solved = list.reduce((a, c) => a + (parseInt(c.solved, 10) || 0), 0), figs = list.reduce((a, c) => a + (parseInt(c.fig, 10) || 0), 0);
  const book = (cat.books || []).find(b => +b.cls === k), sample = sampleOf(k);
  const subjWords = subs.length > 1 ? subs.slice(0, -1).join(", ") + " and " + subs[subs.length - 1] : subs[0];
  const title = school(k) ? `${cn} ${k <= 10 ? "Science" : subjWords} Notes in Hinglish (NCERT, CBSE) | Chemophile by Adeel Sir` : `${cn} ${subjWords} in Hinglish | Chemophile by Adeel Sir`;
  const nch = `${list.length} chapter${list.length === 1 ? "" : "s"}`;
  const desc = clip(school(k) ? `${cn} ${subjWords} in easy Hinglish by Adeel Sir: ${nch}, NCERT section-wise${solved ? `, ${solved} solved examples` : ""}${figs ? `, ${figs} diagrams` : ""}, board answers in English. Free sample and free test.`
    : `${cn} ${subjWords} in easy Hinglish by Adeel Sir: ${nch}${figs ? `, ${figs} diagrams` : ""}${solved ? `, ${solved} solved examples` : ""}, explained step by step.`, 158);
  const faq = !school(k) ? [
    [`What is in the Chemophile ${cn} book?`, `${list.map(c => c.title).join(", ")}: explained in easy Hinglish, with clear diagrams and worked examples.`],
    [`How do I read it?`, `Sign up free on the website, then buy the chapters and read them in the Chemophile app on your phone or laptop.`]
  ] : [
    [`Is Chemophile ${cn} based on the NCERT syllabus?`, `Yes. Every chapter follows the NCERT section numbers${school(k) ? " and the CBSE 2026-27 syllabus" : ""}, so it is easy to match with your textbook.`],
    [`Which ${cn} subjects are there?`, `${subs.map(s => `${s}: ${list.filter(c => subjectOf(c) === s).length} chapter${list.filter(c => subjectOf(c) === s).length === 1 ? "" : "s"}`).join(". ")}.`],
    [`If I study in Hinglish, how will I write the exam in English?`, `The explanations are in Hinglish, and every topic has an "Exam mein aise likho" box with the full board answer in English.`],
    [`Can I read ${cn} free before buying?`, sample ? `Yes. The free ${cn} sample has one topic from each chapter, and there is a free 5-question test on the website.` : `Yes. Sign up free on the website and take the free 5-question test.`]
  ];
  const body = `<main>
<section class="hero"><div class="wrap hero-in solo">
  <div>
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <span>${esc(cn)}</span></nav>
    <p class="eyebrow">${esc(book ? book.name : "Chemophile " + cn)}</p>
    <h1>${esc(cn)} ${esc(school(k) && k <= 10 ? "Science" : subjWords)} in Hinglish</h1>
    <p class="tag">${school(k) ? `${esc(cn)}: ab ratna nahi, samajhna hai!` : "Organic chemistry, samajh ke!"}</p>
    <p class="lede">Chemophile booklets by Adeel Sir, a Chemistry specialist: every concept starts with an everyday example, then a diagram, then the exam-ready answer in English.</p>
    <ul class="nums"><li>${nch}</li>${figs ? `<li>${figs} figures and diagrams</li>` : ""}${solved ? `<li>${solved} solved examples</li>` : ""}${subs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
    <div class="acts">
      <a class="btn sun" href="/?class=${k}">Open ${esc(cn)} on the website</a>
      ${sample ? `<a class="btn line" href="/${esc(sample.pdf)}">Free sample (PDF)</a>` : ""}
      <a class="btn line" href="/?class=${k}#free-test">Free 5-question test</a>
    </div>
  </div>
</div></section>
<div class="wrap">
  ${subs.map(s => `<h2 class="subj">${esc(s)}</h2><div class="cards">${list.filter(c => subjectOf(c) === s).map(c => { const img = coverOf.get(`${c.cls}-${c.n}`);
    return `<a class="card" href="/${paths.get(`${c.cls}-${c.n}`)}">${img ? `<img src="/${img}" alt="" width="360" height="509" loading="lazy">` : `<span class="noimg">${esc(A.chNo(c))}</span>`}<span><small>${esc(A.chNo(c))}</small><b>${esc(c.title)}</b>${(c.topics || []).length ? `<em>${c.topics.length} topics</em>` : ""}</span></a>`; }).join("")}</div>`).join("")}
  <h2>Questions and answers</h2>
  <div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
</div>
</main>`;
  const ld = { "@context": "https://schema.org", "@graph": [crumbs([["Home", ""], [cn, cs]]), {
      "@type": "CollectionPage", name: `${cn} ${subjWords} in Hinglish`, description: desc, url: SITE + "/" + cs, inLanguage: ["en-IN", "hi-IN"], publisher: org,
      hasPart: list.map(c => ({ "@type": "LearningResource", name: c.title, url: SITE + "/" + paths.get(`${c.cls}-${c.n}`) })) },
    { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) } ] };
  out.push([cs, shell({ title, desc, path: cs, color: color(k), body, ld, cls: k })]);
}

// ---- write, and remove pages of chapters that are gone
const listFile = join(ROOT, "tools/study-pages.json");
const before = existsSync(listFile) ? JSON.parse(readFileSync(listFile, "utf8")) : [];
const now = out.map(([p]) => p);
before.filter(p => !now.includes(p)).forEach(p => { try { rmSync(join(ROOT, p, "index.html")); } catch (e) {} });
for (const [p, html] of out) { mkdirSync(join(ROOT, p), { recursive: true }); writeFileSync(join(ROOT, p, "index.html"), html); }
writeFileSync(listFile, JSON.stringify(now, null, 1) + "\n");

// ---- sitemap
const urls = [["", "weekly", "1.0"], ...classes.map(k => [A.classSlug(k) + "/", "weekly", "0.9"]), ...chapters.map(c => [paths.get(`${c.cls}-${c.n}`), "monthly", "0.8"]),
  ...Object.values(A.SAMPLE_BOOKS || {}).map(b => [b.pdf, "monthly", "0.6"]), ["policies.html", "yearly", "0.3"]];
writeFileSync(join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, f, p]) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod><changefreq>${f}</changefreq><priority>${p}</priority></url>`).join("\n")}
</urlset>
`);
console.log(`${out.length} pages (${classes.length} class, ${chapters.length} chapter), ${Object.keys(covers).length} covers, sitemap with ${urls.length} links.`);
