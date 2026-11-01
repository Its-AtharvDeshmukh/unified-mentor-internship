import test from "node:test";
import assert from "node:assert/strict";
import { createGeolocationTracker } from "../src/lib/geolocationTracker.js";
function harness() {
  const h = {
    watch: null,
    calls: 0,
    initialCalls: 0,
    cleared: [],
    states: [],
    positions: [],
    timers: new Map(),
  };
  let id = 0;
  h.tracker = createGeolocationTracker({
    geolocation: {
      getCurrentPosition: () => {
        h.initialCalls++;
      },
      watchPosition: (success, error, options) => {
        h.calls++;
        h.watch = { success, error, options };
        return h.calls;
      },
      clearWatch: (id) => h.cleared.push(id),
    },
    onPosition: (p) => h.positions.push(p),
    onState: (s) => h.states.push(s),
    clock: {
      setTimeout: (fn) => {
        h.timers.set(++id, fn);
        return id;
      },
      clearTimeout: (id) => h.timers.delete(id),
    },
  });
  return h;
}
const fix = (timestamp = 1000) => ({
  coords: { latitude: 19.07, longitude: 72.87, accuracy: 45.2 },
  timestamp,
});
test("a user action requests exactly one native location watch and no parallel initial lookup", () => {
  const h = harness();
  h.tracker.start();
  assert.equal(h.calls, 1);
  assert.equal(h.initialCalls, 0);
  assert.equal(h.watch.options.maximumAge, 0);
  assert.equal(h.watch.options.enableHighAccuracy, true);
});
test("an unanswered permission request is not fabricated into a native timeout or another request", () => {
  const h = harness();
  h.tracker.start();
  [...h.timers.values()][0]();
  assert.equal(h.states.at(-1).status, "waiting");
  assert.equal(h.states.at(-1).code, null);
  assert.equal(h.states.at(-1).native, false);
  assert.equal(h.calls, 1);
});
test("native fixes update position continuously and preserve reported accuracy and timestamp", () => {
  const h = harness();
  h.tracker.start();
  h.watch.success(fix());
  h.watch.success(fix(2000));
  assert.equal(h.states.at(-1).status, "live");
  assert.equal(h.positions.length, 2);
  assert.equal(h.positions[1].source, "gps");
  assert.equal(h.positions[1].accuracy, 45);
  assert.equal(h.positions[1].updatedAt, 2000);
  assert.equal(h.states.at(-1).callbacks, 2);
});
test("only a real native error reports timeout, and an existing fix becomes stale", () => {
  const h = harness();
  h.tracker.start();
  h.watch.success(fix());
  h.watch.error({ code: 3, message: "Native device timeout" });
  assert.equal(h.states.at(-1).status, "stale");
  assert.equal(h.states.at(-1).code, 3);
  assert.equal(h.states.at(-1).native, true);
  assert.equal(h.states.at(-1).message, "Native device timeout");
  assert.equal(h.calls, 1);
});
test("permission denial clears the native watch without automatically starting another", () => {
  const h = harness();
  h.tracker.start();
  h.watch.error({ code: 1, message: "Permission denied" });
  assert.equal(h.states.at(-1).status, "error");
  assert.deepEqual(h.cleared, [1]);
  assert.equal(h.calls, 1);
});
test("stopping rejects late callbacks so resolved alerts or manual locations are not overwritten", () => {
  const h = harness();
  h.tracker.start();
  const callback = h.watch.success;
  h.tracker.stop();
  callback(fix());
  assert.equal(h.positions.length, 0);
  assert.deepEqual(h.cleared, [1]);
  assert.equal(h.timers.size, 0);
});
test("restarting clears the old watcher before registering the next", () => {
  const h = harness();
  h.tracker.start();
  const old = h.watch.success;
  h.tracker.start({ highAccuracy: false });
  assert.deepEqual(h.cleared, [1]);
  assert.equal(h.calls, 2);
  assert.equal(h.watch.options.enableHighAccuracy, false);
  old(fix());
  assert.equal(h.positions.length, 0);
});
