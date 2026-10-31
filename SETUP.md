# Online reader chalu karne ke steps

Online reader do pages se chalta hai:

- `read.html`: students yahan login ID ya promo code se apne chapters book ki tarah (page palat kar) padhte hain
- `admin.html`: Adeel Sir yahan chapters upload karte hain, student IDs aur promo codes banate hain

Free sample PDFs (`samples/` folder) ke liye Firebase ki zaroorat nahi. Woh website par seedha download aur flipbook mein padhne ke liye hain.

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
3. Wapas **Sign-in method** tab mein **Add new provider → Anonymous** chuno, **Enable** karo aur Save karo. Promo code isi se chalta hai: code daalne wale ko ID-password nahi banana padta.

## 4. Apna admin account banao

1. **Authentication → Users → Add user** dabao.
2. Apni email aur ek strong password daalo. Isi se `admin.html` mein login karoge.
3. Yahi email `js/firebase-config.js` mein `ADMIN_EMAIL` ke aage daalo.

## 5. Database banao

1. **Build → Firestore Database → Create database** dabao.
2. Edition poochhe to **Standard** chuno. Location mein **asia-south1 (Mumbai)** chuno. Yeh baad mein badal nahi sakti.
3. **Start in production mode** chuno.

## 6. Security rules lagao (sabse zaroori step)

1. Firestore Database mein **Rules** tab kholo.
2. Wahan jo likha hai, use hata kar repo ki `firestore.rules` file ka poora text paste karo.
3. `ADMIN_EMAIL_HERE` ki jagah apni admin email likho, wahi jo step 4 mein daali thi.
4. **Publish** dabao.

Yahi rules tay karte hain ki student sirf apne kharide hue chapters padh sake, sirf apne locked device par, aur koi bhi pages copy ya badal na sake.

## 7. Website live karo (GitHub Pages)

1. GitHub par `adeel1030/Chemo` repo kholo aur **Settings → Pages** mein jao.
2. **Source** mein **Deploy from a branch** chuno. Branch mein `ccr-6ada8f89-5gh1t1` (abhi website ka saara code isi branch par hai) aur folder `/ (root)` chuno, phir **Save** dabao.
3. **Custom domain** mein `chemophile.maproductsindia.com` likho, Save dabao, aur certificate banne ke baad **Enforce HTTPS** tick karo.
4. Domain ki DNS settings (jahan `maproductsindia.com` liya hai) mein ek **CNAME** record banao: Name `chemophile`, Value `adeel1030.github.io`.
5. Kuch minute baad site `https://chemophile.maproductsindia.com/` par khulegi.
6. Firebase console mein **Authentication → Settings → Authorized domains → Add domain** mein `chemophile.maproductsindia.com` jodo.
7. `js/firebase-config.js` mein `READER_URL` ke aage `https://chemophile.maproductsindia.com/read.html` likho (yeh pehle se likha hai). Yeh link student ko jaane wale message mein aata hai.

## 8. Chapters upload karo

1. `https://chemophile.maproductsindia.com/admin.html` kholo aur admin email-password se login karo.
2. **Chapters upload** tab kholo.
3. Class 11 aur Class 12 ke har chapter ke saamne uski PDF chuno aur **Upload karo** dabao. Ek chapter mein 1–2 minute lagte hain. Upload khatam hone tak page band mat karna, aur Chrome use karna.

Upload hone ke baad chapter **Uploaded and locked** dikhta hai, taaki galti se dobara upload na ho. Badalna ho to **Unlock to replace** dabao, warning padh kar **Yes, unlock** dabao, nayi PDF chuno aur **Upload replacement** dabao. Nayi file purane saare pages ki jagah le leti hai.

PDF ke har page ki image ban kar Firebase mein jaati hai. PDF file khud kahin save nahi hoti, aur students ko download ka koi option nahi milta.

## 9. Student ki ID banao (har order ke baad)

Admin email-password se `read.html` par bhi login ho sakta hai: wahan saare chapters dikhte hain, kisi bhi number ke devices par, bina device lock aur bina aakhri date ke. Admin panel bhi kitne bhi devices par ek saath khul sakta hai.

1. Payment milne ke baad **Students** tab kholo.
2. Naam, WhatsApp number, login ID, password (apne aap ban jaata hai) aur **Access until** (aakhri date, pehle se ek saal aage bhari hoti hai; khaali chhodo to koi aakhri date nahi) bharo, aur kharide hue chapters tick karo.
3. **Student ID banao** dabao, phir **WhatsApp par bhejo** dabao. Student ko link, ID aur password chala jayega.

Password admin ke liye Firebase mein save rehta hai (sirf admin dekh sakta hai). Student khud password badle to woh bhi wahan update ho jaata hai.

Students list mein har student ke liye yeh options hain:

- **Send on WhatsApp again**: student ko link, login ID, password aur chapters dobara bhejta hai. Chapters badalne ke baad bhi isse naya message bhej sakte ho.
- Password sirf student khud badal sakta hai: reader mein login karke neeche **Change password** se. Badla hua password aapke **Send on WhatsApp again** wale message mein apne aap aa jaata hai.
- **Chapters & date**: naye chapters jodo, ya **Access until** (aakhri date) badlo. Date nikalne ke baad ID band ho jaati hai aur student ko "Your access has ended" dikhta hai. Aisi ID par button **Renew** ban jaata hai; dabane par date apne aap ek saal aage ho jaati hai, Save karo.
- **Device reset**: student ne phone badla ho to. Reset ke baad jis device par woh pehle login karega, ID usi par lock ho jayegi.
- **Band karo**: ID turant band ho jaati hai. Jo bhi device us waqt khula hai, woh bhi logout ho jaata hai.
- **Delete**: student ko hamesha ke liye hata deta hai. Pehle ek warning aati hai, **Yes, delete** dabane par hi delete hota hai. Uski book har device par turant band ho jaati hai. Woh login ID dobara kisi ko nahi di ja sakti, isliye wapas aaye to nayi ID banani padegi. Kuch din ke liye rokna ho to **Band karo** (Block) use karo.
- **"N baar doosre device se try"**: matlab kisi ne yeh ID doosre phone par kholne ki koshish ki thi, yaani ID share hui hai.

## 10. Promo code (teachers, schools ya demo ke liye)

1. Admin panel mein **Promo codes** tab kholo.
2. Code ka naam (jaise `DPS2026`), kiske liye hai (jaise "DPS School teachers", yeh WhatsApp message mein "Special offer for DPS School teachers" ban kar jaata hai), kitne log use kar sakte hain, aakhri date aur chapters chuno.
3. **Promo code banao** dabao, phir **WhatsApp par bhejo** se code teachers ko bhej do.
4. Teacher website par **Login → Promo code** mein code, apna naam aur number daalta hai. Book usi phone par khul jaati hai. Har page par uska naam aur number watermark mein hota hai, aur download ka koi option nahi hota.

Dhyan rakhne wali baatein:

- Limit poori hote hi, ya aakhri date nikalte hi, code apne aap band ho jaata hai. Code kisi WhatsApp group mein leak bhi ho jaye, to limit se zyada log nahi khol paayenge.
- Code se khuli book bhi usi aakhri date tak chalti hai. Uske baad page nahi khulte.
- **Kisne use kiya** dabakar dekh sakte ho ki kis naam aur number ne code lagaya.
- Kisi ek promo user ko rokna ho to **Students** tab mein uske naam par **Band karo** dabao. Poora code rokna ho to **Promo codes** tab mein **Band karo** dabao.
- Code hamesha ke liye hatana ho to **Delete** dabao. Warning mein ek tick ka option aata hai: tick karoge to jin logon ne yeh code lagaya hai unki book bhi turant band ho jayegi. Tick nahi karoge to woh aakhri date tak padhte rahenge. Code ki "Kisne use kiya" list bhi delete ho jaati hai.
- Promo wali book sirf usi phone ke usi browser mein rehti hai. Agar user browser ka data clear kar de, to use dobara code lagana padega, aur isse code ka ek use aur gina jayega.

## 11. Announcements (sabko ek message)

1. Admin panel mein **Announcements** (phone par **News**) kholo.
2. Heading (chaho to), message, **Who sees it** (sab, sirf ID wale students, ya sirf promo users), **Which class** aur chaho to aakhri date chuno.
3. **Post announcement** dabao. Students ko reader kholte hi library ke upar yeh message dikhega. Message mein link ho to woh click ho jaata hai.
4. Student × dabakar message apne phone se hata sakta hai. Aap **Switch off** se sabse hata sakte ho, ya **Delete** kar sakte ho.

## 12. Books & prices (website par kya bikta hai)

Admin panel mein **Books & prices** (phone par **Prices**) kholo. Pehli baar wahan website ki abhi wali list aur prices bhari milengi; check karke ek baar **Save changes** dabao. Uske baad website isi page se chalti hai.

- **Ways to buy:** Online book, Paperback (colour), Paperback (B/W). Jo tick hoga wahi website par bikega; naam aur chhota note bhi badal sakte ho. Online aur paperback dono chalu hon to "Online + Paperback" ka option apne aap aata hai.
- **Offer banner:** website ke sabse upar ek patti, jaise "Diwali offer…", chaho to aakhri date ke saath.
- **Classes, books aur chapters:** har class ki book ka naam, har chapter ka naam, pages, aur **Live** ya **Coming soon**. Naya class/book (jaise Class 10) aur naye chapter bhi jod sakte ho. Naye chapter ke topics bhi likh sakte ho (har line: naam | page).
- **Price aur MRP:** har format ki price. MRP zyada likhoge to website par MRP kati hui aur "% off" dikhega. Jis format mein chapter nahi bechna, uski price khaali chhod do.
- **Combos:** chapters ka set ek special price par (jaise "Class 11 full book"). Website par alag "Combos" hissa banta hai, har format ka WhatsApp order button ke saath.

Har badlaav ke baad neeche **Save changes** dabana zaroori hai; **Undo all** se bina save kiye badlaav hat jaate hain. Naye chapter ki PDF **Chapters** page se upload karo, aur students ko woh chapter **Chapters & date** se do.

## 13. Monthly plan (har mahine payment)

1. **Books & prices** mein **Monthly (online)** tick karo. **Days paid for** mein 30 (ya jitne din) likho, **Same price for all** mein jaise 25 likh kar **Fill every chapter** dabao, phir **Save changes**. Website par har chapter ke saath "₹25 / 30 days" dikhega aur order form mein Monthly ka option aayega.
2. Payment milne par **Students → New student ID** mein **How they pay: Monthly plan** chuno. **Paid till** apne aap aaj se 30 din aage bhar jaata hai. Chapters tick karke ID banao.
3. Har mahine payment aane par student ke card par **Renew +30 days** dabao. Date wahan se 30 din aage badhti hai (ya aaj se, agar plan khatam ho chuka tha). Saath mein "Tell … on WhatsApp" link aata hai.
4. Plan khatam hone se 3 din pehle aur khatam hone ke baad **Overview** par naam dikhta hai, **Remind** dabakar WhatsApp par payment reminder bhej do. Student ke card par bhi **Payment reminder** button hai.
5. Date nikalte hi woh chapters lock ho jaate hain (Firebase rules bhi rokte hain). Student ko "Your monthly plan has ended" aur **Renew on WhatsApp** dikhta hai. Renew karte hi turant khul jaate hain; padhai ki jagah yaad rehti hai.
6. Ek hi student ke paas khareede hue aur monthly dono chapters ho sakte hain: **Chapters & date** mein dono list alag hain.

## 14. Policies, reading record, device reset limit

- **Policies:** `policies.html` par Terms, Online book rules, Refund & cancellation, Shipping, Privacy, Copyright aur Contact hain. Website aur reader ke footer mein inke links hain. Naam, email, "supported by" aur office address `js/chapters.js` ke `BUSINESS` mein hain; `address` khaali hai to woh line nahi dikhti.
- **Reading record:** student jab book padhta hai to har chapter ka record save hota hai: kitne pages padhe, kahan tak pahuncha, kitna time (sirf jab book khuli ho aur page palat rahe hon), kitni baar khola, aakhri baar kab. Student ko library mein **My reading** dikhta hai; admin ko student ke card par **Reading** dabane par, aur "Last read …" pill. 7 din se na padhne wale **Not reading 7+ days** filter aur Overview mein dikhte hain.
- **Device reset:** saal mein 2 free. Card par "Resets this year: 1/2" dikhta hai; 2 ke baad reset karne par warning aati hai, **Reset anyway** se phir bhi kar sakte ho (exceptional case).

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

Free plan mein roz **50,000 reads** milte hain. Ek page kholne mein lagbhag 2 reads lagte hain, yaani roz lagbhag 25,000 page views free hain. Class 11 aur 12 ke saare 19 chapters ke 1226 pages lagbhag 280 MB jagah lenge, jabki free limit 1 GB hai. Students bahut badh jaayein to Firebase **Usage** tab mein dekh lena.
