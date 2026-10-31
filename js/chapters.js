// Shared by the sales page (index.html), the online reader (read.html) and the admin panel (admin.html).
// ===== Settings Adeel Sir can change =====
const PHONE = "9953821875";
const WHATSAPP = "919953821875";
// Shown on the policies page and in footers. Leave address empty to hide that line.
const BUSINESS = {
  owner: "Mohd Adeel Khan",
  supportedBy: "M A Products India and Olife Gold Olive Oil",
  email: "chemhabibs@gmail.com",
  address: "M A Products India, 1310B, Near Bada Chaman Wada, Tilak Bazar, Delhi 110006",
  freeResetsPerYear: 2
};
// Default price of each chapter in rupees. Key = "class-chapter", e.g. "11-1" is Class 11 Chapter 1.
// Paperback delivery charges are extra. The admin panel (Prices page) can change all of this; its catalog wins.
const PRICES = {
  "11-1": { online: 205, colour: 492, bw: null },
  "11-2": { online: 203, colour: 486, bw: null },
  "11-3": { online: 145, colour: 348, bw: null },
  "11-4": { online: 155, colour: 372, bw: null },
  "11-5": { online: 170, colour: 408, bw: null },
  "11-6": { online: 183, colour: 438, bw: null },
  "11-7": { online: 130, colour: 312, bw: null },
  "11-8": { online: 220, colour: 528, bw: null },
  "11-9": { online: 218, colour: 522, bw: null },
  "12-1": { online: 165, colour: 396, bw: null },
  "12-2": { online: 148, colour: 354, bw: null },
  "12-3": { online: 133, colour: 318, bw: null },
  "12-4": { online: 145, colour: 348, bw: null },
  "12-5": { online: 138, colour: 330, bw: null },
  "12-6": { online: 150, colour: 360, bw: null },
  "12-7": { online: 138, colour: 330, bw: null },
  "12-8": { online: 160, colour: 384, bw: null },
  "12-9": { online: 130, colour: 312, bw: null },
  "12-10": { online: 133, colour: 318, bw: null }
};
// MRP (the crossed-out price) of each chapter, same keys. Empty until the admin sets one.
const MRP = {};
const priceOf = (c, format) => { const v = (PRICES[`${c.cls}-${c.n}`] || {})[format]; return v > 0 ? v : null; };
const mrpOf = (c, format) => { const v = (MRP[`${c.cls}-${c.n}`] || {})[format], p = priceOf(c, format); return v > 0 && p && v > p ? v : null; };
// Ways to buy. "on" decides whether the website offers it.
const FORMATS = {
  online: { on: true, label: "Online book", note: "Log in and read on your phone", days: 365 },
  monthly: { on: false, label: "Monthly (online)", note: "Read online, pay every month", days: 30 },
  colour: { on: true, label: "Paperback (colour)", note: "Printed in colour, delivery extra" },
  bw: { on: false, label: "Paperback (B/W)", note: "Black and white print, delivery extra" }
};
const FORMAT_IDS = ["online", "monthly", "colour", "bw"];
// "Monthly" is a subscription: its price is for this many days of online reading.
const monthDays = () => +(FORMATS.monthly && FORMATS.monthly.days) || 30;
// A bought online book opens for this many days from the day the ID is made.
const onlineDays = () => +(FORMATS.online && FORMATS.online.days) || 365;
const COMBOS = [];       // { id, name, text, chapters: [keys], price: { online, colour, bw }, mrp: {...}, on }
let OFFER = null;        // { on, text, until: "YYYY-MM-DD" }: a banner on top of the website
const SOON_CHAPTERS = []; // chapters set to "Coming soon" in the catalog, in the same shape as CHAPTERS
let REFERRAL = { on: false, days: 30 }; // "refer a friend": a student whose code a new buyer gives gets this many days free
// How to pay, shown on the order form: UPI ID, the name shown while paying, and an optional card/net banking link.
// The admin panel (Books & prices → Payment) can change it.
const DEFAULT_PAY = { upi: "9953821875@ptaxis", payee: "Mohd Adeel Khan", link: "" };
let PAY = DEFAULT_PAY;
// What a class is called. School classes are numbered 1 to 12 ("Class 11"). A university or college book gets
// a number above 100 and its own label from the catalog, e.g. "B.Sc 1st Year".
const CLASS_LABEL = {};
const isUni = cls => +cls > 100;
const clsName = cls => CLASS_LABEL[cls] || (isUni(cls) ? "University book" : `Class ${cls}`);

// Chapters still being written. Each shows as "Coming soon" with { cls, n, title, tag, f } (f = formula drawn on its cover).
const UPCOMING = [];
const PART = { 11: "Part 1 (for 11th Class)", 12: "Part 2 (for 12th Class)" };

// Available chapters (all Class 11 for now). Topic sub-lists are "name page · name page", as on each booklet's contents page.
const CHAPTERS = [
  { n: 1, title: "Some Basic Concepts of Chemistry", tag: "Ek chammach cheeni mein kitne molecules? Hinglish mein seekho",
    pages: 82, fig: 41, solved: 94, practice: "90+", qr: "5 QR simulations",
    topics: [
      ["Chemistry aur matter", "Section 1.1, 1.2", 4, "Chemistry kyun zaroori hai 5 · Matter ki teen states 6 · Mixture, element aur compound 7 · Practice: pehchaano aur classify karo 8"],
      ["Properties aur measurement", "Section 1.3", 10, "Physical/chemical properties aur SI units 11 · SI prefixes + Exercises 1.14, 1.15 12 · Mass, weight aur volume 13 · Density aur temperature 14 · Practice: units + Exercise 1.13 15"],
      ["Uncertainty in measurement", "Section 1.4", 17, "Scientific notation + Exercise 1.18 18 · Precision aur accuracy 19 · Significant figures + Exercises 1.16, 1.19 20 · Calculations aur rounding + Exercises 1.20, 1.31 21 · Dimensional analysis + Exercises 1.21(b), 1.22, 1.27 22"],
      ["Laws of chemical combination", "Section 1.5", 24, "Conservation of mass aur definite proportions 25 · Multiple proportions + Exercise 1.21(a) 26 · Gay Lussac aur Avogadro + Exercise 1.26 27 · Practice: laws ke numericals 28"],
      ["Dalton theory aur atomic masses", "Section 1.6, 1.7", 30, "Dalton's atomic theory 31 · Atomic mass aur amu 32 · Average atomic mass + Exercises 1.9, 1.32 33 · Molecular mass, formula mass + Problem 1.1, Exercise 1.1 34 · Practice: masses ke numericals 35"],
      ["Mole concept", "Section 1.8", 37, "Mole aur Avogadro constant 38 · Molar mass aur mole ka bridge 39 · Mole ke numericals + Exercise 1.30 40 · Exercises 1.10, 1.28, 1.33 41 · Practice: mole bridge 42"],
      ["Percentage composition aur formulas", "Section 1.9", 44, "Mass percent + Exercise 1.2 45 · Empirical aur molecular formula 46 · Problem 1.2 + Exercises 1.3, 1.8 47 · Combustion data se formula + Exercise 1.34 48 · Practice + Exercise 1.7 49"],
      ["Stoichiometry", "Section 1.10", 51, "Balanced equation ka matlab 52 · Equation balance karna 53 · Mass-mass calculations + Problems 1.3, 1.4 54 · Exercises 1.4(i), 1.36 + mass-volume 55 · Practice: stoichiometry 56"],
      ["Limiting reagent", "Section 1.10.1", 58, "Limiting reagent kya hai + Exercise 1.23 59 · NCERT Problem 1.5 60 · Exercises 1.4(ii), (iii) aur 1.24 61 · Practice: limiting reagent 62"],
      ["Reactions in solutions", "Section 1.10.2", 64, "Solution aur concentration ke 4 tareeke 65 · Mass per cent aur ppm 66 · Mole fraction 67 · Molarity (Problem 1.7, Exercise 1.5) 68 · Dilution aur Exercises 1.12, 1.25 69 · Molality (Problem 1.8) + temperature effect 70 · Exercises 1.6, 1.11, 1.29, 1.35 71 · Practice: solutions 72"],
      ["Revision", "Complete chapter", 74, "Mole map: ek nazar mein 75 · Formula sheet + rules 76 · Fact sheet: poora chapter ek page par 77 · Top 12 mistakes + exam ke favourite questions 78 · Final test, Part A: 16 MCQs 79 · Final test, Part B aur C + scorecard 80 · Answer key + tumhara certificate 81"]
    ] },
  { n: 2, title: "Structure of Atom", tag: "Atom ki complete story: Hinglish mein, visuals ke saath",
    pages: 81, fig: 88, solved: 27, practice: "130+", qr: "5 QR simulations",
    topics: [
      ["Atom ke andar kya hai?", "Section 2.1", 4, "Kya atom sach mein indivisible hai? 5 · Cathode rays: electron ki discovery 6 · Thomson ne e/m measure kiya 7 · Oil drop experiment: electron ka charge 8 · Proton aur neutron 9 · Ek nazar mein + quick check 10"],
      ["Thomson se Rutherford tak", "Section 2.2", 11, "Thomson ka watermelon model 12 · Gold foil experiment: setup 13 · Observations aur conclusions 14 · Atom kitna empty hai? 15 · Rutherford ka nuclear model 16 · Atom ki ID: Z aur A 17 · Isotopes aur isobars 18 · Rutherford model ke drawbacks 19 · Ek nazar mein + quick check 20"],
      ["Light ka double role", "Section 2.3.1, 2.3.2", 21, "Light ek wave hai 22 · Wavelength, frequency aur speed 23 · Electromagnetic spectrum 24 · c = νλ ke numericals 25 · Black-body radiation 26 · Planck ka quantum: energy ke packets 27 · Photoelectric effect: observations 28 · Einstein ka explanation: photon 29 · Photon ke numericals 30 · Dual behaviour + quick check 31"],
      ["Atom ka fingerprint", "Section 2.3.3", 32, "White light aur continuous spectrum 33 · Emission aur absorption spectra 34 · Har element ka apna fingerprint 35 · Hydrogen ka spectrum: 5 series 36 · Rydberg formula ke numericals 37 · Ek nazar mein + quick check 38"],
      ["Bohr model", "Section 2.4", 39, "Bohr ke 4 postulates 40 · Orbit ka radius aur energy 41 · Hydrogen jaise ions: He<sup>+</sup>, Li<sup>2+</sup> 42 · Hydrogen line spectrum ka explanation 43 · Transition ke numericals 44 · Bohr model ki limitations 45 · Ek nazar mein + quick check 46"],
      ["Quantum ki taraf", "Section 2.5", 47, "de Broglie: electron bhi wave hai 48 · de Broglie ke numericals 49 · Heisenberg ka uncertainty principle 50 · Uncertainty numericals; Bohr model kyun fail hua 51 · Ek nazar mein + quick check 52"],
      ["Orbitals aur quantum numbers", "Section 2.6.1, 2.6.2", 53, "Quantum mechanics: path nahi, probability 54 · Orbit aur orbital mein difference 55 · Electron ka address: n aur l 56 · Room aur bed: m<sub>l</sub> aur m<sub>s</sub> 57 · Quantum numbers ki practice 58 · s orbitals: spherical 59 · p orbitals: dumbbell 60 · d orbitals: cloverleaf 61 · Nodes ka hisaab 62 · Ek nazar mein + quick check 63"],
      ["Electron filling", "Section 2.6.3 to 2.6.6", 64, "Orbitals ki energy: hydrogen vs multi-electron atoms 65 · Shielding aur effective nuclear charge 66 · (n + l) rule aur Aufbau principle 67 · Pauli aur Hund: filling ke rules 68 · Configuration likhna: H se Ar tak 69 · K se Zn tak; Cr aur Cu ka twist 70 · Configuration ki practice 71 · Ek nazar mein + quick check 72"],
      ["Revision", "Complete chapter", 73, "Paanch models, ek table mein 74 · Formula sheet aur constants 75 · Kisne kya kiya 76 · Top 12 mistakes + exam ke favourite questions 77 · Final test, Part A: 16 MCQs 78 · Final test, Part B aur C + scorecard 79 · Answer key + tumhara certificate 80"]
    ] },
  { n: 3, title: "Classification of Elements and Periodicity in Properties", short: "Classification of Elements", tag: "Periodic table ki complete story: Hinglish mein, visuals ke saath",
    pages: 58, fig: 39, solved: 15, practice: "100+", qr: "2 QR links",
    topics: [
      ["Classify kyun? Early attempts", "Section 3.1, 3.2", 4, "Classify kyun karna pada? 5 · Dobereiner ke triads aur Chancourtois 6 · Newlands ka law of octaves; Lothar Meyer 7 · Ek nazar mein + quick check 8"],
      ["Mendeleev ki periodic table", "Section 3.2", 9, "Mendeleev ka periodic law 10 · Gaps aur predictions 11 · Merits aur limitations 12 · Ek nazar mein + quick check 13"],
      ["Modern periodic table", "Section 3.3, 3.4", 14, "Moseley aur modern periodic law 15 · Long form periodic table 16 · Periods aur groups 17 · 100 se upar wale elements ke naam 18 · Ek nazar mein + quick check 19"],
      ["Configuration aur s, p, d, f blocks", "Section 3.5, 3.6", 20, "Configuration se period aur group 21 · s, p, d aur f blocks 22 · Z se period, group aur block nikaalo 23 · Metals, non-metals aur metalloids 24 · Ek nazar mein + quick check 25"],
      ["Atomic aur ionic radius", "Section 3.7.1 (a, b)", 26, "Radius kaise measure karte hain? 27 · Period aur group mein radius 28 · Cation aur anion ka size 29 · Isoelectronic species 30 · Ek nazar mein + quick check 31"],
      ["Ionization enthalpy", "Section 3.7.1 (c)", 32, "Definition aur successive ionization 33 · Δ<sub>i</sub>H ka graph: peaks aur minima 34 · Period aur group mein trend; affecting factors 35 · Be > B aur N > O: do irregularities 36 · Ek nazar mein + quick check 37"],
      ["Electron gain enthalpy aur electronegativity", "Section 3.7.1 (d, e)", 38, "Electron gain enthalpy: definition aur sign 39 · Δ<sub>eg</sub>H trend; Cl kyun F se aage 40 · Electronegativity 41 · Teeno mein difference + trends ka map 42 · Ek nazar mein + quick check 43"],
      ["Chemical properties ke trends", "Section 3.7.2, 3.7.3", 44, "Valence ka periodic trend 45 · Formula predict karo; oxidation state 46 · Second period ka anomalous behaviour; diagonal relationship 47 · Reactivity aur oxides ka nature 48 · Ek nazar mein + quick check 49"],
      ["Revision", "Complete chapter", 50, "Saare trends ek table mein 51 · Fact sheet: poora chapter ek page par 52 · Kisne kya kiya + element riddles 53 · Top 12 mistakes + exam ke favourite questions 54 · Final test, Part A: 16 MCQs 55 · Final test, Part B aur C + scorecard 56 · Answer key + tumhara certificate 57"]
    ] },
  { n: 4, title: "Chemical Bonding and Molecular Structure", short: "Chemical Bonding", tag: "Atoms dosti kyun karte hain? Hinglish mein, 3D visuals ke saath",
    pages: 62, fig: 55, solved: 16, practice: "110+", qr: "2 QR simulations",
    topics: [
      ["Bond kyun banta hai? Lewis approach", "Section 4.1", 4, "Kössel-Lewis approach aur Lewis symbols 5 · Covalent bond: electrons ki sharing 6 · Lewis structure banane ke steps 7 · Formal charge 8 · Octet rule ki limitations 9 · Ek nazar mein + quick check 10"],
      ["Ionic bond aur lattice enthalpy", "Section 4.2", 11, "Ionic bond kaise banta hai 12 · Ionic bond kab banta hai: energy ka hisaab 13 · Lattice enthalpy aur NaCl crystal 14 · Ek nazar mein + quick check 15"],
      ["Bond parameters aur resonance", "Section 4.3.1 to 4.3.5", 16, "Bond length, covalent aur van der Waals radius 17 · Bond angle aur bond enthalpy 18 · Bond order aur uska relation 19 · Resonance: O<sub>3</sub> ka case 20 · CO<sub>3</sub><sup>2−</sup> aur CO<sub>2</sub> ki resonance 21 · Ek nazar mein + quick check 22"],
      ["Polarity aur dipole moment", "Section 4.3.6", 23, "Polar bond aur dipole moment 24 · Shape aur net dipole: vector sum 25 · Ionic bond ka covalent character: Fajans' rules 26 · Ek nazar mein + quick check 27"],
      ["VSEPR theory: molecules ki shape", "Section 4.4", 28, "VSEPR ke postulates aur repulsion order 29 · Shapes bina lone pair ke (AB<sub>2</sub> se AB<sub>6</sub>) 30 · Shapes jab lone pairs bhi hon 31 · Bond angle distortion aur lone pair ki position 32 · Shape predict karne ke steps + practice 33 · Ek nazar mein + quick check 34"],
      ["Valence bond theory aur hybridisation", "Section 4.5, 4.6", 35, "VBT: H<sub>2</sub> molecule kaise banta hai 36 · Orbital overlap; σ aur π bonds 37 · Hybridisation kyun aur kya 38 · sp, sp<sup>2</sup>, sp<sup>3</sup>: BeCl<sub>2</sub>, BCl<sub>3</sub>, CH<sub>4</sub> 39 · NH<sub>3</sub>, H<sub>2</sub>O aur C<sub>2</sub>H<sub>6</sub> mein sp<sup>3</sup> 40 · C<sub>2</sub>H<sub>4</sub> (sp<sup>2</sup>) aur C<sub>2</sub>H<sub>2</sub> (sp): π bonds 41 · d orbitals ke saath: sp<sup>3</sup>d, sp<sup>3</sup>d<sup>2</sup> 42 · Ek nazar mein + quick check 43"],
      ["Molecular orbital theory", "Section 4.7, 4.8", 44, "MOT ke features aur LCAO 45 · Combination ki conditions aur σ, π MOs 46 · Bond order, stability aur magnetism 47 · C<sub>2</sub>, N<sub>2</sub>, O<sub>2</sub>: configuration aur O<sub>2</sub> ka magnetism 48 · Ek nazar mein + quick check 49"],
      ["Hydrogen bonding", "Section 4.9", 50, "Hydrogen bond kya hai aur kyun banta hai 51 · Intermolecular aur intramolecular H-bond 52 · Effects: boiling point aur barf ka tairna 53 · Ek nazar mein + quick check 54"],
      ["Revision", "Complete chapter", 55, "Chaar theories + shapes ka master chart 56 · Fact sheet: poora chapter ek page par 57 · Top 12 mistakes + exam ke favourite questions 58 · Final test, Part A: 16 MCQs 59 · Final test, Part B aur C + scorecard 60 · Answer key + tumhara certificate 61"]
    ] },
  { n: 5, title: "Thermodynamics", extra: "+ Gas laws (bonus)", tag: "Energy ka hisaab-kitaab: heat, work aur spontaneity, Hinglish mein",
    pages: 68, fig: 47, solved: 43, practice: "140+", qr: "2 QR simulations",
    topics: [
      ["Gases: pV = nRT (bonus)", "Bonus: gaseous state", 4, "Gas ke 4 variables aur units 5 · Boyle's law: p aur V 6 · Charles' aur Gay-Lussac's law 7 · Avogadro's law aur ideal gas equation 8 · pV = nRT ke uses: combined law, density 9 · Dalton's law of partial pressures 10 · Kinetic theory aur real gases (JEE) 11 · Ek nazar mein + quick check 12"],
      ["Thermodynamics ki language", "Section 5.1.1 to 5.1.3", 13, "System, surroundings aur system ke types 14 · State of system aur state functions 15 · Thermodynamic processes 16 · Extensive aur intensive properties 17 · Ek nazar mein + quick check 18"],
      ["Internal energy aur first law", "Section 5.1.4", 19, "Internal energy kya hai 20 · Work aur heat se ΔU: U state function kyun 21 · First law aur sign convention 22 · NCERT Problem 5.1 + sign practice 23 · Ek nazar mein + quick check 24"],
      ["Work: pressure-volume work", "Section 5.2.1", 25, "w = −p<sub>ex</sub>ΔV: derivation aur sign 26 · Reversible aur irreversible process 27 · Free expansion, isothermal work: NCERT 5.2 to 5.4 28 · Kaun sa path zyada work deta hai? 29 · Ek nazar mein + quick check 30"],
      ["Enthalpy, heat capacity aur calorimetry", "Section 5.2.2, 5.3", 31, "Enthalpy: H = U + pV aur ΔH = q<sub>p</sub> 32 · ΔH = ΔU + Δn<sub>g</sub>RT 33 · Heat capacity aur specific heat 34 · C<sub>p</sub>, C<sub>V</sub> aur C<sub>p</sub> − C<sub>V</sub> = R 35 · Bomb calorimeter se ΔU 36 · Coffee-cup calorimeter se ΔH 37 · Ek nazar mein + quick check 38"],
      ["Reaction enthalpy aur Hess's law", "Section 5.4", 39, "Reaction enthalpy aur standard state 40 · Phase transformations: fusion, vaporisation, sublimation 41 · Standard enthalpy of formation 42 · Thermochemical equations 43 · Hess's law of constant heat summation 44 · Hess's law practice: benzene ka Δ<sub>f</sub>H 45 · Ek nazar mein + quick check 46"],
      ["Enthalpy ke alag-alag types", "Section 5.5", 47, "Standard enthalpy of combustion 48 · Atomization aur bond enthalpy 49 · Bond enthalpies se Δ<sub>r</sub>H 50 · Lattice enthalpy: Born-Haber cycle 51 · Enthalpy of solution aur dilution 52 · Ek nazar mein + quick check 53"],
      ["Spontaneity: entropy aur Gibbs energy", "Section 5.6, 5.7", 54, "Spontaneous process: kya ΔH kaafi hai? 55 · Entropy aur ΔS = q<sub>rev</sub>/T 56 · Second law, third law aur ΔS<sub>total</sub> 57 · Gibbs energy: ΔG = ΔH − TΔS 58 · Gibbs energy aur equilibrium: ΔG° aur K 59 · Ek nazar mein + quick check 60"],
      ["Revision", "Complete chapter", 61, "Formula sheet + sign convention chart 62 · Fact sheet: poora chapter ek page par 63 · Top 12 mistakes + exam ke favourite questions 64 · Final test, Part A: 16 MCQs 65 · Final test, Part B aur C + scorecard 66 · Answer key + tumhara certificate 67"]
    ] },
  { n: 6, title: "Equilibrium", tag: "Aage bhi, peeche bhi, phir bhi balanced: K, pH aur Ksp, Hinglish mein",
    pages: 73, fig: 42, solved: 36, practice: "130+", qr: "4 QR simulations",
    topics: [
      ["Physical equilibrium", "Section 6.1", 4, "Dynamic equilibrium ka matlab 5 · Solid ⇌ liquid: normal melting point 6 · Liquid ⇌ vapour: vapour pressure 7 · Solid ⇌ vapour aur saturated solution 8 · Gases in liquids: Henry's law + Table 6.1 9 · Ek nazar mein + quick check 10"],
      ["Chemical equilibrium aur K<sub>c</sub> ka law", "Section 6.2, 6.3", 11, "Chemical equilibrium: rate graph aur D<sub>2</sub> proof 12 · Dono taraf se same equilibrium + student activity 13 · Law of chemical equilibrium: K<sub>c</sub> 14 · K<sub>c</sub> likhna + reverse/multiply rules 15 · Ek nazar mein + quick check 16"],
      ["Homogeneous, heterogeneous aur K<sub>p</sub>", "Section 6.4, 6.5", 17, "Homogeneous equilibria + Problem 6.3 18 · K<sub>p</sub> aur K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup> 19 · K ki units + K<sub>c</sub> ↔ K<sub>p</sub> practice 20 · Heterogeneous equilibria + Problem 6.6 21 · Ek nazar mein + quick check 22"],
      ["K ka use: Q, ICE table aur ΔG", "Section 6.6, 6.7", 23, "K se extent of reaction 24 · Reaction quotient Q: direction 25 · ICE table method + Problem 6.4 26 · ICE table: Problems 6.8 aur 6.9 27 · K, Q aur Gibbs energy: ΔG° = −RT ln K 28 · Ek nazar mein + quick check 29"],
      ["Le Chatelier's principle", "Section 6.8", 30, "Principle + concentration ka effect 31 · Pressure aur inert gas ka effect 32 · Temperature: sirf yahi K badalta hai 33 · Catalyst + Haber aur contact process 34 · Le Chatelier master table + practice 35 · Ek nazar mein + quick check 36"],
      ["Ionic equilibrium: acids aur bases", "Section 6.9, 6.10", 37, "Strong aur weak electrolytes 38 · Acids, bases aur Arrhenius concept 39 · Brønsted–Lowry: conjugate pairs 40 · Lewis acids aur bases 41 · Ek nazar mein + quick check 42"],
      ["Water, pH, K<sub>a</sub> aur K<sub>b</sub>", "Section 6.11.1 to 6.11.7", 43, "Strong/weak acids aur K<sub>w</sub> 44 · pH scale + ghar ka indicator 45 · pH problems: 6.16, 6.17 + strong bases 46 · Weak acids: K<sub>a</sub>, pK<sub>a</sub> aur Table 6.6 47 · Weak acid problems: 6.18 to 6.20 48 · Weak bases: K<sub>b</sub> + Problem 6.21 49 · K<sub>a</sub> × K<sub>b</sub> = K<sub>w</sub> + Problem 6.23 50 · Polybasic acids + acid strength factors 51 · Ek nazar mein + quick check 52"],
      ["Common ion, hydrolysis aur buffer", "Section 6.11.8, 6.11.9, 6.12", 53, "Common ion effect 54 · Salt hydrolysis: acidic, basic ya neutral 55 · Hydrolysis: pH calculation + Problem 6.25 56 · Buffer solutions: kya aur kaise 57 · Henderson equation + Problems 6.22, 6.24 58 · Ek nazar mein + quick check 59"],
      ["Solubility product (K<sub>sp</sub>)", "Section 6.13", 60, "Solubility categories aur K<sub>sp</sub> expression 61 · K<sub>sp</sub> ↔ solubility: Problems 6.26, 6.27 62 · Precipitate kab banega: Q vs K<sub>sp</sub> 63 · Common ion + pH ka solubility par effect 64 · Ek nazar mein + quick check 65"],
      ["Revision", "Complete chapter", 66, "Formula sheet + Le Chatelier chart 67 · Fact sheet: poora chapter ek page par 68 · Top 12 mistakes + exam ke favourite questions 69 · Final test, Part A: 16 MCQs 70 · Final test, Part B aur C + scorecard 71 · Answer key + tumhara certificate 72"]
    ] },
  { n: 7, title: "Redox Reactions", tag: "Electrons ka len-den: oxidation number, balancing aur cells, Hinglish mein",
    pages: 52, fig: 38, solved: 18, practice: "90+", qr: "1 QR simulation",
    topics: [
      ["Redox ka classical idea", "Section 7.1", 4, "Oxidation: oxygen jodna, hydrogen hatana 5 · Reduction aur redox: dono saath 6 · Oxidising aur reducing agent + Problem 7.1 7 · Redox hamari zindagi mein + ghar ki activity 8 · Ek nazar mein + quick check 9"],
      ["Electron transfer aur metal competition", "Section 7.2, 7.2.1", 10, "Electron transfer + Problem 7.2 11 · Zn strip in Cu<sup>2+</sup> solution (Fig. 7.1) 12 · Cu + Ag<sup>+</sup> (Fig. 7.2) aur Zn > Cu > Ag 13 · Ek nazar mein + quick check 14"],
      ["Oxidation number", "Section 7.3", 15, "Partial transfer aur ON ki definition 16 · ON ke 6 rules 17 · ON calculate karna: solved + practice 18 · Highest ON aur Stock notation (Problem 7.3) 19 · ON se redox pehchaano (Problem 7.4) 20 · Fractional ON: average ka khel 21 · Ek nazar mein + quick check 22"],
      ["Redox reactions ke types", "Section 7.3.1", 23, "Combination aur decomposition 24 · Metal displacement + activity series 25 · Hydrogen aur halogen displacement 26 · Disproportionation + Problem 7.5 27 · Problems 7.6, 7.7 + mixed practice 28 · Ek nazar mein + quick check 29"],
      ["Redox equations balance karna", "Section 7.3.2", 30, "Balance kya-kya karna hai + medium 31 · ON method + Problem 7.8 (acidic) 32 · ON method: basic medium (Problem 7.9) + Cu + HNO<sub>3</sub> 33 · Half reaction method: 7 steps 34 · Half method in basic medium (Problem 7.10) 35 · Aur practice + QR simulation 36 · Ek nazar mein + quick check 37"],
      ["Titrations aur electrode processes", "Section 7.3.3, 7.3.4, 7.4", 38, "Redox titrations: KMnO<sub>4</sub>, dichromate, iodometry 39 · ON ki limitations + ghar par iodine test 40 · Daniell cell (Fig. 7.3) aur salt bridge 41 · Electrode potential aur SHE 42 · Table 7.1: oxidising/reducing power + feasibility 43 · Ek nazar mein + quick check 44"],
      ["Revision", "Complete chapter", 45, "Rules sheet + oxidants aur reductants 46 · Fact sheet: poora chapter ek page par 47 · Top 12 mistakes + exam ke favourite questions 48 · Final test, Part A: 16 MCQs 49 · Final test, Part B aur C + scorecard 50 · Answer key + tumhara certificate 51"]
    ] },
  { n: 8, title: "Organic Chemistry: Some Basic Principles and Techniques", short: "Organic Chemistry: Basic Principles", tag: "Structures, naming, mechanism aur lab techniques: Hinglish mein",
    pages: 88, fig: 78, solved: 31, practice: "120+", qr: "2 QR simulations",
    topics: [
      ["Organic chemistry aur carbon ki tetravalence", "Section 8.1, 8.2", 4, "Organic chemistry aur vital force theory 5 · Tetravalence aur hybridisation: sp<sup>3</sup>, sp<sup>2</sup>, sp 6 · s-character ka asar + Problem 8.3 7 · σ aur π bonds + Problem 8.1 8 · Practice: Problem 8.2 + balloons wali activity 9"],
      ["Structure likhne ke tarike", "Section 8.3", 11, "Complete aur condensed formula 12 · Bond-line formula: padhna aur banana 13 · Practice: Problems 8.4, 8.5 + formula badlo 14 · 3D: wedge-dash aur molecular models 15"],
      ["Classification aur functional groups", "Section 8.4", 17, "Classification: chain, ring aur heterocyclic 18 · Aromatic aur heterocyclic compounds 19 · Functional groups: 15 groups ki table 20 · Functional groups hamari zindagi mein 21 · Homologous series 22"],
      ["IUPAC naming: alkanes", "Section 8.5.1, 8.5.2", 24, "Common naam vs IUPAC + word roots 25 · Alkyl groups: iso, sec, tert, neo 26 · Rules 1-3: chain, numbering, alphabetical 27 · Rules 4-7: di/tri, tie, complex groups 28 · Problem 8.7 + naam banane ke 4 steps 29 · Cycloalkanes ke naam 30"],
      ["IUPAC naming: functional groups aur benzene", "Section 8.5.3, 8.5.4", 32, "Suffix aur prefix: functional groups ke naam 33 · Priority order: principal functional group 34 · Problem 8.8: structure se naam 35 · Problem 8.9: naam se structure 36 · Benzene derivatives: o, m, p aur numbering 37 · Problem 8.10 + practice 38"],
      ["Isomerism", "Section 8.6", 40, "Isomerism ke types + chain isomers 41 · Position, functional isomers aur metamerism 42 · Stereoisomerism: cis-trans aur optical 43 · Practice: isomers count karo + pehchaano 44"],
      ["Reaction mechanism ki basics", "Section 8.7.1 to 8.7.3", 46, "Substrate, reagent aur mechanism 47 · Bond fission: homolytic vs heterolytic + Problem 8.11 48 · Carbocation, carbanion, free radical: stability 49 · Nucleophile aur electrophile + Problems 8.12, 8.13 50 · Curved arrows: electron movement 51"],
      ["Electronic effects aur reaction types", "Section 8.7.4 to 8.7.10", 53, "Inductive effect + Problems 8.14, 8.15 54 · Inductive effect ka use: acidity aur stability 55 · Resonance structures + Problem 8.16 56 · Resonance structures ki stability + Problems 8.17, 8.18 57 · Resonance effect: +R aur −R 58 · Electromeric effect: +E aur −E 59 · Hyperconjugation + Problem 8.19 60 · Organic reactions ke chaar types 61"],
      ["Purification ke methods", "Section 8.8", 63, "Sublimation aur crystallisation 64 · Distillation: simple 65 · Fractional aur reduced pressure distillation 66 · Steam distillation aur differential extraction 67 · Chromatography: column, TLC, paper 68 · Colourless spots, R<sub>f</sub> numerical + ghar par chromatography 69 · Kaunsa method kab? + NCERT exercises 70"],
      ["Qualitative aur quantitative analysis", "Section 8.9, 8.10", 72, "C, H detection + Lassaigne fusion 73 · Lassaigne: N aur S ke tests 74 · Halogens aur phosphorus ke tests 75 · Liebig method: % C, % H + Problem 8.20 76 · Dumas method: % N + Problem 8.21 77 · Kjeldahl method + Problem 8.22 78 · Carius: halogen aur S + Problems 8.23, 8.24; P aur O 79"],
      ["Revision", "Complete chapter", 81, "Rules sheet: har topic ka formula 82 · Fact sheet: poora chapter ek page par 83 · Top 12 mistakes + exam ke favourite questions 84 · Final test, Part A: 16 MCQs 85 · Final test, Part B aur C + scorecard 86 · Answer key + tumhara certificate 87"]
    ] },
  { n: 9, title: "Hydrocarbons", tag: "Petrol se polythene tak: carbon aur hydrogen ki poori family, Hinglish mein",
    pages: 87, fig: 71, solved: 53, practice: "100+", qr: "2 QR simulations",
    topics: [
      ["Hydrocarbons ka parivaar", "Section 9.1", 4, "Classification aur general formulas 5 · Fuels, uses aur pollution 6 · Practice: formula se family pehchaano 7"],
      ["Alkanes: naam, isomers aur banana", "Section 9.2.1, 9.2.2", 9, "Structure, isomers aur 1°/2°/3°/4° carbon 10 · Problem 9.1: C<sub>6</sub>H<sub>14</sub> ke isomers 11 · Problem 9.2: C<sub>5</sub>H<sub>11</sub> groups aur alcohols 12 · Problems 9.3, 9.4, 9.5: naam ↔ structure 13 · Banana: hydrogenation, Zn/HCl, Wurtz reaction 14 · Banana: decarboxylation, Kolbe + Problem 9.6 15"],
      ["Alkanes ki properties", "Section 9.2.3", 17, "Physical properties: b.p., branching, solubility 18 · Substitution: halogenation 19 · Free radical mechanism + Exercise 9.1 20 · Combustion aur controlled oxidation 21 · Isomerisation, aromatisation, steam, pyrolysis 22 · Practice: properties ke questions 23"],
      ["Conformations", "Section 9.2.4", 25, "Conformations kya hain: eclipsed, staggered 26 · Sawhorse aur Newman projections 27 · Stability, torsional strain, energy graph 28 · Practice: projections draw karo 29"],
      ["Alkenes: structure, naam, isomerism", "Section 9.3.1 to 9.3.3", 31, "Double bond ki structure 32 · IUPAC naam + Problem 9.7 33 · σ aur π bonds ginna + Problem 9.8 34 · Structural isomers + Problem 9.9 35 · Geometrical (cis-trans) isomerism 36 · Problems 9.10, 9.11 + Exercise 9.9 37"],
      ["Alkenes banana", "Section 9.3.4", 39, "Alkynes se: Lindlar aur Na/liquid NH<sub>3</sub> 40 · Alkyl halides se: dehydrohalogenation 41 · Vicinal dihalides aur alcohols se 42 · Practice: kaunsa reagent + Exercise 9.21 43"],
      ["Alkenes ki reactions", "Section 9.3.5", 45, "Physical properties, H<sub>2</sub> aur halogens ka addition 46 · HX ka addition: Markovnikov rule 47 · Peroxide effect + Problem 9.12, Exercise 9.16 48 · H<sub>2</sub>SO<sub>4</sub> aur paani ka addition 49 · Oxidation: Baeyer reagent, acidic KMnO<sub>4</sub> 50 · Ozonolysis: double bond ki jagah 51 · Ozonolysis puzzles: Exercises 9.4 to 9.7 52 · Polymerisation 53"],
      ["Alkynes", "Section 9.4", 55, "Naam, isomers + Problem 9.13 56 · Triple bond ki structure 57 · Banana: calcium carbide, vicinal dihalides 58 · Acidic character + Exercise 9.18 59 · Addition: H<sub>2</sub>, halogens, HX 60 · Water addition, polymerisation, summary 61"],
      ["Benzene: structure aur aromaticity", "Section 9.5.1 to 9.5.4", 63, "Arenes: naam aur isomers 64 · Benzene ki structure + Exercise 9.17 65 · Aromaticity: Hückel rule + Exercises 9.10 to 9.12 66 · Benzene banana + Problem 9.14, Exercise 9.20 67 · Physical properties, combustion + Exercise 9.8 68"],
      ["Benzene ki reactions", "Section 9.5.5, 9.5.6, 9.6", 70, "Electrophilic substitution: mechanism + Exercise 9.19 71 · Nitration aur halogenation 72 · Sulphonation aur Friedel-Crafts + Exercise 9.24 73 · Addition reactions aur combustion 74 · Directive influence: o/p aur m 75 · Conversions: Exercises 9.13, 9.22, 9.23 76 · Carcinogenicity aur toxicity 77"],
      ["Revision", "Complete chapter", 79, "Conversions map: ek nazar mein 80 · Reagent sheet + rules 81 · Fact sheet: poora chapter ek page par 82 · Top 12 mistakes + exam ke favourite questions 83 · Final test, Part A: 16 MCQs 84 · Final test, Part B aur C + scorecard 85 · Answer key + tumhara certificate 86"]
    ] }
];
CHAPTERS.forEach(c => { c.cls = 11; });

// Class 12 (Part 2), from each booklet's contents page.
const CLASS_12 = [
  { n: 1, title: "Solutions", tag: "Solute ke particles, poore solution ka khel", pages: 66, fig: 26, solved: 74, practice: "90+", qr: "1 QR simulation",
    topics: [
      ["Solutions aur concentration", "Section 1.1, 1.2", 4, "Solution kya hai + 9 types 5 · Mass %, volume %, mass by volume % aur ppm 6 · Mole fraction, molarity, molality + Examples 1.1 se 1.3 7 · Intext Questions 1.1 se 1.5 8 · Exercises 1.4, 1.5, 1.7, 1.8 9 · Exercises 1.6, 1.9, 1.26, 1.28, 1.29, 1.30 10 · Practice: concentration 11"],
      ["Solubility aur Henry's law", "Section 1.3", 13, "Solid ki solubility, like dissolves like 14 · Gas ki solubility aur Henry's law 15 · Henry's law numericals: Example 1.4, Intext 1.6, 1.7, Exercise 1.13 16 · Henry's law ke applications + temperature ka asar 17 · Exercises 1.23, 1.24, 1.25, 1.27, 1.35, 1.39 18"],
      ["Vapour pressure aur Raoult's law", "Section 1.4.1, 1.4.2", 20, "Vapour pressure aur Raoult's law (liquid + liquid) 21 · Example 1.5 aur Intext 1.8 22 · Raoult = Henry ka special case; solid wale solutions 23 · Exercises 1.16, 1.36, 1.38 24"],
      ["Ideal aur non-ideal solutions", "Section 1.5", 26, "Ideal vs non-ideal solutions 27 · Positive aur negative deviation (Exercise 1.14) 28 · Azeotropes + Exercise 1.10 29 · Exercises 1.37 (graph) aur 1.10 30"],
      ["Colligative properties: vapour pressure ka lowering", "Section 1.4.3, 1.6.1", 32, "Colligative properties + RLVP ka formula 33 · Example 1.6, Intext 1.9, Exercise 1.34 34 · Exercises 1.15, 1.17, 1.18, 1.19 35"],
      ["Elevation of boiling point", "Section 1.6.2", 37, "ΔTb = Kb m, graph aur Table 1.3 38 · Examples 1.7, 1.8 aur Intext 1.10 39 · Practice: boiling point elevation 40"],
      ["Depression of freezing point", "Section 1.6.3", 42, "ΔTf = Kf m aur graph (Fig. 1.8) 43 · Examples 1.9, 1.10 aur Intext 1.11 44 · Exercises 1.20, 1.21 + antifreeze 45"],
      ["Osmosis aur osmotic pressure", "Section 1.6.4, 1.6.5", 47, "Osmosis aur π = CRT 48 · Isotonic solutions aur reverse osmosis 49 · Example 1.11, Intext 1.12, Exercise 1.22 50"],
      ["Abnormal molar masses aur van't Hoff factor", "Section 1.7", 52, "Abnormal molar mass aur i (Table 1.4) 53 · Degree of dissociation/association + Examples 1.12, 1.13 54 · Exercises 1.31, 1.32, 1.33 55 · Exercises 1.40, 1.41 + practice 56"],
      ["Revision", "Complete chapter", 58, "Formula sheet: poora chapter 59 · Fact sheet: poora chapter ek page par 60 · Top 12 mistakes + exam ke favourite questions 61 · Board pattern test: Section A (MCQ + Assertion-Reason) 62 · Board pattern test: Sections B aur C 63 · Board pattern test: Sections D, E + scorecard 64 · Answer key + tumhara certificate 65"]
    ] },
  { n: 2, title: "Electrochemistry", tag: "Electrons ka safar: chemistry se bijli", pages: 59, fig: 35, solved: 39, practice: "100+", qr: "1 QR simulation",
    topics: [
      ["Electrochemical cells aur galvanic cell", "Section 2.1, 2.2", 4, "Electrochemistry aur do tarah ke cells 5 · Daniell cell aur salt bridge 6 · External potential: galvanic se electrolytic 7 · Cell potential aur cell notation (Exercise 2.3) 8"],
      ["Electrode potential, SHE aur electrochemical series", "Section 2.2.1", 10, "Standard hydrogen electrode (SHE) 11 · Table 2.1: electrochemical series 12 · Table 2.1 ke use (Intext 2.2, 2.3; Exercises 2.1, 2.2) 13 · Feasibility: Exercise 2.17 + JEE extra 14"],
      ["Nernst equation", "Section 2.3", 16, "Nernst equation: electrode aur cell 17 · Example 2.1, Intext 2.4, 2.5 18 · Exercise 2.5: chaar cells ka emf 19"],
      ["Cell potential, equilibrium constant aur Gibbs energy", "Section 2.3.1, 2.3.2", 21, "Equilibrium constant (Example 2.2) 22 · Gibbs energy (Example 2.3, Intext 2.6) 23 · Exercises 2.4, 2.6 24"],
      ["Conductance: conductivity aur molar conductivity", "Section 2.4, 2.4.1", 26, "R, ρ, G, κ aur do tarah ka conductance 27 · Conductivity cell, cell constant, Wheatstone bridge 28 · Molar conductivity (Examples 2.4, 2.5) 29 · Exercises 2.8, 2.9 + practice 30"],
      ["Concentration ka effect aur Kohlrausch's law", "Section 2.4.2", 32, "κ ghatta, Λm badhta (Intext 2.7, Exercise 2.7) 33 · Strong electrolytes (Example 2.6) 34 · Kohlrausch's law (Examples 2.7, 2.8; Intext 2.8) 35 · Weak electrolytes: α aur Ka (Example 2.9, Intext 2.9, Exercise 2.11) 36 · Exercise 2.10: NaCl ka graph 37"],
      ["Electrolysis aur Faraday's laws", "Section 2.5", 39, "Electrolytic cell aur Faraday's laws (Example 2.10) 40 · Kitne Faraday? (Intext 2.10, 2.12; Exercises 2.12–2.14) 41 · Exercises 2.15, 2.16 (cells in series) 42 · Products of electrolysis (Exercise 2.18, Intext 2.11) 43"],
      ["Batteries, fuel cells aur corrosion", "Section 2.6, 2.7, 2.8", 45, "Primary batteries: dry cell, mercury cell 46 · Secondary batteries: lead storage, Ni-Cd (Intext 2.13) 47 · Fuel cells aur hydrogen economy (Intext 2.14) 48 · Corrosion aur rusting (Intext 2.15) 49"],
      ["Revision", "Complete chapter", 51, "Formula sheet: poora chapter 52 · Fact sheet: poora chapter ek page par 53 · Top 12 mistakes + exam ke favourite questions 54 · Board pattern test: Section A (MCQ + Assertion-Reason) 55 · Board pattern test: Sections B aur C 56 · Board pattern test: Sections D, E + scorecard 57 · Answer key + tumhara certificate 58"]
    ] },
  { n: 3, title: "Chemical Kinetics", tag: "Reaction kitni tez? Kyun? Kaise tez karein?", pages: 53, fig: 23, solved: 48, practice: "80+", qr: "1 QR simulation",
    topics: [
      ["Rate of a chemical reaction", "Section 3.1", 4, "Average aur instantaneous rate 5 · Example 3.1 aur Intext 3.1 6 · Stoichiometry ke saath rate (Example 3.2, Intext 3.2) 7"],
      ["Rate law, rate constant aur order", "Section 3.2, 3.2.1 to 3.2.3", 9, "Factors, rate law aur rate constant 10 · Order aur k ki units (Examples 3.3, 3.4; Intext 3.3, 3.4) 11 · Exercises 3.1, 3.2, 3.4, 3.5 12 · Concentration badlo, rate kitna? (Exercises 3.6, 3.9) 13 · Initial rate method (Exercises 3.10 to 3.12) 14"],
      ["Molecularity aur reaction mechanism", "Section 3.2.4", 16, "Molecularity aur complex reactions 17 · Mechanism aur rate determining step 18 · Order vs molecularity 19"],
      ["Zero order reactions", "Section 3.3, 3.3.1", 21, "Zero order: derivation, graphs, examples 22 · Zero order: half-life aur numericals (Exercise 3.3) 23"],
      ["First order reactions aur half-life", "Section 3.3.2, 3.3.3", 25, "First order: derivation, graphs, examples 26 · First order numericals (Examples 3.5, 3.6; Intext 3.5) 27 · Half-life (Examples 3.7, 3.8; Intext 3.6; Exercises 3.13, 3.16, 3.18) 28 · Exercises 3.14, 3.17, 3.19, 3.24, 3.25 29 · Exercises 3.15, 3.20, 3.21 (data aur pressure) 30 · Pseudo first order (Example 3.9, Exercise 3.8) 31"],
      ["Temperature ka effect aur Arrhenius equation", "Section 3.4", 33, "Temperature, Arrhenius equation, activation energy 34 · Maxwell–Boltzmann aur ln k vs 1/T (Intext 3.7) 35 · Do temperatures ka formula (Examples 3.10, 3.11; Intext 3.8, 3.9; Exercise 3.30) 36 · Exercises 3.23, 3.26, 3.27, 3.28 37 · Exercises 3.22, 3.29 (graph aur two-temperature) 38"],
      ["Catalyst aur collision theory", "Section 3.4.1, 3.5", 40, "Effect of catalyst 41 · Catalyst roz ki zindagi mein + numerical 42 · Collision theory aur orientation 43"],
      ["Revision", "Complete chapter", 45, "Formula sheet: poora chapter 46 · Fact sheet: poora chapter ek page par 47 · Top 12 mistakes + exam ke favourite questions 48 · Board pattern test: Section A (MCQ + Assertion-Reason) 49 · Board pattern test: Sections B aur C 50 · Board pattern test: Sections D, E + scorecard 51 · Answer key + tumhara certificate 52"]
    ] },
  { n: 4, title: "The d- and f-Block Elements", short: "d- and f-Block Elements", tag: "Rang, chumbak aur catalyst: d-block ka jaadu", pages: 58, fig: 29, solved: 41, practice: "90+", qr: "",
    topics: [
      ["Position aur electronic configuration", "Section 4.1, 4.2", 4, "d-block ki position, transition element kise kehte hain 5 · Electronic configuration, Cr aur Cu exceptions, Example 4.1 6 · NCERT exercises: ions ke configuration (Exercise 4.1, 4.8, 4.9) 7"],
      ["Physical properties, size aur ionisation enthalpy", "Section 4.3.1 to 4.3.3", 9, "Physical properties, enthalpy of atomisation (Example 4.2, Intext 4.2) 10 · Atomic aur ionic size, lanthanoid contraction, density 11 · Ionisation enthalpy: IE1, IE2, IE3 ka pattern (Intext 4.5) 12"],
      ["Oxidation states aur electrode potentials", "Section 4.3.4 to 4.3.8", 14, "Oxidation states ka pattern (Example 4.3, Intext 4.3) 15 · E°(M²⁺/M): irregular trend, Cu ka positive E° 16 · E°(M³⁺/M²⁺): oxidising aur reducing ions 17 · Higher oxidation states, Cu⁺ disproportionation 18 · NCERT exercises 4.2 to 4.5 19 · NCERT Example 4.5, Exercises 4.6, 4.13, 4.17 20 · NCERT exercises 4.19, 4.21 to 4.23 21"],
      ["Magnetic, colour, catalyst, alloys", "Section 4.3.9 to 4.3.14", 23, "Magnetic properties, spin only formula (Example 4.8, Intext 4.8) 24 · μ ki table, t₂g/eg filling (Exercises 4.24, 4.36, 4.38) 25 · Coloured ions, d–d transition (Exercise 4.18) 26 · Complexes, catalysts, interstitial compounds, alloys 27 · NCERT reasons: Exercises 4.11, 4.12 28"],
      ["Potassium dichromate aur permanganate", "Section 4.4", 30, "Oxides aur oxoanions ka trend (Exercise 4.25) 31 · K₂Cr₂O₇: preparation, structure (Exercise 4.26) 32 · K₂Cr₂O₇ ka oxidising action (Exercises 4.14, 4.15) 33 · KMnO₄: preparation, structure, properties (Example 4.9) 34 · KMnO₄ ka oxidising action (Exercise 4.16) 35"],
      ["Lanthanoids", "Section 4.5", 37, "Electronic configuration (Exercises 4.28, 4.31) 38 · Lanthanoid contraction aur consequences (Exercise 4.7) 39 · Oxidation states (Example 4.10, Exercises 4.10, 4.32) 40 · General characteristics, reactions, uses (Exercise 4.27) 41"],
      ["Actinoids aur applications", "Section 4.6, 4.7", 43, "Actinoids: configuration aur contraction (Intext 4.10, Exercise 4.30) 44 · Oxidation states, general characteristics (Exercise 4.29) 45 · Lanthanoids vs actinoids (Exercises 4.20, 4.33, 4.34) 46 · Applications of d- and f-block elements 47 · 3d vs 4d, 5d series (Exercises 4.35, 4.37) 48"],
      ["Revision", "Complete chapter", 50, "Rule sheet: poora chapter 51 · Fact sheet: poora chapter ek page par 52 · Top 12 mistakes + exam ke favourite questions 53 · Board pattern test: Section A (MCQ + Assertion-Reason) 54 · Board pattern test: Sections B aur C 55 · Board pattern test: Sections D, E + scorecard 56 · Answer key + tumhara certificate 57"]
    ] },
  { n: 5, title: "Coordination Compounds", tag: "Ek metal, kai ligands: complexes ki duniya", pages: 55, fig: 36, solved: 38, practice: "80+", qr: "",
    topics: [
      ["Werner theory aur key terms", "Section 5.1, 5.2", 4, "Werner ki theory: primary aur secondary valence (Example 5.1) 5 · Double salt vs complex (Exercises 5.1, 5.2) 6 · Important terms: entity, central ion, CN, sphere, polyhedron, oxidation number 7 · Ligands: denticity, chelate, ambidentate 8 · NCERT exercises: terms, ligands, oxidation numbers (5.3 to 5.5) 9"],
      ["Nomenclature", "Section 5.3", 11, "Formula likhne ke rules (Example 5.2, Intext 5.1) 12 · Naming rules, ligands ke naam (Example 5.3, Intext 5.2) 13 · NCERT exercises: formulas aur names (5.6, 5.7) 14"],
      ["Isomerism", "Section 5.4", 16, "Types; geometrical isomerism: cis/trans, fac/mer (Examples 5.4, 5.5) 17 · Optical isomerism (Example 5.6) 18 · Structural isomerism: linkage, coordination, ionisation, solvate (Intext 5.4) 19 · NCERT: Intext 5.3, Exercises 5.8, 5.9 20 · NCERT: Exercises 5.10 to 5.12 (isomers draw karo) 21"],
      ["Valence bond theory aur magnetism", "Section 5.5.1 to 5.5.3", 23, "VBT: hybridisation, [Co(NH₃)₆]³⁺ vs [CoF₆]³⁻ 24 · Tetrahedral aur square planar: [NiCl₄]²⁻, [Ni(CN)₄]²⁻ (Example 5.7) 25 · Magnetic properties aur VBT ki limitations 26 · NCERT Intext 5.5 to 5.8 27 · NCERT: Intext 5.9, Exercises 5.15, 5.19, 5.29 28"],
      ["Crystal field theory", "Section 5.5.4", 30, "Octahedral field: t₂g aur eg splitting (Exercise 5.16) 31 · Spectrochemical series, Δₒ vs P, high/low spin (Intext 5.10) 32 · Tetrahedral field; Exercise 5.17 33 · NCERT exercises: CFSE, d occupancy (5.18, 5.23) 34"],
      ["Colour aur theories ki limits", "Section 5.5.5, 5.5.6", 36, "Colour ka reason, [Ti(H₂O)₆]³⁺ (Exercise 5.13) 37 · Ligand se rang badalna, gemstones, CFT ki limitations 38 · NCERT exercises: colour (5.20, 5.21, 5.25, 5.31) 39"],
      ["Metal carbonyls aur applications", "Section 5.6, 5.7", 41, "Metal carbonyls: structures, synergic bonding (Exercise 5.22) 42 · Importance aur applications 43 · NCERT: Exercises 5.26, 5.27, 5.28, 5.30 44 · NCERT: Exercises 5.24, 5.14 45"],
      ["Revision", "Complete chapter", 47, "Rule sheet: poora chapter 48 · Fact sheet: poora chapter ek page par 49 · Top 12 mistakes + exam ke favourite questions 50 · Board pattern test: Section A (MCQ + Assertion-Reason) 51 · Board pattern test: Sections B aur C 52 · Board pattern test: Sections D, E + scorecard 53 · Answer key + tumhara certificate 54"]
    ] },
  { n: 6, title: "Haloalkanes and Haloarenes", tag: "Ek halogen atom, poori reactivity badal de", pages: 60, fig: 42, solved: 22, practice: "110+", qr: "",
    topics: [
      ["Classification aur nomenclature", "Section 6.1, 6.2", 4, "Classification: number of halogens, sp³ aur sp² C–X 5 · Nomenclature: common aur IUPAC naam (Table 6.1, Example 6.2) 6 · C₅H₁₁Br ke 8 isomers (Example 6.1), Intext 6.1 7 · C₄H₉Br ke isomers (Exercise 6.6) aur naming practice 8 · NCERT Exercise 6.1: naam aur classification 9 · NCERT Exercises 6.2, 6.3: IUPAC naam aur structures 10"],
      ["C–X bond aur haloalkanes ki preparation", "Section 6.3, 6.4", 12, "Nature of C–X bond: length, enthalpy, dipole (Table 6.2) 13 · Alcohols se haloalkanes (Intext 6.2) 14 · Free radical halogenation (Example 6.3, Intext 6.4, Exercise 6.5) 15 · Alkenes se: HX aur X₂ addition (Example 6.4, Intext 6.3) 16 · Halogen exchange: Finkelstein, Swarts (Exercise 6.7) 17 · Major monohalo products (Intext 6.5) 18"],
      ["Haloarenes ki preparation aur physical properties", "Section 6.5, 6.6", 20, "Haloarenes: electrophilic substitution aur Sandmeyer 21 · Physical properties: b.p., density, solubility 22 · m.p. aur dipole ke questions (Exercises 6.4, 6.18, Intext 6.6) 23 · Dipole aur solubility ke kaaran, aniline se chlorobenzene (Exercises 6.12, 6.19) 24"],
      ["Nucleophilic substitution: S<sub>N</sub>2 aur S<sub>N</sub>1", "Section 6.7.1 (S<sub>N</sub>2, S<sub>N</sub>1)", 26, "Nucleophiles aur products (Table 6.4), ambident (Example 6.5, Exercise 6.8) 27 · S<sub>N</sub>2 mechanism: backside attack, inversion, steric hindrance (Example 6.6) 28 · S<sub>N</sub>1 mechanism: carbocation, stability order (Example 6.7) 29 · S<sub>N</sub>1 vs S<sub>N</sub>2 table, Intext 6.7, 6.8 30 · NCERT Exercises 6.9, 6.15, 6.16, 6.17 31"],
      ["Stereochemistry, elimination aur metals", "Section 6.7.1 (stereo, E, metals)", 33, "Optical activity, chirality, enantiomers (Example 6.8) 34 · Retention, inversion, racemisation 35 · Elimination: Saytzeff rule (Exercises 6.10, 6.20) 36 · Metals ke saath: Grignard, Wurtz (Intext 6.9, Exercise 6.12) 37 · Major products aur isobutyl bromide (Exercises 6.14, 6.21) 38"],
      ["Haloarenes ki reactions", "Section 6.7.2", 40, "Nucleophilic substitution kyun mushkil; –NO₂ ka asar 41 · Electrophilic substitution: o/p director (Example 6.9) 42 · Wurtz–Fittig, Fittig, Exercise 6.22 aur conversions 43"],
      ["Polyhalogen compounds aur conversions", "Section 6.8", 45, "CH₂Cl₂, CHCl₃, CHI₃, CCl₄ 46 · Freons, ozone, DDT (Exercise 6.13) 47 · Conversions: Exercise 6.11 48 · Conversions: Exercise 6.19 (i) to (x) 49 · Conversions: Exercise 6.19 (xi) to (xx) 50"],
      ["Revision", "Complete chapter", 52, "Rule sheet: poora chapter 53 · Fact sheet: poora chapter ek page par 54 · Top 12 mistakes + exam ke favourite questions 55 · Board pattern test: Section A (MCQ + Assertion-Reason) 56 · Board pattern test: Sections B aur C 57 · Board pattern test: Sections D, E + scorecard 58 · Answer key + tumhara certificate 59"]
    ] },
  { n: 7, title: "Alcohols, Phenols and Ethers", tag: "Ek –OH, ek –O–: teen families", pages: 55, fig: 33, solved: 16, practice: "100+", qr: "",
    topics: [
      ["Classification aur nomenclature", "Section 7.1 to 7.3", 4, "Classification: alcohols, phenols, ethers 5 · 1°, 2°, 3° aur allylic alcohols (Intext 7.1, 7.2) 6 · Nomenclature: common aur IUPAC naam (Example 7.1) 7 · Structure: bond angle aur bond length; Intext 7.3 8 · NCERT Exercises 7.1, 7.2: naam aur structures 9 · C₅H₁₂O ke isomers, cresols, ethers ke naam (Exercises 7.3, 7.7, 7.23) 10"],
      ["Alcohols ki preparation", "Section 7.4.1", 12, "Alkenes se: hydration aur hydroboration (Exercises 7.6, 7.11) 13 · Carbonyl compounds aur Grignard se (Example 7.2) 14 · Intext 7.4, 7.5; Exercise 7.13 15 · Conversions aur alkenes se alcohols (Exercises 7.20, 7.32) 16"],
      ["Phenols ki preparation aur physical properties", "Section 7.4.2, 7.4.3", 18, "Phenol banana: haloarene, sulphonic acid, diazonium, cumene (Exercises 7.9, 7.10, 7.12) 19 · Boiling point aur solubility: H-bonding (Example 7.3, Exercises 7.4, 7.5) 20 · o-Nitrophenol aur ethanol ka b.p. (Exercises 7.8, 7.22) 21"],
      ["Acidity aur O–H bond ki reactions", "Section 7.4.4 (a)", 23, "Metals aur NaOH ke saath; alcohols ki acidity 24 · Phenol zyada acidic kyun: phenoxide resonance, pKa (Table 7.3) 25 · Acid strength order, nitrophenoxide resonance (Example 7.4, Intext 7.8, Exercises 7.14, 7.15) 26 · Esterification aur acetylation: aspirin 27"],
      ["C–O bond ki reactions: HX, dehydration, oxidation", "Section 7.4.4 (b)", 29, "HX, Lucas test, PX₃ (Intext 7.6) 30 · Dehydration: conditions, mechanism (Exercise 7.19, Intext 7.7, Exercise 7.33) 31 · Oxidation: PCC, CrO₃, KMnO₄, Cu (Exercises 7.17 (i), 7.21) 32"],
      ["Phenols ki reactions aur important alcohols", "Section 7.4.4 (c), 7.5", 34, "Electrophilic substitution: nitration, bromination (Exercise 7.16) 35 · Nitration ke products, bromination (Example 7.5, Exercise 7.17) 36 · Kolbe, Reimer–Tiemann, Zn dust, oxidation (Intext 7.9, Exercises 7.17 (iv), 7.18) 37 · Methanol aur ethanol: banana, uses, denaturation 38"],
      ["Ethers", "Section 7.6", 40, "Ethers banana: dehydration aur Williamson (Example 7.6) 41 · Williamson practice (Intext 7.10, 7.11; Exercises 7.18, 7.24 to 7.27) 42 · Williamson ki limits, dehydration, physical properties (Exercises 7.25 to 7.27) 43 · Ethers ki reactions: HX se cleavage (Example 7.7, Intext 7.12) 44 · Anisole ki ring reactions; Exercises 7.28 to 7.31 45"],
      ["Revision", "Complete chapter", 47, "Rule sheet: poora chapter 48 · Fact sheet: poora chapter ek page par 49 · Top 12 mistakes + exam ke favourite questions 50 · Board pattern test: Section A (MCQ + Assertion-Reason) 51 · Board pattern test: Sections B aur C 52 · Board pattern test: Sections D, E + scorecard 53 · Answer key + tumhara certificate 54"]
    ] },
  { n: 8, title: "Aldehydes, Ketones and Carboxylic Acids", short: "Aldehydes, Ketones & Acids", tag: "Ek C=O group: teen families", pages: 64, fig: 31, solved: 7, practice: "130+", qr: "",
    topics: [
      ["Nomenclature aur carbonyl group", "Section 8.1", 4, "Families aur nomenclature: common aur IUPAC naam 5 · Structures from names (Intext 8.1) 6 · Carbonyl group ki structure aur polarity 7 · NCERT: IUPAC naam (Exercises 8.2, 8.4) 8 · NCERT: naam se structure (Exercise 8.3) 9"],
      ["Aldehydes aur ketones ki preparation", "Section 8.2", 11, "General methods: oxidation, dehydrogenation, ozonolysis, alkynes 12 · Sirf aldehydes: Rosenmund, Stephen, DIBAL-H 13 · Benzaldehyde: Etard, chromic oxide, benzal chloride, Gatterman–Koch 14 · Sirf ketones: R2Cd, nitrile + RMgX, Friedel– Crafts acylation 15 · Example 8.1, Intext 8.2 16"],
      ["Physical properties aur nucleophilic addition", "Section 8.3, 8.4.1", 18, "Physical properties (Example 8.2, Intext 8.3) 19 · Nucleophilic addition: mechanism aur reactivity (Example 8.3, Intext 8.4) 20 · HCN, NaHSO3, Grignard (Exercises 8.12 (i), 8.18 (i)) 21 · Alcohols se hemiacetal, acetal, ketal 22 · Ammonia derivatives: oxime, hydrazone, semicarbazone (Intext 8.5, Exercise 8.18 (ii)) 23 · NCERT: terms aur derivatives (Exercises 8.1, 8.5) 24"],
      ["Reduction, oxidation aur tests", "Section 8.4.2, 8.4.3", 26, "Reduction: alcohol, Clemmensen, Wolff–Kishner 27 · Oxidation: aldehyde aasaan, ketone mushkil; Tollens' aur Fehling's 28 · Haloform aur iodoform test 29 · Example 8.4, Exercises 8.6, 8.19 30 · Do compounds mein farq: chemical tests (Exercise 8.13) 31"],
      ["α-Hydrogen, Cannizzaro aur uses", "Section 8.4.4, 8.4.5, 8.5", 33, "α-H ki acidity aur aldol condensation 34 · Cross aldol aur Claisen–Schmidt (Exercises 8.9, 8.16 (iii), 8.17 (vii)) 35 · Cannizzaro, electrophilic substitution (Exercises 8.10, 8.16 (ii)) 36 · NCERT: aldol ya Cannizzaro? (Exercises 8.7, 8.8) 37 · Uses of aldehydes and ketones 38"],
      ["Carboxylic acids: naam, banana, properties", "Section 8.6 to 8.8", 40, "Nomenclature: common aur IUPAC (Intext 8.6) 41 · Carboxyl group ki structure aur physical properties 42 · Banana (1): alcohols, aldehydes, alkylbenzenes, nitriles, amides 43 · Banana (2): Grignard, acyl halides, anhydrides, esters 44 · Example 8.5, Intext 8.7 45"],
      ["Carboxylic acids ki reactions aur uses", "Section 8.9, 8.10", 47, "Acidity: metals, alkalies, NaHCO3; acids vs phenols (Exercise 8.20) 48 · Substituents ka asar (Intext 8.8, Exercise 8.12) 49 · C–OH ka toota: anhydride, esterification aur mechanism (Exercise 8.18 (iii)) 50 · Acid chlorides aur amides; reduction, decarboxylation (Exercise 8.16) 51 · HVZ, ring substitution, uses; Exercise 8.11 52 · NCERT conversions (Exercises 8.14, 8.15) 53 · NCERT: missing reagent ya product (Exercise 8.17) 54"],
      ["Revision", "Complete chapter", 56, "Rule sheet: poora chapter 57 · Fact sheet: poora chapter ek page par 58 · Top 12 mistakes + exam ke favourite questions 59 · Board pattern test: Section A (MCQ + Assertion-Reason) 60 · Board pattern test: Sections B aur C 61 · Board pattern test: Sections D, E + scorecard 62 · Answer key + tumhara certificate 63"]
    ] },
  { n: 9, title: "Amines", tag: "Ek N, ek lone pair: poori chemistry", pages: 52, fig: 24, solved: 8, practice: "110+", qr: "",
    topics: [
      ["Structure, classification aur naam", "Section 9.1 to 9.3", 4, "Structure aur classification 5 · Nomenclature: common aur IUPAC 6 · Classify karo, isomers likho (Intext 9.1, 9.2) 7 · NCERT: naam aur class (Exercise 9.1) 8"],
      ["Amines ki preparation", "Section 9.4", 10, "Nitro compounds ka reduction, ammonolysis (Example 9.1) 11 · Nitriles aur amides ka reduction (Example 9.2) 12 · Gabriel phthalimide synthesis (Exercises 9.3 (vii), 9.12) 13 · Hoffmann bromamide degradation (Example 9.3, Exercise 9.10) 14 · NCERT: conversions aur short notes (Intext 9.3, Exercise 9.7) 15"],
      ["Physical properties aur basicity", "Section 9.5, 9.6 (basic character)", 17, "Physical properties: smell, solubility, boiling point 18 · Basic character: salts, Kb aur pKb (Intext 9.5, Exercises 9.3 (iii), 9.14 (i)) 19 · Alkanamines vs ammonia: inductive, solvation, steric (Example 9.4) 20 · Arylamines vs ammonia: resonance (Exercises 9.3 (i), 9.14 (iii)) 21 · NCERT: basicity order (Intext 9.4, Exercise 9.4) 22"],
      ["Amino group ki reactions", "Section 9.6 (reactions of –NH₂)", 24, "Alkylation, acylation, benzoylation (Intext 9.6, 9.7) 25 · Carbylamine aur nitrous acid (Intext 9.8, Exercises 9.7 (i), 9.13) 26 · Hinsberg test aur farq karne wale tests (Exercises 9.2, 9.6) 27"],
      ["Aniline ki ring reactions", "Section 9.6 (ring substitution)", 29, "Activating –NH2, bromination, protection (Exercises 9.8 (vii), 9.11 (v)) 30 · Nitration aur sulphonation; Friedel–Crafts nahi (Exercises 9.3 (iv), (v), 9.11 (iii)) 31"],
      ["Diazonium salts", "Section 9.7 to 9.10", 33, "Diazotisation, stability, physical properties (Exercises 9.3 (vi), 9.7 (ii)) 34 · N2 ka displacement: Sandmeyer, Gatterman aur doosri (Exercise 9.11) 35 · Coupling reactions aur importance (Exercise 9.7 (iv)) 36 · Example 9.5, Intext 9.9 37"],
      ["Conversions aur pehchaan", "NCERT exercises", 39, "Exercise 9.5: carbon badhana, ghatana 40 · Exercise 9.8: aromatic conversions 41 · Exercise 9.9: A, B, C pehchano 42"],
      ["Revision", "Complete chapter", 44, "Rule sheet: poora chapter 45 · Fact sheet: poora chapter ek page par 46 · Top 12 mistakes + exam ke favourite questions 47 · Board pattern test: Section A (MCQ + Assertion-Reason) 48 · Board pattern test: Sections B aur C 49 · Board pattern test: Sections D, E + scorecard 50 · Answer key + tumhara certificate 51"]
    ] },
  { n: 10, title: "Biomolecules", tag: "Zindagi ki chemistry: sugar, protein, DNA", pages: 53, fig: 34, solved: 5, practice: "100+", qr: "",
    topics: [
      ["Carbohydrates aur glucose", "Section 10.1 to 10.1.2.1", 4, "Definition aur classification 5 · Monosaccharides aur glucose ki preparation 6 · Glucose ki open chain structure ke saboot 7 · Oxidation aur D/L configuration (Exercise 10.9) 8"],
      ["Cyclic structure aur disaccharides", "Section 10.1.2 to 10.1.3", 10, "Open chain ki kamiyan aur cyclic structure 11 · Haworth structure aur pyranose (Intext 10.3) 12 · Fructose ki structure 13 · Glycosidic linkage aur sucrose (Exercise 10.5) 14 · Maltose aur lactose (Intext 10.2, Exercise 10.7) 15"],
      ["Polysaccharides aur unki importance", "Section 10.1.4, 10.1.5", 17, "Starch aur glycogen (Exercise 10.6) 18 · Cellulose aur starch se fark (Exercise 10.8) 19 · Carbohydrates ki importance (Exercise 10.3) 20"],
      ["Amino acids aur peptide bond", "Section 10.2.1, 10.2.2", 22, "Amino acids aur classification (Exercise 10.11) 23 · Table 10.2: 20 natural amino acids 24 · Zwitterion aur optical activity (Intext 10.4, Exercise 10.16) 25 · Peptide bond aur polypeptides (Exercise 10.12 (i)) 26"],
      ["Proteins ki structure aur enzymes", "Section 10.2.3 to 10.3", 28, "Fibrous, globular aur secondary structure (Exercise 10.13 to 10.15) 29 · Tertiary aur quaternary structure (Exercise 10.12 (ii)) 30 · Denaturation (Exercise 10.12 (iii), 10.18, Intext 10.5) 31 · Enzymes aur unka action (Exercise 10.17) 32"],
      ["Vitamins aur hormones", "Section 10.4, 10.6", 34, "Vitamins aur classification (Exercise 10.19) 35 · Table 10.3: sources aur deficiency (Exercise 10.20, Intext 10.6) 36 · Hormones: types aur kaam 37"],
      ["Nucleic acids", "Section 10.5", 39, "Chemical composition: sugar aur bases 40 · Nucleoside, nucleotide, phosphodiester (Exercise 10.22, Intext 10.7) 41 · DNA double helix aur RNA (Exercise 10.23, 10.25, Intext 10.8) 42 · Kaam aur DNA vs RNA (Exercise 10.21, 10.24) 43"],
      ["Revision", "Complete chapter", 45, "Rule sheet: poora chapter 46 · Fact sheet: poora chapter ek page par 47 · Top 12 mistakes + exam ke favourite questions 48 · Board pattern test: Section A (MCQ + Assertion-Reason) 49 · Board pattern test: Sections B aur C 50 · Board pattern test: Sections D, E + scorecard 51 · Answer key + tumhara certificate 52"]
    ] }
];
CLASS_12.forEach(c => { c.cls = 12; CHAPTERS.push(c); });

// ===== Catalog from the admin panel =====
// The admin panel saves one catalog (books, chapters, prices, MRPs, formats, combos, offer) in Firestore.
// applyCatalog() lays it over the built-in data above, so every page shows the same, current list.
const STATIC_CHAPTERS = CHAPTERS.map(c => Object.assign({}, c));
const STATIC_PART = Object.assign({}, PART);
const keyOf = c => `${c.cls}-${c.n}`;
function defaultCatalog() {
  return {
    formats: JSON.parse(JSON.stringify(FORMATS)),
    books: Object.keys(STATIC_PART).map(cls => ({ cls: +cls, name: STATIC_PART[cls] })),
    chapters: STATIC_CHAPTERS.map(c => ({
      cls: c.cls, n: c.n, title: c.title, short: c.short || "", pages: c.pages, soon: false,
      price: Object.assign({}, PRICES[keyOf(c)]), mrp: {}
    })),
    combos: [], offer: { on: false, text: "", until: "" },
    referral: { on: false, days: 30 }, pay: Object.assign({}, DEFAULT_PAY)
  };
}
function applyCatalog(cat) {
  if (!cat || !Array.isArray(cat.chapters)) return false;
  const base = new Map(STATIC_CHAPTERS.map(c => [keyOf(c), c]));
  Object.keys(PART).forEach(k => delete PART[k]);
  Object.keys(CLASS_LABEL).forEach(k => delete CLASS_LABEL[k]);
  (cat.books || []).forEach(b => { PART[b.cls] = b.name; if (b.label) CLASS_LABEL[b.cls] = b.label; });
  Object.keys(PRICES).forEach(k => delete PRICES[k]);
  Object.keys(MRP).forEach(k => delete MRP[k]);
  const live = [], soon = [];
  cat.chapters.forEach(x => {
    const old = base.get(keyOf(x));
    const c = Object.assign({ tag: "", topics: [], pages: 0, fig: 0, solved: 0, practice: 0 }, old || { custom: true }, {
      cls: +x.cls, n: +x.n, title: x.title || (old && old.title) || `Chapter ${x.n}`, short: x.short || "",
      pages: +x.pages || (old && old.pages) || 0
    });
    if (x.tag) c.tag = x.tag;
    if (Array.isArray(x.topics) && x.topics.length) c.topics = x.topics.map(t => [t[0], t[1] || "", +t[2] || 1, t[3] || ""]);
    PRICES[keyOf(c)] = Object.assign({}, x.price);
    MRP[keyOf(c)] = Object.assign({}, x.mrp);
    (x.soon ? soon : live).push(c);
  });
  const order = (a, b) => a.cls - b.cls || a.n - b.n;
  CHAPTERS.length = 0; live.sort(order).forEach(c => CHAPTERS.push(c));
  SOON_CHAPTERS.length = 0; soon.sort(order).forEach(c => SOON_CHAPTERS.push(c));
  UPCOMING.length = 0; SOON_CHAPTERS.forEach(c => UPCOMING.push({ cls: c.cls, n: c.n, title: c.title, tag: c.tag || "Coming soon", f: "" }));
  if (cat.formats) FORMAT_IDS.forEach(id => { if (cat.formats[id]) FORMATS[id] = Object.assign({}, FORMATS[id], cat.formats[id]); });
  COMBOS.length = 0; (cat.combos || []).filter(x => x.on !== false && x.chapters && x.chapters.length).forEach(x => COMBOS.push(x));
  OFFER = cat.offer || null;
  REFERRAL = Object.assign({ on: false, days: 30 }, cat.referral || {});
  PAY = !cat.pay ? DEFAULT_PAY : cat.pay.upi || cat.pay.link ? cat.pay : null;
  return true;
}
// A student's "refer a friend" code: the first 6 letters of their account number, in capitals.
const refCodeOf = uid => String(uid || "").slice(0, 6).toUpperCase();
// Classes that have a book, in order (school classes first, then university books).
const classList = () => Object.keys(PART).map(Number).filter(n => n).sort((a, b) => a - b);
const offerLive = () => !!(OFFER && OFFER.on && OFFER.text && (!OFFER.until || new Date(OFFER.until + "T23:59:59") >= new Date()));

// Free sample books (whole PDFs, free to download). Their pages are also in assets/samples/<class>/NN.webp.
const SAMPLE_BOOKS = {
  11: { title: "Chemophile Part 1 (Class 11): free sample", pdf: "samples/Chemophile-Class-11-Free-Sample.pdf", pages: 25, sizeMB: 4.3 },
  12: { title: "Chemophile Part 2 (Class 12): free sample", pdf: "samples/Chemophile-Class-12-Free-Sample.pdf", pages: 27, sizeMB: 4.4 }
};
const pad2 = n => String(n).padStart(2, "0");
const sampleImg = (cls, p, thumb) => `assets/samples/${cls}/${thumb ? "t" : ""}${pad2(p)}.webp`;
const assetName = c => c.cls === 11 ? `ch${c.n}` : `c12-ch${c.n}`;
// Chapters added in the admin panel have no pictures in assets/, so they get no cover image (null).
const coverOf = c => c.custom ? null : `assets/thumbs/${assetName(c)}-1.webp`;
// Pages shown under "Free sample pages" for a chapter: [thumbnail, full image, label].
const samplePagesOf = c => c.custom ? [] : [[1, "Cover"], [3, "Contents"], [4, "Topic 1, first page"], [5, "Page 5"], [6, "Page 6"]]
  .map(([p, label]) => [`assets/thumbs/${assetName(c)}-${p}.webp`, `assets/pages/${assetName(c)}-${p}.webp`, label]);
