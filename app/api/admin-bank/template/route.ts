import { NextResponse } from "next/server";

// Template for curated imports: exam,year,subject,topic,type,stem,options,answer,rubric,predicted
// options = options separated by | (MCQ only). predicted = 1/0.
export async function GET() {
  const csv = [
    "exam,year,subject,topic,type,stem,options,answer,rubric,predicted",
    'WAEC,2023,English,Synonyms,MCQ,Choose the word nearest in meaning to COPIOUS.,"Scarce|Abundant|Costly|Rare",Abundant,Abundant = existing in large quantities.,0',
    'JAMB,2022,Mathematics,Percentages,MCQ,What is 10% of 400?,"20|30|40|50",40,0.10 x 400 = 40.,1'
  ].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=edupal-template.csv" } });
}
