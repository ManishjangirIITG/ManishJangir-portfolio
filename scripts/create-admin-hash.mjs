import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];
const ITERATIONS = 310_000;
const KEY_LENGTH = 32;

if (!password || password.length < 12) {
  console.error("Usage: node scripts/create-admin-hash.mjs '<password>'");
  console.error("Password must contain at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const key = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, "sha256");

console.log(
  `ADMIN_PASSWORD_HASH=pbkdf2_sha256$${ITERATIONS}$${salt.toString("base64url")}$${key.toString("base64url")}`,
);
