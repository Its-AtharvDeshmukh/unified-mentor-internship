import test from "node:test";
import assert from "node:assert/strict";
import {
  validCoordinates,
  manualPosition,
  accuracyPolygon,
} from "../src/lib/location.js";
test("manual coordinates are validated and explicitly labeled", () => {
  const p = manualPosition("19.076", "72.8777", 1000);
  assert.equal(p.latitude, 19.076);
  assert.equal(p.longitude, 72.8777);
  assert.equal(p.source, "manual");
  assert.equal(p.accuracy, null);
  assert.equal(p.updatedAt, 1000);
});
test("blank, nonnumeric and out-of-bounds coordinates are rejected", () => {
  for (const pair of [
    ["", ""],
    ["x", "20"],
    ["91", "0"],
    ["0", "181"],
    ["-91", "0"],
  ])
    assert.throws(() => manualPosition(...pair), /latitude/);
  assert.equal(validCoordinates(0, 0), true);
  assert.equal(validCoordinates(Infinity, 0), false);
});
test("device accuracy produces a closed polygon centered on the fix", () => {
  const feature = accuracyPolygon({
    latitude: 20,
    longitude: 75,
    accuracy: 100,
  });
  assert.equal(feature.geometry.type, "Polygon");
  const points = feature.geometry.coordinates[0];
  assert.equal(points.length, 65);
  assert.ok(Math.abs(points[0][0] - points[64][0]) < 1e-10);
  assert.ok(Math.abs(points[0][1] - points[64][1]) < 1e-10);
  assert.ok(points[0][0] > 75);
  assert.ok(points[16][1] > 20);
});
