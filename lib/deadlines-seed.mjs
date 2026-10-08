// Curated deadlines board. Rule: every dated entry verified against a source
// (checked 2026-10-08); anything unconfirmed ships with closes_on NULL = TBC.
// 2026 cycles for JAMB UTME + MTN are CLOSED — kept as history + next-cycle watch.
export const DEADLINES = [
  { kind: "exam", title: "JAMB UTME 2026 registration", detail: "e-PIN vending ended 26 Feb 2026; registration closed 28 Feb 2026. No extension was granted.", source_url: "https://www.jamb.gov.ng/", opens_on: "2026-01-26", closes_on: "2026-02-28" },
  { kind: "exam", title: "JAMB UTME 2027 registration", detail: "Annual window usually opens in January. Dates TBC — watch jamb.gov.ng.", source_url: "https://www.jamb.gov.ng/", opens_on: null, closes_on: null },
  { kind: "scholarship", title: "MTN Foundation Scholarship 2026", detail: "400 awards of ₦300,000/yr (STS, blind students, medical). 2026 portal closed.", source_url: "https://www.mtn.ng/scholarships/", opens_on: null, closes_on: "2026-05-31" },
  { kind: "scholarship", title: "MTN Foundation Scholarship 2027", detail: "Annual scheme for 300-level STEM, 400-level medicine, blind students. Dates TBC.", source_url: "https://www.mtn.ng/scholarships/", opens_on: null, closes_on: null },
  { kind: "scholarship", title: "NNPC–TotalEnergies National Merit Scholarship", detail: "Annual undergraduate merit awards. Check portal for the current cycle.", source_url: null, opens_on: null, closes_on: null },
  { kind: "scholarship", title: "Shell (SPDC) University Scholarship", detail: "For students from Niger Delta states. Check portal for the current cycle.", source_url: null, opens_on: null, closes_on: null },
  { kind: "scholarship", title: "Jim Ovia Scholarship", detail: "Undergraduate funding by the Jim Ovia Foundation. Check portal for the current cycle.", source_url: null, opens_on: null, closes_on: null },
  { kind: "scholarship", title: "Federal Government BEA Scholarship", detail: "Bilateral awards for study abroad. Check the Federal Scholarship Board for the current cycle.", source_url: null, opens_on: null, closes_on: null },
  { kind: "scholarship", title: "NLNG Undergraduate Scholarship", detail: "Annual undergraduate awards. Check portal for the current cycle.", source_url: null, opens_on: null, closes_on: null },
  { kind: "scholarship", title: "Agbami Medical & Engineering Scholarship", detail: "For medicine and engineering students. Check portal for the current cycle.", source_url: null, opens_on: null, closes_on: null }
];
