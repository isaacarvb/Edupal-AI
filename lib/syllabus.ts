// WAEC/JAMB Day-1 syllabus map (PRD §9 + §8 anti-hallucination).
// Single source of truth for subject lists; AI questions must stay inside these topics.
export const SUBJECTS = [
  "English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Commerce",
  "Economics",
  "Government",
  "Literature"
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const SYLLABUS: Record<Subject, string[]> = {
  English: ["Comprehension", "Synonyms", "Antonyms", "Tenses", "Lexis", "Idioms"],
  Mathematics: ["Quadratic equations", "Linear equations", "Percentages", "Geometry"],
  Physics: ["Motion", "Waves", "Electricity"],
  Chemistry: ["Atomic structure", "Periodic table", "Acids and bases"],
  Biology: ["Cells", "Transport in plants", "Ecology"],
  Commerce: ["Trade", "Business units"],
  Economics: ["Demand and supply", "Scale of preference", "Inflation"],
  Government: ["Democracy", "Federalism"],
  Literature: ["Prose", "Drama", "Poetry"]
};

export function topicAllowed(subject: string, topic: string): boolean {
  const list = (SYLLABUS as Record<string, string[]>)[subject];
  return !!list && list.includes(topic);
}

// Junior Secondary tier (curriculum hub). Question banks grow here next.
export const JSS_SUBJECTS = [
  "Mathematics",
  "English",
  "Intermediate Science",
  "Citizenship Education",
  "Physical Health Education"
] as const;

export const JSS_SYLLABUS: Record<string, string[]> = {
  Mathematics: ["Fractions", "Basic Algebra", "Geometry Basics"],
  English: ["Parts of Speech", "Comprehension", "Tenses"],
  "Intermediate Science": ["Living Things", "Matter", "Energy"],
  "Citizenship Education": ["Rights & Duties", "National Symbols", "Honesty"],
  "Physical Health Education": ["Fitness", "Safety", "Nutrition"]
};

export const JSS_GLOSSARY: Record<string, Record<string, { term: string; definition: string }[]>> = {
  Mathematics: {
    Fractions: [{ term: "Numerator", definition: "Top number of a fraction; counts the parts taken." }, { term: "Equivalent fractions", definition: "Different fractions with equal value, e.g. 1/2 = 2/4." }],
    "Basic Algebra": [{ term: "Variable", definition: "A letter standing for an unknown number." }, { term: "Simplify", definition: "Collect like terms into the shortest form." }],
    "Geometry Basics": [{ term: "Angle", definition: "Amount of turn between two lines meeting at a point." }, { term: "Perimeter", definition: "Total distance round a shape." }]
  },
  English: {
    "Parts of Speech": [{ term: "Noun", definition: "Naming word for people, places, things." }, { term: "Verb", definition: "Action or doing word." }],
    Comprehension: [{ term: "Main idea", definition: "What the passage is mostly about." }, { term: "Title", definition: "A short name capturing the passage's message." }],
    Tenses: [{ term: "Present tense", definition: "Happening now, e.g. she goes." }, { term: "Past tense", definition: "Already happened, e.g. she went." }]
  },
  "Intermediate Science": {
    "Living Things": [{ term: "Organism", definition: "Any living thing, plant or animal." }, { term: "Habitat", definition: "Where an organism naturally lives." }],
    Matter: [{ term: "Solid", definition: "Fixed shape and volume." }, { term: "Evaporation", definition: "Liquid turning to gas at the surface." }],
    Energy: [{ term: "Energy", definition: "Ability to do work." }, { term: "Solar energy", definition: "Energy from the sun." }]
  },
  "Citizenship Education": {
    "Rights & Duties": [{ term: "Right", definition: "What the law allows you to enjoy." }, { term: "Duty", definition: "What the law expects from you." }],
    "National Symbols": [{ term: "Coat of arms", definition: "Nigeria's official emblem of authority." }, { term: "Anthem", definition: "The national song of unity." }],
    Honesty: [{ term: "Integrity", definition: "Doing right even when unseen." }, { term: "Corruption", definition: "Dishonest use of position for gain." }]
  },
  "Physical Health Education": {
    Fitness: [{ term: "Warm-up", definition: "Gentle exercise preparing the body." }, { term: "Stamina", definition: "Ability to keep going without tiring fast." }],
    Safety: [{ term: "First aid", definition: "Immediate help given before a doctor arrives." }, { term: "Posture", definition: "How you hold your body sitting or standing." }],
    Nutrition: [{ term: "Balanced diet", definition: "Food with all nutrients in right amounts." }, { term: "Malnutrition", definition: "Sickness from poor feeding." }]
  }
};

export type GlossaryTerm = { term: string; definition: string };

// Built-in key terms per topic (PRD: glossary lives in the syllabus map).
export const GLOSSARY: Record<string, Record<string, GlossaryTerm[]>> = {
  English: {
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
  Literature: {
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
