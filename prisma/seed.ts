import { PrismaClient, Exam } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.question.createMany({
    data: [
      {
        exam: Exam.JAMB,
        subject: "Mathematics",
        topic: "Quadratic equations",
        type: "MCQ",
        stem: "Solve: x^2 - 5x + 6 = 0",
        optionsJson: JSON.stringify(["2, 3", "1, 6", "-2, -3", "5, 6"]),
        answerKey: "2, 3",
        markingRubric: "Factorise to (x-2)(x-3).",
        source: "CURATED",
        predictedRepeat: true
      },
      {
        exam: Exam.WAEC,
        subject: "English",
        topic: "Comprehension",
        type: "MCQ",
        stem: "Choose the correctly spelt word.",
        optionsJson: JSON.stringify(["Occassion", "Occasion", "Ocassion", "Ocasion"]),
        answerKey: "Occasion",
        markingRubric: "Standard spelling.",
        source: "CURATED",
        predictedRepeat: false
      }
    ],
    skipDuplicates: true
  });
  console.log("Seeded 2 curated questions.");
}

main().finally(() => prisma.$disconnect());
