import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Self-contained (no TS imports): opens ./dev.db, applies db/schema.sql, seeds 2 curated questions.
const root = process.cwd();
const db = new DatabaseSync(path.join(root, process.env.DB_FILE ?? "dev.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec(fs.readFileSync(path.join(root, "db", "schema.sql"), "utf8"));

const seed = [
  {
    exam: "JAMB", subject: "Mathematics", topic: "Quadratic equations", type: "MCQ",
    stem: "Solve: x^2 - 5x + 6 = 0",
    options: ["2, 3", "1, 6", "-2, -3", "5, 6"],
    answer: "2, 3", rubric: "Factorise to (x-2)(x-3).", source: "CURATED", predicted: 1
  },
  {
    exam: "WAEC", subject: "English", topic: "Comprehension", type: "MCQ",
    stem: "Choose the correctly spelt word.",
    options: ["Occassion", "Occasion", "Ocassion", "Ocasion"],
    answer: "Occasion", rubric: "Standard spelling.", source: "CURATED", predicted: 0
  },
  // NOTE: below are AI-template placeholders (source AI). Replace with licensed
  // real past questions before the pilot. Same shape, so no code changes needed.
  {
    exam: "JAMB", subject: "Mathematics", topic: "Linear equations", type: "MCQ",
    stem: "If 3x + 5 = 20, find x.",
    options: ["3", "5", "7", "15"],
    answer: "5", rubric: "3x = 15, so x = 5.", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Mathematics", topic: "Percentages", type: "MCQ",
    stem: "What is 20% of 250?",
    options: ["25", "40", "50", "75"],
    answer: "50", rubric: "0.20 x 250 = 50.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Mathematics", topic: "Quadratic equations", type: "THEORY",
    stem: "Solve x^2 - 5x + 6 = 0 by factorisation, showing all steps.",
    options: [], answer: "(x-2)(x-3) = 0, so x = 2 or x = 3",
    rubric: "Correct factors (2), correct solutions (2).", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "English", topic: "Synonyms", type: "MCQ",
    stem: "Choose the word nearest in meaning to BRAVE.",
    options: ["Timid", "Courageous", "Weak", "Gentle"],
    answer: "Courageous", rubric: "Brave = showing courage.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "English", topic: "Antonyms", type: "MCQ",
    stem: "Choose the word opposite in meaning to SCARCE.",
    options: ["Rare", "Abundant", "Costly", "Little"],
    answer: "Abundant", rubric: "Scarce = in short supply; opposite is abundant.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "English", topic: "Tenses", type: "MCQ",
    stem: "She ___ to school every day.",
    options: ["go", "goes", "going", "gone"],
    answer: "goes", rubric: "Third-person singular present takes -s.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "English", topic: "Comprehension", type: "THEORY",
    stem: "In two sentences, explain the main idea of a passage about exam preparation.",
    options: [], answer: "Model answer: preparation beats cramming; targeted practice fixes weak topics.",
    rubric: "Main idea stated (2), supporting detail (2).", source: "AI", predicted: 0
  },
  // --- Phase 6: starter banks for all 9 Day-1 subjects (AI templates; replace
  // with licensed past questions before the pilot — same shape, no code change).
  {
    exam: "WAEC", subject: "Physics", topic: "Motion", type: "MCQ",
    stem: "A car accelerates from rest at 2 m/s² for 5 s. Final velocity?",
    options: ["5 m/s", "10 m/s", "7 m/s", "2.5 m/s"],
    answer: "10 m/s", rubric: "v = u + at = 0 + 2×5.", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Physics", topic: "Motion", type: "MCQ",
    stem: "Which quantity is a vector?",
    options: ["Speed", "Distance", "Velocity", "Time"],
    answer: "Velocity", rubric: "Vectors have magnitude + direction.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Physics", topic: "Waves", type: "THEORY",
    stem: "State two differences between transverse and longitudinal waves, with one example of each.",
    options: [], answer: "Model answer: transverse vibrates perpendicular (e.g. light); longitudinal vibrates parallel (e.g. sound).",
    rubric: "Vibration direction (2), one correct example each (2).", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Chemistry", topic: "Atomic structure", type: "MCQ",
    stem: "The atomic number of an element equals the number of ___.",
    options: ["Neutrons", "Protons", "Electrons + neutrons", "Isotopes"],
    answer: "Protons", rubric: "Atomic number = proton count.", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Chemistry", topic: "Periodic table", type: "MCQ",
    stem: "Elements in the same group have the same number of ___.",
    options: ["Electron shells", "Valence electrons", "Neutrons", "Isotopes"],
    answer: "Valence electrons", rubric: "Group = valence electron count.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Chemistry", topic: "Acids and bases", type: "THEORY",
    stem: "Explain, with one example, the difference between a strong acid and a weak acid.",
    options: [], answer: "Model answer: strong acids ionise fully (e.g. HCl); weak acids partly (e.g. ethanoic acid).",
    rubric: "Ionisation difference (2), correct examples (2).", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Biology", topic: "Cells", type: "MCQ",
    stem: "Which organelle is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
    answer: "Mitochondrion", rubric: "Mitochondria release energy (ATP).", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Biology", topic: "Transport in plants", type: "MCQ",
    stem: "Water moves from roots to leaves mainly through the ___.",
    options: ["Phloem", "Xylem", "Cambium", "Cortex"],
    answer: "Xylem", rubric: "Xylem transports water + minerals upward.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Biology", topic: "Ecology", type: "THEORY",
    stem: "Define an ecosystem and name its two main components with one example of each.",
    options: [], answer: "Model answer: community + environment; biotic (e.g. grass) and abiotic (e.g. sunlight).",
    rubric: "Definition (2), two components + examples (2).", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Commerce", topic: "Trade", type: "MCQ",
    stem: "The middleman between wholesaler and consumer is the ___.",
    options: ["Producer", "Retailer", "Broker", "Agent"],
    answer: "Retailer", rubric: "Retailers sell in small quantities to final consumers.", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Commerce", topic: "Business units", type: "MCQ",
    stem: "One major advantage of a partnership over sole proprietorship is ___.",
    options: ["Limited liability", "More capital and shared ideas", "No registration", "Perpetual existence"],
    answer: "More capital and shared ideas", rubric: "Partners pool capital and skills.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Commerce", topic: "Trade", type: "THEORY",
    stem: "State four functions of a retailer in the distribution chain.",
    options: [], answer: "Model answer: breaks bulk, stocks variety, grants credit, offers after-sales advice.",
    rubric: "One mark per correct function, max four.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Economics", topic: "Demand and supply", type: "MCQ",
    stem: "The first law of demand states that, all things equal, quantity demanded ___.",
    options: ["Rises as price rises", "Falls as price rises", "Stays constant", "Equals supply always"],
    answer: "Falls as price rises", rubric: "Inverse price–demand relationship.", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Economics", topic: "Scale of preference", type: "MCQ",
    stem: "A scale of preference is important because it ___.",
    options: ["Increases income", "Ensures rational choice with limited resources", "Fixes prices", "Removes scarcity"],
    answer: "Ensures rational choice with limited resources", rubric: "Ranking wants guides choice under scarcity.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Economics", topic: "Inflation", type: "THEORY",
    stem: "Define inflation and state two of its effects on fixed-income earners.",
    options: [], answer: "Model answer: sustained rise in general prices; reduces purchasing power and real savings.",
    rubric: "Definition (2), two correct effects (2).", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Government", topic: "Democracy", type: "MCQ",
    stem: "A major feature of democracy is ___.",
    options: ["One-party rule", "Periodic free elections", "Military decrees", "Hereditary succession"],
    answer: "Periodic free elections", rubric: "Democracy = rule by consent, expressed via elections.", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Government", topic: "Federalism", type: "MCQ",
    stem: "Nigeria operates a federal system, which means power is ___.",
    options: ["Held only by the centre", "Shared between centre and states", "Held by the military", "Hereditary"],
    answer: "Shared between centre and states", rubric: "Federalism divides power constitutionally.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Government", topic: "Democracy", type: "THEORY",
    stem: "Explain two ways citizens can participate in democratic governance beyond voting.",
    options: [], answer: "Model answer: joining parties/pressure groups and contesting or debating public issues.",
    rubric: "One mark per valid means + explanation.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Literature", topic: "Prose", type: "MCQ",
    stem: "A long fictional narrative in prose is a ___.",
    options: ["Novella outline", "Novel", "Epic poem", "Play"],
    answer: "Novel", rubric: "Novel = extended prose fiction.", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Literature", topic: "Drama", type: "MCQ",
    stem: "The turning point in a play's plot is the ___.",
    options: ["Exposition", "Climax", "Prologue", "Epilogue"],
    answer: "Climax", rubric: "Climax = peak of conflict.", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "Literature", topic: "Poetry", type: "THEORY",
    stem: "Define imagery and identify two types, each with a short example.",
    options: [], answer: "Model answer: vivid sensory language; e.g. visual ('golden sun') and auditory ('whispering wind').",
    rubric: "Definition (2), two types + examples (2).", source: "AI", predicted: 0
  },
  // --- Batch 2: deepen banks so a full 10Q diagnostic fits (still AI templates).
  {
    exam: "JAMB", subject: "English", topic: "Lexis", type: "MCQ",
    stem: "Choose the correctly spelt word.",
    options: ["Embarass", "Embarrass", "Embaras", "Embarras"],
    answer: "Embarrass", rubric: "Double r, double s.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "English", topic: "Concord", type: "MCQ",
    stem: "Neither the teacher nor the students ___ present.",
    options: ["was", "were", "is", "has been"],
    answer: "were", rubric: "Verb agrees with nearer subject (students).", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "English", topic: "Idioms", type: "MCQ",
    stem: "'To bite the dust' means to ___.",
    options: ["Eat quickly", "Fail or be defeated", "Work hard", "Travel far"],
    answer: "Fail or be defeated", rubric: "Idiom meaning.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "English", topic: "Comprehension", type: "MCQ",
    stem: "A passage states roads are bad 'despite yearly budgets'. The implied problem is ___.",
    options: ["Low budgets", "Poor maintenance culture", "Too many cars", "Bad weather"],
    answer: "Poor maintenance culture", rubric: "Inference from contrast.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "English", topic: "Tenses", type: "THEORY",
    stem: "Rewrite in past perfect: 'She finishes her homework before dinner.'",
    options: [], answer: "Model answer: She had finished her homework before dinner.",
    rubric: "Had + past participle (2), time clause kept (2).", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Mathematics", topic: "Geometry", type: "MCQ",
    stem: "The sum of interior angles of a triangle is ___.",
    options: ["90°", "180°", "270°", "360°"],
    answer: "180°", rubric: "Triangle angle sum theorem.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Mathematics", topic: "Linear equations", type: "MCQ",
    stem: "If 2y - 7 = 11, y equals ___.",
    options: ["2", "7", "9", "18"],
    answer: "9", rubric: "2y = 18, so y = 9.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Mathematics", topic: "Percentages", type: "THEORY",
    stem: "A shirt costs ₦5,000 after a 20% discount. What was the original price? Show steps.",
    options: [], answer: "Model answer: 80% = 5000, so 100% = 5000/0.8 = ₦6,250.",
    rubric: "Correct method (2), correct price (2).", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Mathematics", topic: "Quadratic equations", type: "MCQ",
    stem: "The roots of x² - 9 = 0 are ___.",
    options: ["3 only", "-3 only", "3 and -3", "9 and -9"],
    answer: "3 and -3", rubric: "Difference of two squares.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Physics", topic: "Electricity", type: "MCQ",
    stem: "Ohm's law states V equals ___.",
    options: ["I/R", "I×R", "R/I", "I²R"],
    answer: "I×R", rubric: "V = IR.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Physics", topic: "Motion", type: "THEORY",
    stem: "Define acceleration and state its SI unit, with one road example.",
    options: [], answer: "Model answer: rate of change of velocity; m/s²; e.g. a car speeding from 0 to 20 m/s.",
    rubric: "Definition (2), unit + example (2).", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Chemistry", topic: "Acids and bases", type: "MCQ",
    stem: "The pH of a neutral solution at 25°C is ___.",
    options: ["0", "1", "7", "14"],
    answer: "7", rubric: "Neutral pH is 7.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Chemistry", topic: "Periodic table", type: "THEORY",
    stem: "State the group and period of sodium (atomic number 11) and explain the electronic arrangement.",
    options: [], answer: "Model answer: Group 1, Period 3; arrangement 2,8,1.",
    rubric: "Group + period (2), arrangement (2).", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Biology", topic: "Cells", type: "MCQ",
    stem: "Plant cells differ from animal cells by having ___.",
    options: ["Nucleus", "Cell wall and chloroplasts", "Mitochondria", "Cytoplasm"],
    answer: "Cell wall and chloroplasts", rubric: "Wall + chloroplasts are plant-only.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Biology", topic: "Ecology", type: "THEORY",
    stem: "Construct a simple food chain with four organisms starting from grass.",
    options: [], answer: "Model answer: grass → grasshopper → lizard → hawk.",
    rubric: "Producer first (2), correct feeding order (2).", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Commerce", topic: "Business units", type: "THEORY",
    stem: "State two advantages and two disadvantages of a sole proprietorship.",
    options: [], answer: "Model answer: easy setup, full control; unlimited liability, limited capital.",
    rubric: "One mark per valid point, max four.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Commerce", topic: "Trade", type: "MCQ",
    stem: "Trade by barter has the problem of ___.",
    options: ["Double coincidence of wants", "Money supply", "Inflation", "Taxation"],
    answer: "Double coincidence of wants", rubric: "Both parties must want each other's goods.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Economics", topic: "Inflation", type: "MCQ",
    stem: "During inflation, lenders generally ___.",
    options: ["Gain", "Lose in real terms", "Break even", "Lend more"],
    answer: "Lose in real terms", rubric: "Repaid money buys less.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Economics", topic: "Demand and supply", type: "THEORY",
    stem: "With a labelled diagram description, explain what happens to equilibrium price when demand rises and supply stays fixed.",
    options: [], answer: "Model answer: demand curve shifts right; price and quantity both rise.",
    rubric: "Shift direction (2), price + quantity effect (2).", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Government", topic: "Federalism", type: "THEORY",
    stem: "Give two reasons Nigeria adopted federalism.",
    options: [], answer: "Model answer: manage ethnic diversity and bring government nearer the people.",
    rubric: "One mark per valid reason + explanation.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Government", topic: "Democracy", type: "MCQ",
    stem: "Universal adult suffrage means ___.",
    options: ["Only men vote", "All adults vote", "Only taxpayers vote", "Only graduates vote"],
    answer: "All adults vote", rubric: "Franchise for all qualifying adults.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "Literature", topic: "Poetry", type: "MCQ",
    stem: "A poem of fourteen lines is a ___.",
    options: ["Ballad", "Sonnet", "Elegy", "Ode"],
    answer: "Sonnet", rubric: "Sonnet = 14 lines.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Literature", topic: "Drama", type: "THEORY",
    stem: "Explain the functions of the chorus in classical drama, with reference to any play you know.",
    options: [], answer: "Model answer: comments on action, bridges scenes; e.g. the elders in The Lion and the Jewel.",
    rubric: "Two functions (2), apt reference (2).", source: "AI", predicted: 0
  }
];

const insert = db.prepare(
  `INSERT OR IGNORE INTO questions
   (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

let added = 0;
for (const q of seed) {
  const r = insert.run(
    randomUUID(), q.exam, q.subject, q.topic, q.type, q.stem,
    JSON.stringify(q.options), q.answer, q.rubric, q.source, q.predicted
  );
  added += Number(r.changes);
}
console.log(`Seed done: ${added} new question(s).`);
db.close();
