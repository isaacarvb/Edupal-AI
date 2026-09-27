import nodemailer from "nodemailer";

// Local: Mailpit on localhost:1025. Prod: ZeptoMail SMTP via env.
export function mailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "127.0.0.1",
    port: Number(process.env.SMTP_PORT ?? 1025),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" } : undefined
  });
}
