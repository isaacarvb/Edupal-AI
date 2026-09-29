import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("dev.db");
const users = db.prepare("SELECT id, level, created_at FROM users ORDER BY created_at DESC LIMIT 5").all();
console.log("USERS:", JSON.stringify(users));
const att = db.prepare("SELECT a.user_id AS u, q.subject AS s, COUNT(*) AS n FROM attempts a JOIN questions q ON q.id = a.question_id GROUP BY a.user_id, q.subject").all();
console.log("ATTEMPTS:", JSON.stringify(att));
const bank = db.prepare("SELECT subject, COUNT(*) AS n FROM questions GROUP BY subject").all();
console.log("BANK:", JSON.stringify(bank));
db.close();
