import test from "node:test";
import assert from "node:assert/strict";
import {
  photonResults,
  locationSourceLabel,
} from "../src/lib/locationProviders.js";
import { createAlert } from "../src/lib/alerts.js";
test("place search returns geocoded coordinates without inventing a GPS fix", () => {
  const result = photonResults({
    features: [
      {
        properties: {
          osm_id: 123,
          name: "India Gate",
          city: "New Delhi",
          state: "Delhi",
          country: "India",
        },
        geometry: { coordinates: [77.22949, 28.61293] },
      },
    ],
  })[0];
  assert.equal(result.latitude, 28.61293);
  assert.equal(result.longitude, 77.22949);
  assert.equal(result.source, "search");
  assert.equal(result.accuracy, null);
  assert.equal(locationSourceLabel(result), "Confirmed place");
});
test("place search drops malformed coordinates", () => {
  const results = photonResults({
    features: [
      {
        properties: { name: "Invalid" },
        geometry: { coordinates: [999, 999] },
      },
      { properties: { name: "Missing" } },
    ],
  });
  assert.deepEqual(results, []);
});
test("confirmed places remain identified as fixed positions in an alert snapshot", () => {
  const place = {
    latitude: 28.61,
    longitude: 77.22,
    source: "search",
    label: "India Gate",
    accuracy: null,
  };
  const alert = createAlert(
    [{ id: "one", name: "Test", channel: "Email" }],
    place,
    1000,
  );
  assert.equal(alert.location.source, "search");
  assert.match(alert.events[1].text, /fixed address, not live GPS/);
  assert.equal(alert.location.label, "India Gate");
  place.latitude = 0;
  assert.equal(alert.location.latitude, 28.61);
});
