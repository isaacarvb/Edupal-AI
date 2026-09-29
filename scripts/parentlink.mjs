import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("dev.db");
const row = db.prepare("SELECT body FROM email_outbox WHERE kind='parent-welcome' ORDER BY created_at DESC LIMIT 1").get();
console.log(row ? row.body : "NO_LINK_YET");
db.close();
