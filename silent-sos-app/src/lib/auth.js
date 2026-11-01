const ACCOUNTS_KEY = "haven-demo-accounts-v1";
const iterations = 120000;
const encode = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
const decode = (hex) =>
  new Uint8Array(hex.match(/.{2}/g).map((byte) => parseInt(byte, 16)));
export function readAccounts(storage = localStorage) {
  try {
    const value = JSON.parse(storage.getItem(ACCOUNTS_KEY) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (a) =>
            a &&
            typeof a.id === "string" &&
            typeof a.email === "string" &&
            typeof a.hash === "string" &&
            /^[a-f0-9]{32}$/.test(a.salt || ""),
        )
      : [];
  } catch {
    return [];
  }
}
export async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle)
    throw new Error(
      "Account demos require HTTPS or localhost in a browser with Web Crypto support.",
    );
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const result = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: decode(salt), iterations },
    material,
    256,
  );
  return encode(new Uint8Array(result));
}
export async function registerAccount(
  { name, email, password },
  storage = localStorage,
) {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanName) throw new Error("Enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
    throw new Error("Enter a valid email address.");
  if (password.length < 8)
    throw new Error("Use at least 8 characters for your demo password.");
  if (readAccounts(storage).some((a) => a.email === cleanEmail))
    throw new Error(
      "A local demo account already uses this email. Try signing in.",
    );
  const salt = encode(crypto.getRandomValues(new Uint8Array(16)));
  const account = {
    id: crypto.randomUUID(),
    name: cleanName,
    email: cleanEmail,
    salt,
    hash: await hashPassword(password, salt),
    role: "member",
  };
  // Read again after the asynchronous hash to avoid overwriting another registration.
  const accounts = readAccounts(storage);
  if (accounts.some((a) => a.email === cleanEmail))
    throw new Error("A local demo account already uses this email.");
  storage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: "member",
  };
}
export async function signInAccount(email, password, storage = localStorage) {
  const account = readAccounts(storage).find(
    (a) => a.email === email.trim().toLowerCase(),
  );
  if (!account || (await hashPassword(password, account.salt)) !== account.hash)
    throw new Error(
      "Email or password doesn’t match a demo account on this browser.",
    );
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: "member",
  };
}
export function removeAccount(id, storage = localStorage) {
  storage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify(readAccounts(storage).filter((a) => a.id !== id)),
  );
}
