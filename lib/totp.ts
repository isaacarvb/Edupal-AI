// TOTP (Time-based One-Time Password) helper — RFC 6238
import { createHmac } from "crypto";

function base32decode(str: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0, value = 0, output = new Uint8Array(Math.floor((str.length * 5) / 8)), bi = 0;
  for (let i = 0; i < str.length; i++) {
    const v = alphabet.indexOf(str[i].toUpperCase());
    if (v < 0) continue;
    bits = (bits << 5) | v;
    value += 5;
    if (value >= 8) {
      output[bi++] = (value >>> (value - 8)) & 0xFF;
      value -= 8;
    }
  }
  return output;
}

export function totpSecret(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let s = "";
  for (let i = 0; i < 32; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export function totpVerify(secret: string, token: string, window = 1): boolean {
  const key = base32decode(secret);
  const time = Math.floor(Date.now() / 1000 / 30);
  for (let offset = -window; offset <= window; offset++) {
    const counter = time + offset;
    const counterBuffer = new Uint8Array(8);
    let counterValue = counter;
    for (let i = 7; i >= 0; i--) counterBuffer[i] = counterValue & 0xFF, counterValue >>>= 8;

    const hmac = createHmac("sha1", key).update(counterBuffer).digest();
    const offsetByte = hmac[hmac.length - 1] & 0x0F;
    const binary = ((hmac[offsetByte] & 0x7F) << 24) |
      ((hmac[offsetByte + 1] & 0xFF) << 16) |
      ((hmac[offsetByte + 2] & 0xFF) << 8) |
      (hmac[offsetByte + 3] & 0xFF);
    const otp = (binary % 1000000).toString().padStart(6, "0");
    return otp === token;
  }
  return false;
}
