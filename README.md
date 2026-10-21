# Chemophile Part 1 (for 11th Class)

Website for **Chemophile**, a Hinglish visual booklet series for Class 11 and 12 Chemistry (NCERT / CBSE) by **Mohd Adeel Khan (Adeel Sir)**, MSc BEd (JMI).

The site (`index.html`) is a sales page for Class 11 and Class 12:

- Class 11 (Part 1): all 9 chapters are ready, with every topic, sub-topic, NCERT section number and page number from each booklet's "Is chapter mein kya hai" page
- chapters not written yet (as per the CBSE 2026-27 syllabus) show as "Coming soon", with a WhatsApp "Aate hi batana" link
- real cut-outs from the booklets, 5 free sample pages per chapter, and topic search
- Online and Paperback price for every chapter (paperback delivery extra)
- "Apna pack banao": the student picks a format and chapters, and the order goes to Adeel Sir on WhatsApp

`read.html` is the online reader: students log in with the ID and password Adeel Sir gives them, each ID locks to one device, and every page carries the student's name as a watermark. `admin.html` is where Adeel Sir uploads chapter PDFs and creates student IDs. Both run on Firebase; see `SETUP.md` (Hinglish) to switch them on.

## Updating the site

All settings are in `js/chapters.js`, shared by all three pages:

- `PRICES`: rupees per chapter for `online` and `paperback`. Every chapter in `CHAPTERS` needs an entry here.
- `UPCOMING`: chapters still coming. When one is ready, remove it from here, add it to `CHAPTERS` with its topics, add its `PRICES` entry, and put its sample pages in `assets/pages/` and `assets/thumbs/` as `ch<N>-<page>.webp`.
- `PHONE` and `WHATSAPP`: contact number.

Images: `assets/pages/` (sample pages, 1000 px), `assets/thumbs/` (360 px), `assets/feature/` (cut-outs used on the home page).

## View it

Open `index.html` in a browser, or publish with GitHub Pages: **Settings → Pages → Deploy from a branch**, then choose the branch and `/ (root)`.

© 2026 Mohd Adeel Khan. All rights reserved.
