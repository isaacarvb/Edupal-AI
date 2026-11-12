// WAEC/JAMB + JSS syllabus map (PRD §9 + §8 anti-hallucination).
// Single source of truth for subject lists; AI questions must stay inside these topics.

// ---------- Senior Secondary ----------

// "General" subjects are open to every SSS student, whatever their department.
export const GENERAL_SUBJECTS = [
  "English Studies",
  "Mathematics",
  "Physical Health Education",
  "Economics",
  "Christian Religious Studies",
  "Civic Education",
  "Geography",
  "Digital Technologies"
] as const;

export const SCIENCE_SUBJECTS = ["Physics", "Chemistry", "Biology"] as const;
export const ART_SUBJECTS = ["Literature in English", "Government"] as const;
export const COMMERCIAL_SUBJECTS = ["Commerce", "Accounting", "Marketing"] as const;

export const SSS_SUBJECTS = [
  ...GENERAL_SUBJECTS,
  ...SCIENCE_SUBJECTS,
  ...ART_SUBJECTS,
  ...COMMERCIAL_SUBJECTS
] as const;

// Back-compat alias (senior list).
export const SUBJECTS = [...SSS_SUBJECTS];

export type Subject = (typeof SSS_SUBJECTS)[number];

// General subjects belong to everyone. Kept as a separate export so older
// pages that gate on COMMON_SUBJECTS still open the same set.
export const COMMON_SUBJECTS = [...GENERAL_SUBJECTS];

export const DEPARTMENTS: Record<"Science" | "Commercial" | "Art", string[]> = {
  Science: [...GENERAL_SUBJECTS, ...SCIENCE_SUBJECTS],
  Commercial: [...GENERAL_SUBJECTS, ...COMMERCIAL_SUBJECTS],
  Art: [...GENERAL_SUBJECTS, ...ART_SUBJECTS]
};

export const DEPARTMENT_NAMES = Object.keys(DEPARTMENTS);

// Old rows stored "Arts". Everything in the app now says "Art", but the data
// may lag behind a migration, so normalise on read as well.
export function canonicalDepartment(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (t === "arts" || t === "art") return "Art";
  if (t === "science") return "Science";
  if (t === "commercial") return "Commercial";
  return raw.trim();
}

// Class-name helpers shared by school-code login and the curriculum hub.
export function isJuniorClass(className: string): boolean {
  return /(^|\s)jss\s*[1-3]?(\b|$)/i.test(className.trim());
}

export function isSeniorClass(className: string): boolean {
  return /(^|\s)sss?\s*[1-3]?(\b|$)/i.test(className.trim());
}

export const SYLLABUS: Record<Subject, string[]> = {
  "English Studies": ["Comprehension", "Synonyms", "Antonyms", "Tenses", "Lexis", "Idioms"],
  Mathematics: ["Quadratic equations", "Linear equations", "Percentages", "Geometry"],
  "Physical Health Education": ["Fitness", "Safety", "Nutrition"],
  Economics: ["Demand and supply", "Scale of preference", "Inflation"],
  "Christian Religious Studies": ["Creation and the Fall", "The Life of Jesus", "Christian Values and Ethics", "The Early Church"],
  "Civic Education": ["Citizenship", "Human Rights", "Democracy and Elections", "Rule of Law", "National Values"],
  Geography: ["The Earth and Its Structure", "Map Reading", "Weather and Climate", "Population", "Regional Geography of Nigeria"],
  "Digital Technologies": ["Computer Fundamentals", "Word Processing", "Spreadsheets", "Internet and Email", "Programming Basics"],
  Physics: ["Motion", "Waves", "Electricity"],
  Chemistry: ["Atomic structure", "Periodic table", "Acids and bases"],
  Biology: ["Cells", "Transport in plants", "Ecology"],
  "Literature in English": ["Prose", "Drama", "Poetry"],
  Government: ["Democracy", "Federalism"],
  Commerce: ["Trade", "Business units"],
  Accounting: ["Principles of Accounting", "Double Entry", "Trial Balance"],
  Marketing: ["Marketing Concepts", "Marketing Mix", "Consumer Behaviour"]
};

export function topicAllowed(subject: string, topic: string): boolean {
  const list = (SYLLABUS as Record<string, string[]>)[subject];
  return !!list && list.includes(topic);
}

// ---------- Junior Secondary ----------

export const JSS_SUBJECTS = [
  "Mathematics",
  "English Studies",
  "Social and Citizenship Studies",
  "Nigerian History",
  "Intermediate Science",
  "Digital Technologies",
  "Business Studies",
  "Physical Health Education",
  "Christian Religious Studies"
] as const;

// One name per subject, everywhere. Notes files, the NERDC curriculum and the
// question bank all call the same subject by different names ("English Language"
// vs "English Studies", "Integrated Science" vs "Intermediate Science").
// Everything below normalises to the canonical names in SSS_SUBJECTS/JSS_SUBJECTS
// so merging, filters and practice links all agree.
const CANONICAL_ALIASES: Record<string, string> = {
  english: "English Studies",
  "english language": "English Studies",
  "english studies": "English Studies",
  "physical and health education": "Physical Health Education",
  "physical health education": "Physical Health Education",
  phe: "Physical Health Education",
  "basic science and technology": "Intermediate Science",
  "basic science": "Intermediate Science",
  "integrated science": "Intermediate Science",
  "intermediate science": "Intermediate Science",
  "intermediate science (basic science and technology)": "Intermediate Science",
  "citizenship education": "Social and Citizenship Studies",
  "citizenship and heritage studies": "Civic Education",
  "social and citizenship education": "Social and Citizenship Studies",
  "social and citizenship studies": "Social and Citizenship Studies",
  "social studies & citizenship": "Social and Citizenship Studies",
  "social studies and citizenship": "Social and Citizenship Studies",
  "social studies": "Social and Citizenship Studies",
  "digital technologies": "Digital Technologies",
  "digital technologies (computer studies/ict)": "Digital Technologies",
  "computer studies": "Digital Technologies",
  "computer studies/ict": "Digital Technologies",
  ict: "Digital Technologies",
  "christian religious studies": "Christian Religious Studies",
  "christian religious knowledge": "Christian Religious Studies",
  crk: "Christian Religious Studies",
  crs: "Christian Religious Studies",
  "civic education": "Civic Education",
  civics: "Civic Education",
  literature: "Literature in English",
  "literature in english": "Literature in English",
  mathematics: "Mathematics",
  maths: "Mathematics",
  math: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  economics: "Economics",
  government: "Government",
  commerce: "Commerce",
  accounting: "Accounting",
  marketing: "Marketing",
  geography: "Geography",
  "business studies": "Business Studies",
  "nigerian history": "Nigerian History",
  history: "Nigerian History"
};

export function canonicalSubject(raw: string): string {
  const t = raw.trim();
  const hit = CANONICAL_ALIASES[t.toLowerCase()];
  if (hit) return hit;
  const known = [...SSS_SUBJECTS, ...JSS_SUBJECTS].find((s) => s.toLowerCase() === t.toLowerCase());
  return known ?? t;
}

// Short label for tight UI (cards, chips): drops the parenthetical tail.
export function shortSubject(name: string): string {
  return name.replace(/\s*\([^)]*\)/g, "").trim();
}

export const JSS_SYLLABUS: Record<string, string[]> = {
  Mathematics: ["Fractions", "Basic Algebra", "Geometry Basics"],
  "English Studies": ["Parts of Speech", "Comprehension", "Tenses"],
  "Social and Citizenship Studies": ["Rights & Duties", "National Symbols", "Honesty"],
  "Nigerian History": ["Early Nigerian Kingdoms", "Colonial Rule", "Independence and Nationhood"],
  "Intermediate Science": ["Living Things", "Matter", "Energy"],
  "Digital Technologies": ["Computer Fundamentals", "Word Processing", "Internet and Email"],
  "Business Studies": ["Business and Its Environment", "Home Trade", "Book-keeping"],
  "Physical Health Education": ["Fitness", "Safety", "Nutrition"],
  "Christian Religious Studies": ["Creation and the Fall", "The Life of Jesus", "Christian Values"]
};

export const JSS_GLOSSARY: Record<string, Record<string, { term: string; definition: string }[]>> = {
  Mathematics: {
    Fractions: [{ term: "Numerator", definition: "Top number of a fraction; counts the parts taken." }, { term: "Equivalent fractions", definition: "Different fractions with equal value, e.g. 1/2 = 2/4." }],
    "Basic Algebra": [{ term: "Variable", definition: "A letter standing for an unknown number." }, { term: "Simplify", definition: "Collect like terms into the shortest form." }],
    "Geometry Basics": [{ term: "Angle", definition: "Amount of turn between two lines meeting at a point." }, { term: "Perimeter", definition: "Total distance round a shape." }]
  },
  "English Studies": {
    "Parts of Speech": [{ term: "Noun", definition: "Naming word for people, places, things." }, { term: "Verb", definition: "Action or doing word." }],
    Comprehension: [{ term: "Main idea", definition: "What the passage is mostly about." }, { term: "Title", definition: "A short name capturing the passage's message." }],
    Tenses: [{ term: "Present tense", definition: "Happening now, e.g. she goes." }, { term: "Past tense", definition: "Already happened, e.g. she went." }]
  },
  "Intermediate Science": {
    "Living Things": [{ term: "Organism", definition: "Any living thing, plant or animal." }, { term: "Habitat", definition: "Where an organism naturally lives." }],
    Matter: [{ term: "Solid", definition: "Fixed shape and volume." }, { term: "Evaporation", definition: "Liquid turning to gas at the surface." }],
    Energy: [{ term: "Energy", definition: "Ability to do work." }, { term: "Solar energy", definition: "Energy from the sun." }]
  },
  "Social and Citizenship Studies": {
    "Rights & Duties": [{ term: "Right", definition: "What the law allows you to enjoy." }, { term: "Duty", definition: "What the law expects from you." }],
    "National Symbols": [{ term: "Coat of arms", definition: "Nigeria's official emblem of authority." }, { term: "Anthem", definition: "The national song of unity." }],
    Honesty: [{ term: "Integrity", definition: "Doing right even when unseen." }, { term: "Corruption", definition: "Dishonest use of position for gain." }]
  },
  "Physical Health Education": {
    Fitness: [{ term: "Warm-up", definition: "Gentle exercise preparing the body." }, { term: "Stamina", definition: "Ability to keep going without tiring fast." }],
    Safety: [{ term: "First aid", definition: "Immediate help given before a doctor arrives." }, { term: "Posture", definition: "How you hold your body sitting or standing." }],
    Nutrition: [{ term: "Balanced diet", definition: "Food with all nutrients in right amounts." }, { term: "Malnutrition", definition: "Sickness from poor feeding." }]
  },
  "Nigerian History": {
    "Early Nigerian Kingdoms": [{ term: "Nok culture", definition: "One of Nigeria's oldest cultures, known for terracotta figures and early iron working." }, { term: "Oba", definition: "The title of the ruler of Benin Kingdom." }],
    "Colonial Rule": [{ term: "Amalgamation", definition: "The 1914 joining of the Northern and Southern Protectorates by Lord Lugard." }, { term: "Indirect rule", definition: "Governing through traditional rulers and native authorities." }],
    "Independence and Nationhood": [{ term: "Nationalism", definition: "The movement to win self-government and independence." }, { term: "Republic", definition: "A state with an elected president instead of a monarch." }]
  },
  "Business Studies": {
    "Business and Its Environment": [{ term: "Business", definition: "Any activity that produces or sells goods and services to satisfy needs." }, { term: "Profit", definition: "Income left after all business costs are paid." }],
    "Home Trade": [{ term: "Wholesaler", definition: "Middleman who buys in bulk and sells in smaller quantities to retailers." }, { term: "Retailer", definition: "Middleman who sells directly to final consumers." }],
    "Book-keeping": [{ term: "Assets", definition: "Things the business owns, such as cash, stock and buildings." }, { term: "Liabilities", definition: "Money the business owes to others." }]
  }
};

export type GlossaryTerm = { term: string; definition: string };

// Built-in key terms per topic (PRD: glossary lives in the syllabus map).
export const GLOSSARY: Record<string, Record<string, GlossaryTerm[]>> = {
  "English Studies": {
    Comprehension: [
      { term: "Main idea", definition: "The central point a passage is making; every other sentence supports it." },
      { term: "Inference", definition: "A conclusion drawn from evidence in the text, not stated word for word." }
    ],
    Synonyms: [
      { term: "Synonym", definition: "A word with the same or nearly the same meaning as another." },
      { term: "Context clue", definition: "Surrounding words that hint at an unknown word's meaning." }
    ],
    Antonyms: [
      { term: "Antonym", definition: "A word opposite in meaning to another." },
      { term: "Prefix negation", definition: "Prefixes like un-, in-, dis- that reverse a word's meaning." }
    ],
    Tenses: [
      { term: "Present simple", definition: "Used for habits and facts; third-person singular adds -s (she goes)." },
      { term: "Concord", definition: "Agreement between subject and verb in number and person." }
    ],
    Lexis: [
      { term: "Register", definition: "Words suited to a particular situation or field." },
      { term: "Idiom", definition: "An expression whose meaning differs from its literal words." }
    ],
    Idioms: [
      { term: "Let the cat out of the bag", definition: "To reveal a secret by mistake." },
      { term: "Hit the nail on the head", definition: "To say exactly the right thing." }
    ]
  },
  Mathematics: {
    "Quadratic equations": [
      { term: "Factorisation", definition: "Writing an expression as a product of brackets, e.g. (x−2)(x−3)." },
      { term: "Roots", definition: "Values of x that satisfy the equation (where the graph crosses the axis)." }
    ],
    "Linear equations": [
      { term: "Coefficient", definition: "The number multiplying a variable, e.g. 3 in 3x." },
      { term: "Transpose", definition: "Move a term across = with the sign flipped." }
    ],
    Percentages: [
      { term: "Percent", definition: "Per hundred; 20% of 250 = 0.20 × 250." },
      { term: "Percentage change", definition: "(Change ÷ original) × 100%." }
    ],
    Geometry: [
      { term: "Hypotenuse", definition: "Longest side of a right triangle, opposite the right angle." },
      { term: "Similar figures", definition: "Same shape, proportional sides, equal angles." }
    ]
  },
  "Christian Religious Studies": {
    "Creation and the Fall": [
      { term: "Creation", definition: "God's making of the heavens, earth and all living things." },
      { term: "The Fall", definition: "Adam and Eve's disobedience that brought sin into the world." }
    ],
    "The Life of Jesus": [
      { term: "Incarnation", definition: "The belief that God became human in Jesus Christ." },
      { term: "Disciples", definition: "Followers of Jesus who learned from and spread his teaching." }
    ],
    "Christian Values and Ethics": [
      { term: "Love", definition: "The greatest Christian virtue: caring for God and for others." },
      { term: "Forgiveness", definition: "Letting go of a wrong done to you, as God forgives." }
    ],
    "The Early Church": [
      { term: "Pentecost", definition: "The day the Holy Spirit came upon the apostles." },
      { term: "Apostle", definition: "A messenger sent to spread the gospel." }
    ]
  },
  "Civic Education": {
    Citizenship: [
      { term: "Citizen", definition: "A legally recognised member of a state with rights and duties." },
      { term: "Allegiance", definition: "Loyalty owed to one's country." }
    ],
    "Human Rights": [
      { term: "Human rights", definition: "Basic freedoms every person has from birth." },
      { term: "UDHR", definition: "Universal Declaration of Human Rights, adopted in 1948." }
    ],
    "Democracy and Elections": [
      { term: "Democracy", definition: "Government of the people, by the people, for the people." },
      { term: "Franchise", definition: "The right to vote in elections." }
    ],
    "Rule of Law": [
      { term: "Rule of law", definition: "Everyone, including leaders, is subject to the law." },
      { term: "Due process", definition: "Fair legal steps that protect a person's rights." }
    ],
    "National Values": [
      { term: "Integrity", definition: "Doing what is right even when nobody is watching." },
      { term: "Patriotism", definition: "Love for and loyalty to one's country." }
    ]
  },
  Geography: {
    "The Earth and Its Structure": [
      { term: "Crust", definition: "The outermost solid layer of the Earth." },
      { term: "Lithosphere", definition: "The crust plus the rigid upper part of the mantle." }
    ],
    "Map Reading": [
      { term: "Scale", definition: "Ratio between distance on a map and distance on the ground." },
      { term: "Contour", definition: "Line joining points of equal height above sea level." }
    ],
    "Weather and Climate": [
      { term: "Weather", definition: "Atmospheric conditions over a short period." },
      { term: "Climate", definition: "Average weather of a place over many years." }
    ],
    Population: [
      { term: "Population density", definition: "Number of people per unit area." },
      { term: "Migration", definition: "Movement of people from one place to another." }
    ],
    "Regional Geography of Nigeria": [
      { term: "Savanna", definition: "Tropical grassland with scattered trees." },
      { term: "Rainforest", definition: "Dense forest with heavy year-round rainfall." }
    ]
  },
  "Digital Technologies": {
    "Computer Fundamentals": [
      { term: "Hardware", definition: "The physical parts of a computer you can touch." },
      { term: "Software", definition: "Programs and instructions that tell the computer what to do." }
    ],
    "Word Processing": [
      { term: "Word processor", definition: "Software for creating and editing text documents." },
      { term: "Formatting", definition: "Changing how text looks: font, size, bold, alignment." }
    ],
    Spreadsheets: [
      { term: "Cell", definition: "The box where a row and column meet in a spreadsheet." },
      { term: "Formula", definition: "An instruction that calculates a value, e.g. =SUM(A1:A5)." }
    ],
    "Internet and Email": [
      { term: "Browser", definition: "Software used to view pages on the internet." },
      { term: "Email address", definition: "A unique name used to send and receive electronic mail." }
    ],
    "Programming Basics": [
      { term: "Algorithm", definition: "A step-by-step set of instructions to solve a problem." },
      { term: "Variable", definition: "A named store for a value in a program." }
    ]
  },
  Physics: {
    Motion: [
      { term: "Velocity", definition: "Speed in a stated direction; a vector quantity." },
      { term: "Acceleration", definition: "Rate of change of velocity, v = u + at." }
    ],
    Waves: [
      { term: "Transverse wave", definition: "Vibration perpendicular to travel, e.g. light." },
      { term: "Longitudinal wave", definition: "Vibration parallel to travel, e.g. sound." }
    ],
    Electricity: [
      { term: "Current", definition: "Rate of flow of charge, measured in amperes." },
      { term: "Ohm's law", definition: "V = IR: voltage equals current times resistance." }
    ]
  },
  Chemistry: {
    "Atomic structure": [
      { term: "Atomic number", definition: "Number of protons; defines the element." },
      { term: "Isotope", definition: "Same protons, different neutrons." }
    ],
    "Periodic table": [
      { term: "Group", definition: "Vertical column; same number of valence electrons." },
      { term: "Period", definition: "Horizontal row; same number of electron shells." }
    ],
    "Acids and bases": [
      { term: "Strong acid", definition: "Ionises fully in water, e.g. HCl." },
      { term: "pH scale", definition: "0–14 measure of acidity; below 7 is acidic." }
    ]
  },
  Biology: {
    Cells: [
      { term: "Mitochondrion", definition: "Releases energy (ATP); powerhouse of the cell." },
      { term: "Chloroplast", definition: "Site of photosynthesis in plant cells." }
    ],
    "Transport in plants": [
      { term: "Xylem", definition: "Carries water and minerals upward." },
      { term: "Transpiration", definition: "Water loss from leaves driving upward pull." }
    ],
    Ecology: [
      { term: "Ecosystem", definition: "Community plus its environment interacting." },
      { term: "Biotic", definition: "Living components, e.g. plants, animals." }
    ]
  },
  Commerce: {
    Trade: [
      { term: "Retailer", definition: "Middleman selling small quantities to final consumers." },
      { term: "Break of bulk", definition: "Retailer function: splitting wholesale packs into small units." }
    ],
    "Business units": [
      { term: "Partnership", definition: "Business owned by 2–20 people sharing capital and risk." },
      { term: "Liability", definition: "Who pays business debts — limited or unlimited." }
    ]
  },
  Economics: {
    "Demand and supply": [
      { term: "First law of demand", definition: "Price rises → quantity demanded falls, all things equal." },
      { term: "Equilibrium", definition: "Price where quantity demanded equals quantity supplied." }
    ],
    "Scale of preference": [
      { term: "Opportunity cost", definition: "The forgone alternative when a choice is made." },
      { term: "Scarcity", definition: "Wants exceed resources — the reason choice exists." }
    ],
    Inflation: [
      { term: "Inflation", definition: "Sustained rise in the general price level." },
      { term: "Purchasing power", definition: "What a fixed income can actually buy; inflation shrinks it." }
    ]
  },
  Government: {
    Democracy: [
      { term: "Franchise", definition: "The right to vote in elections." },
      { term: "Rule of law", definition: "Everyone, including leaders, obeys the law." }
    ],
    Federalism: [
      { term: "Federalism", definition: "Constitutional sharing of power between centre and states." },
      { term: "Concurrent list", definition: "Powers shared by federal and state governments." }
    ]
  },
  "Literature in English": {
    Prose: [
      { term: "Novel", definition: "Extended fictional narrative in prose." },
      { term: "Theme", definition: "The central idea running through a work." }
    ],
    Drama: [
      { term: "Climax", definition: "Turning point; peak of the plot's conflict." },
      { term: "Protagonist", definition: "The central character of a play or story." }
    ],
    Poetry: [
      { term: "Imagery", definition: "Vivid sensory language painting mental pictures." },
      { term: "Metaphor", definition: "Direct comparison without like or as." }
    ]
  }
};
