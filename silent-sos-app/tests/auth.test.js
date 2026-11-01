import test from "node:test";
import assert from "node:assert/strict";
import {
  registerAccount,
  signInAccount,
  readAccounts,
} from "../src/lib/auth.js";
const storage = () => {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) || null,
    setItem: (key, value) => data.set(key, value),
  };
};
test("registration normalizes email and stores a salted hash instead of a password", async () => {
  const db = storage();
  const account = await registerAccount(
    {
      name: "  Demo Member  ",
      email: "  MEMBER@example.com ",
      password: "Example-demo-42",
    },
    db,
  );
  assert.equal(account.name, "Demo Member");
  assert.equal(account.email, "member@example.com");
  assert.equal(account.role, "member");
  assert.equal("hash" in account, false);
  const saved = readAccounts(db)[0];
  assert.equal(saved.hash.length, 64);
  assert.equal(saved.salt.length, 32);
  assert.equal("password" in saved, false);
  assert.notEqual(saved.hash, "Example-demo-42");
});
test("valid sign-in succeeds and wrong credentials fail", async () => {
  const db = storage();
  const user = await registerAccount(
    { name: "Demo", email: "user@example.com", password: "Example-demo-42" },
    db,
  );
  const signedIn = await signInAccount(
    "USER@example.com",
    "Example-demo-42",
    db,
  );
  assert.equal(signedIn.id, user.id);
  await assert.rejects(
    signInAccount("user@example.com", "not-my-password", db),
    /doesn’t match/,
  );
  await assert.rejects(
    signInAccount("missing@example.com", "Example-demo-42", db),
    /doesn’t match/,
  );
});
test("duplicate emails and invalid registrations are rejected", async () => {
  const db = storage();
  await registerAccount(
    { name: "Demo", email: "user@example.com", password: "Example-demo-42" },
    db,
  );
  await assert.rejects(
    registerAccount(
      {
        name: "Duplicate",
        email: "USER@example.com",
        password: "Example-demo-42",
      },
      db,
    ),
    /already uses/,
  );
  await assert.rejects(
    registerAccount({ name: "", email: "bad", password: "a" }, db),
    /name/,
  );
  await assert.rejects(
    registerAccount(
      { name: "Demo", email: "bad", password: "Example-demo-42" },
      db,
    ),
    /email/,
  );
  await assert.rejects(
    registerAccount(
      { name: "Demo", email: "other@example.com", password: "short" },
      db,
    ),
    /8 characters/,
  );
});
test("accounts in separate browser stores cannot authenticate each other", async () => {
  const first = storage(),
    second = storage();
  await registerAccount(
    { name: "Demo", email: "user@example.com", password: "Example-demo-42" },
    first,
  );
  await assert.rejects(
    signInAccount("user@example.com", "Example-demo-42", second),
    /doesn’t match/,
  );
});
