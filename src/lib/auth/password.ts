import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";

const ALGORITHM = "sha256";
const ITERATIONS = 310_000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const VERSION = "pbkdf2_sha256";

type DerivedKey = Buffer;

function deriveKey(password: string, salt: Buffer): Promise<DerivedKey> {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, ALGORITHM, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await deriveKey(password, salt);

  return [
    VERSION,
    String(ITERATIONS),
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [version, iterationsValue, saltValue, hashValue] = encodedHash.split("$");

  if (version !== VERSION || !iterationsValue || !saltValue || !hashValue) {
    return false;
  }

  const iterations = Number(iterationsValue);
  if (!Number.isSafeInteger(iterations) || iterations < 1) {
    return false;
  }

  const salt = Buffer.from(saltValue, "base64url");
  const expected = Buffer.from(hashValue, "base64url");

  if (salt.length !== SALT_LENGTH || expected.length !== KEY_LENGTH) {
    return false;
  }

  const actual = await new Promise<Buffer>((resolve, reject) => {
    pbkdf2(password, salt, iterations, KEY_LENGTH, ALGORITHM, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key);
    });
  });

  return timingSafeEqual(actual, expected);
}
