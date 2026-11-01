export function validCoordinates(latitude, longitude) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}
export function manualPosition(latitude, longitude, now = Date.now()) {
  const lat = Number(latitude),
    lng = Number(longitude);
  if (
    String(latitude).trim() === "" ||
    String(longitude).trim() === "" ||
    !validCoordinates(lat, lng)
  )
    throw new Error(
      "Enter latitude from −90 to 90 and longitude from −180 to 180.",
    );
  return {
    latitude: lat,
    longitude: lng,
    accuracy: null,
    updatedAt: now,
    source: "manual",
  };
}
export function accuracyPolygon(position) {
  const radius = position.accuracy || 0;
  const points = Array.from({ length: 65 }, (_, i) => {
    const angle = (i / 64) * 2 * Math.PI;
    return [
      position.longitude +
        (radius * Math.cos(angle)) /
          (111320 *
            Math.max(Math.cos((position.latitude * Math.PI) / 180), 0.01)),
      position.latitude + (radius * Math.sin(angle)) / 111320,
    ];
  });
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [points] },
  };
}
