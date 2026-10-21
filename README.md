# Chemophile Part 1 (for 11th Class)

Website for **Chemophile**, a Hinglish visual booklet series for Class 11 and 12 Chemistry (NCERT / CBSE) by **Mohd Adeel Khan (Adeel Sir)**, MSc BEd (JMI).

The site (`index.html`) is a sales page for Class 11 and Class 12:

- Class 11 (Part 1): all 9 chapters are ready, with every topic, sub-topic, NCERT section number and page number from each booklet's "Is chapter mein kya hai" page
- chapters not written yet (as per the CBSE 2026-27 syllabus) show as "Coming soon", with a WhatsApp "Aate hi batana" link
- real cut-outs from the booklets, 5 free sample pages per chapter, and topic search
- PDF and Paperback price for every chapter
- "Apna pack banao": the student picks a format and chapters, and the order goes to Adeel Sir on WhatsApp

## Updating the site

All settings are at the top of the `<script>` in `index.html`:

- `PRICES`: rupees per chapter for `pdf` and `paperback`. `null` shows "price jaldi".
- `UPCOMING`: chapters still coming. When one is ready, remove it from here, add it to `CHAPTERS` with its topics, add a `PRICES` entry, and put its pages in `assets/pages/` and `assets/thumbs/` as `ch<N>-<page>.webp`.
- `PHONE` and `WHATSAPP`: contact number.

Images: `assets/pages/` (sample pages, 1000 px), `assets/thumbs/` (360 px), `assets/feature/` (cut-outs used on the home page).

## View it

Open `index.html` in a browser, or publish with GitHub Pages: **Settings → Pages → Deploy from a branch**, then choose the branch and `/ (root)`.

© 2026 Mohd Adeel Khan. All rights reserved.
