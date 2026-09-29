import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

// Password hashing with zero dependencies (Node built-in scrypt).
// Format: scrypt$<salt-hex>$<hash-hex>
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expected] = parts;
  const actual = scryptSync(password, salt, 64);
  const buf = Buffer.from(expected, "hex");
  return buf.length === actual.length && timingSafeEqual(buf, actual);
}
