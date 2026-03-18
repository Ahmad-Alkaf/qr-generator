import { randomBytes } from "crypto";

export function generateShortCode(length = 8): string {
  return randomBytes(length)
    .toString("base64url")
    .slice(0, length);
}
