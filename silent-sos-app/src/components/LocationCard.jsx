import Icon from "./Icon";
import MapPreview from "./MapPreview";
import { useSafety } from "../context/SafetyContext";
import { locationSourceLabel } from "../lib/locationProviders";
export default function LocationCard({ navigate }) {
  const { location } = useSafety();
  const p = location.position;
  return (
    <section className="essential-location-card">
      <div className="essential-card-heading">
        <div>
          <span className="eyebrow">YOUR ALERT LOCATION</span>
          <h3>Your place on the map.</h3>
        </div>
        <span className={`location-ready-badge ${p ? "has-place" : ""}`}>
          <i />
          {p
            ? location.status === "live"
              ? "Device connected"
              : location.status === "stale"
                ? "Last known"
                : "Place confirmed"
            : "Not set yet"}
        </span>
      </div>
      <MapPreview />
      <div className="essential-location-footer">
        <span className="essential-location-icon">
          <Icon name="location" size={20} />
        </span>
        <div>
          <strong>
            {p
              ? p.label ||
                `${p.latitude.toFixed(4)}°, ${p.longitude.toFixed(4)}°`
              : "Where should your alert point?"}
          </strong>
          <p>
            {p
              ? `${locationSourceLabel(p)}${p.source === "gps" ? ` · ±${p.accuracy} m` : " · Fixed position"}`
              : "Search an address or choose a point on the map."}
          </p>
        </div>
        <button
          className="essential-location-action"
          onClick={() => navigate("location")}
          aria-label="Open location controls"
        >
          {p ? "Edit" : "Set location"}
          <Icon name="upRight" size={16} />
        </button>
      </div>
    </section>
  );
}
