# Online reader chalu karne ke steps

Online reader do pages se chalta hai:

- `read.html`: students yahan login karke apne chapters padhte hain
- `admin.html`: Adeel Sir yahan chapters upload karte hain aur student IDs banate hain

Login aur pages ka data **Firebase** (Google ki free service) mein rehta hai. Neeche ke steps ek baar karne hain, laptop par karna aasaan rahega. Lagbhag 20 minute lagenge.

## 1. Firebase project banao

1. <https://console.firebase.google.com> kholo aur apne Google account se login karo.
2. **Create a project** dabao. Naam rakho, jaise `chemophile`. Google Analytics ki zaroorat nahi hai, use off kar sakte ho.
3. Free plan (**Spark**) kaafi hai. Card ya billing ki zaroorat nahi hai.

## 2. Web app jodo aur settings copy karo

1. Project ke home page par **`</>`** (Web) icon dabao.
2. App ka naam daalo, jaise `chemophile-web`. "Firebase Hosting" wala box tick mat karo. **Register app** dabao.
3. Ek code dikhega jismein `const firebaseConfig = { apiKey: ..., authDomain: ..., ... }` hoga.
4. Yeh values repo ki file `js/firebase-config.js` mein `firebaseConfig` ke andar daal do.

## 3. Email/Password login chalu karo

1. Left menu mein **Build → Authentication → Get started** dabao.
2. **Sign-in method** tab mein **Email/Password** chuno, **Enable** karo aur Save karo.

## 4. Apna admin account banao

1. **Authentication → Users → Add user** dabao.
2. Apni email aur ek strong password daalo. Isi se `admin.html` mein login karoge.
3. Yahi email `js/firebase-config.js` mein `ADMIN_EMAIL` ke aage daalo.

## 5. Database banao

1. **Build → Firestore Database → Create database** dabao.
2. Location mein **asia-south1 (Mumbai)** chuno. Yeh baad mein badal nahi sakti.
3. **Start in production mode** chuno.

## 6. Security rules lagao (sabse zaroori step)

1. Firestore Database mein **Rules** tab kholo.
2. Wahan jo likha hai, use hata kar repo ki `firestore.rules` file ka poora text paste karo.
3. `ADMIN_EMAIL_HERE` ki jagah apni admin email likho, wahi jo step 4 mein daali thi.
4. **Publish** dabao.

Yahi rules tay karte hain ki student sirf apne kharide hue chapters padh sake, sirf apne locked device par, aur koi bhi pages copy ya badal na sake.

## 7. Website live karo (GitHub Pages)

1. GitHub par is branch ko `main` mein merge karo.
2. Repo mein **Settings → Pages** kholo. **Deploy from a branch** chuno, branch `main` aur folder `/ (root)` rakho, phir Save karo.
3. Kuch minute baad site `https://adeel1030.github.io/Chemo/` par khulegi.
4. `js/firebase-config.js` mein `READER_URL` ke aage `https://adeel1030.github.io/Chemo/read.html` likho. Yeh link student ko jaane wale message mein aata hai.

## 8. Chapters upload karo

1. `https://adeel1030.github.io/Chemo/admin.html` kholo aur admin email-password se login karo.
2. **Chapters upload** tab kholo.
3. Har chapter ke saamne uski PDF chuno aur **Upload karo** dabao. Ek chapter mein 1–2 minute lagte hain. Upload khatam hone tak page band mat karna, aur Chrome use karna.

PDF ke har page ki image ban kar Firebase mein jaati hai. PDF file khud kahin save nahi hoti, aur students ko download ka koi option nahi milta.

## 9. Student ki ID banao (har order ke baad)

1. Payment milne ke baad **Students** tab kholo.
2. Naam, WhatsApp number, login ID aur password bharo (password apne aap ban jaata hai), aur kharide hue chapters tick karo.
3. **Student ID banao** dabao, phir **WhatsApp par bhejo** dabao. Student ko link, ID aur password chala jayega.

Students list mein har student ke liye yeh options hain:

- **Chapters badlo**: naye chapters jodo, jaise jab student aur chapters kharide.
- **Device reset**: student ne phone badla ho to. Reset ke baad jis device par woh pehle login karega, ID usi par lock ho jayegi.
- **Band karo**: ID turant band ho jaati hai. Jo bhi device us waqt khula hai, woh bhi logout ho jaata hai.
- **"N baar doosre device se try"**: matlab kisi ne yeh ID doosre phone par kholne ki koshish ki thi, yaani ID share hui hai.

## Yeh system kya rokta hai, kya nahi

**Kya rokta hai:**

- Ek ID ek hi device par chalti hai. Doosre phone par login karne par page nahi khulta, aur admin panel mein attempt dikh jaata hai.
- Koi PDF ya download nahi hai. Pages sirf login ke baad screen par dikhte hain, aur right-click ya long-press se save nahi hote.
- Har page par student ka naam, ID aur phone number halka sa likha hota hai (watermark). Agar kisi page ka screenshot ya photo group mein ghoomta hai, to pata chal jayega ki kiski copy hai.

**Kya nahi rok sakta:**

- Koi bhi website screenshot ya doosre phone se photo lena 100% nahi rok sakti. Isiliye watermark lagaya hai.
- Device ki pehchaan browser mein save hoti hai. Agar student browser ka data clear kare, ya usi phone par doosra browser use kare, to woh naya device gina jayega aur aapko **Device reset** karna padega.
- Koi bahut technical student (programmer jaisa) apne login se pages kisi doosre tareeke se nikal sakta hai. Aam students ke liye yeh system kaafi strong hai.

## Free limit

Free plan mein roz **50,000 reads** milte hain. Ek page kholne mein lagbhag 2 reads lagte hain, yaani roz lagbhag 25,000 page views free hain. Saare 9 chapters ke 651 pages lagbhag 150 MB jagah lenge, jabki free limit 1 GB hai. Students bahut badh jaayein to Firebase **Usage** tab mein dekh lena.
