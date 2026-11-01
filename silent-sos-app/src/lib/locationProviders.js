import { validCoordinates } from "./location.js";
export function photonResults(data) {
  return (data.features || [])
    .map((feature) => {
      const p = feature.properties || {},
        c = feature.geometry?.coordinates || [];
      return {
        id: String(p.osm_id || c.join(",")),
        latitude: c[1],
        longitude: c[0],
        label: [
          p.name,
          p.street,
          p.city || p.town || p.county,
          p.state,
          p.country,
        ]
          .filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(", "),
        source: "search",
        accuracy: null,
        provider: "Photon / OpenStreetMap",
      };
    })
    .filter((p) => validCoordinates(p.latitude, p.longitude))
    .slice(0, 5);
}
export function networkResult(data) {
  if (!data.success || !validCoordinates(data.latitude, data.longitude))
    throw new Error(
      data.message ||
        "The network-area service did not return a usable result. Search for your address instead.",
    );
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    label: [data.city, data.region, data.country].filter(Boolean).join(", "),
    source: "network",
    accuracy: null,
    provider: "ipwho.is",
    updatedAt: Date.now(),
  };
}
const cache = new Map();
let lastSearch = 0;
export async function searchPlaces(query, fetcher = fetch) {
  const text = query.trim();
  if (text.length < 3)
    throw new Error(
      "Enter at least 3 characters, such as a street, campus, or landmark.",
    );
  const key = text.toLowerCase();
  if (cache.has(key)) return cache.get(key);
  if (Date.now() - lastSearch < 1100)
    throw new Error("Please wait a moment before searching again.");
  lastSearch = Date.now();
  let response = await fetcher(
    `https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=5`,
    {
      signal: AbortSignal.timeout(12000),
      referrerPolicy: "strict-origin-when-cross-origin",
    },
  );
  if (!response.ok)
    throw new Error(
      "Place search is temporarily unavailable. Try again in a moment, or choose a point on the map.",
    );
  const json = await response.json();
  const results = json.results || photonResults(json);
  cache.set(key, results);
  return results;
}
export async function findNetworkArea(fetcher = fetch) {
  const response = await fetcher(
    "https://ipwho.is/?fields=success,city,region,country,latitude,longitude,message",
    { signal: AbortSignal.timeout(10000) },
  );
  if (!response.ok)
    throw new Error(
      "The approximate-area service is unavailable. Try address search instead.",
    );
  return networkResult(await response.json());
}
export const locationSourceLabel = (p) =>
  p?.source === "gps"
    ? "Device location"
    : p?.source === "network"
      ? "Approximate network area"
      : p?.source === "search"
        ? "Confirmed place"
        : p?.source === "manual"
          ? "Manual map pin"
          : "No location";
