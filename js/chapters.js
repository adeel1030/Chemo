// Shared by the sales page (index.html), the online reader (read.html) and the admin panel (admin.html).
// ===== Settings Adeel Sir can change =====
const PHONE = "9953821875";
const WHATSAPP = "919953821875";
// Price of each chapter in rupees. Key = "class-chapter", e.g. "11-1" is Class 11 Chapter 1.
// Paperback delivery charges are extra.
const PRICES = {
  "11-1": { online: 205, paperback: 492 },
  "11-2": { online: 203, paperback: 486 },
  "11-3": { online: 145, paperback: 348 },
  "11-4": { online: 155, paperback: 372 },
  "11-5": { online: 170, paperback: 408 },
  "11-6": { online: 183, paperback: 438 },
  "11-7": { online: 130, paperback: 312 },
  "11-8": { online: 220, paperback: 528 },
  "11-9": { online: 218, paperback: 522 }
};
const priceOf = (c, format) => PRICES[`${c.cls}-${c.n}`][format];

// Chapters still being written, as per the CBSE 2026-27 syllabus. Move a chapter into CHAPTERS when it is ready.
const UPCOMING = [
  { cls: 12, n: 1, title: "Solutions", tag: "Concentration, Raoult's law aur colligative properties", f: "ΔT<sub>b</sub> = K<sub>b</sub> · m" },
  { cls: 12, n: 2, title: "Electrochemistry", tag: "Cells, Nernst equation aur conductance", f: "E = E° − (0.059/n) log Q" },
  { cls: 12, n: 3, title: "Chemical Kinetics", tag: "Rate law, order aur Arrhenius equation", f: "k = A e<sup>−Ea/RT</sup>" },
  { cls: 12, n: 4, title: "The d- and f-Block Elements", tag: "Transition elements, lanthanoids aur actinoids", f: "Cr: [Ar] 3d<sup>5</sup> 4s<sup>1</sup>" },
  { cls: 12, n: 5, title: "Coordination Compounds", tag: "Werner theory, naming, VBT aur CFT", f: "[Co(NH<sub>3</sub>)<sub>6</sub>]<sup>3+</sup>" },
  { cls: 12, n: 6, title: "Haloalkanes and Haloarenes", tag: "S<sub>N</sub>1, S<sub>N</sub>2 aur haloarenes ki reactions", f: "R–X + OH<sup>−</sup> → R–OH" },
  { cls: 12, n: 7, title: "Alcohols, Phenols and Ethers", tag: "Banane ke tareeke, reactions aur acidity", f: "R–OH · Ar–OH · R–O–R" },
  { cls: 12, n: 8, title: "Aldehydes, Ketones and Carboxylic Acids", tag: "Nucleophilic addition aur named reactions", f: "&gt;C=O" },
  { cls: 12, n: 9, title: "Amines", tag: "Basicity, diazonium salts aur pehchaan ke tests", f: "R–NH<sub>2</sub>" },
  { cls: 12, n: 10, title: "Biomolecules", tag: "Carbohydrates, proteins, vitamins aur nucleic acids", f: "C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>" }
];
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
