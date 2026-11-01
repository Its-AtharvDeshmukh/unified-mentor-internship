import test from "node:test";
import assert from "node:assert/strict";
import {
  createAlert,
  acknowledgeAlert,
  resolveAlert,
} from "../src/lib/alerts.js";
const contacts = [{ id: "one", name: "Test Contact", channel: "SMS" }];
test("alert captures recipients and location without modifying source data", () => {
  const position = { latitude: 12, longitude: 77, accuracy: 25 };
  const alert = createAlert(contacts, position, 1000);
  assert.equal(alert.status, "sent");
  assert.equal(alert.demo, true);
  assert.equal(alert.createdAt, 1000);
  contacts[0].channel = "Email";
  position.latitude = 14;
  assert.equal(alert.contacts[0].channel, "SMS");
  assert.equal(alert.location.latitude, 12);
});
test("missing GPS never fabricates a location", () => {
  const alert = createAlert(contacts, null, 1000);
  assert.equal(alert.location, null);
  assert.match(alert.events[1].text, /unavailable/);
});
test("unknown and repeated acknowledgments do not create false events", () => {
  const original = createAlert(contacts, null, 1000);
  assert.equal(acknowledgeAlert(original, "unknown", 1500), original);
  const updated = acknowledgeAlert(original, "one", 2000);
  assert.equal(updated.status, "acknowledged");
  assert.equal(updated.acknowledgedAt, 2000);
  assert.equal(updated.events.length, 3);
  assert.equal(acknowledgeAlert(updated, "one", 3000), updated);
  assert.equal(original.status, "sent");
});
test("resolved is terminal and resolution is idempotent", () => {
  const original = createAlert(contacts, null, 1000);
  const resolved = resolveAlert(original, 4000);
  assert.equal(resolved.status, "resolved");
  assert.equal(resolved.resolvedAt, 4000);
  assert.equal(acknowledgeAlert(resolved, "one", 5000), resolved);
  assert.equal(resolveAlert(resolved, 6000), resolved);
});
test("response timing preserves the first acknowledgment", () => {
  const original = createAlert(
    [...contacts, { id: "two", name: "Second", channel: "Email" }],
    null,
    1000,
  );
  const first = acknowledgeAlert(original, "one", 2000);
  const second = acknowledgeAlert(first, "two", 4000);
  assert.equal(second.acknowledgedAt, 2000);
  assert.equal(second.contacts.filter((c) => c.acknowledged).length, 2);
});
