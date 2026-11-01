import MapPreview from "../MapPreview";
import Icon from "../Icon";
import { useSafety } from "../../context/SafetyContext";
import "./ConnectedWorld.css";

export default function OverviewLocation({ navigate }) {
  const { location } = useSafety();
  const p = location.position;
  const live = location.status === "live";
  const paused = location.status === "stale";
  return (
    <section
      className="ov-card ov-location cw-card cw-location"
      data-overview-reveal
    >
      <div className="cw-aligned-heading">
        <h3>Live location</h3>
        <div className="cw-aligned-controls">
          <span className={`cw-status ${live ? "is-live" : ""}`}>
            <i />
            {live
              ? "LIVE"
              : paused
                ? "PAUSED"
                : p
                  ? "FIXED PIN"
                  : "LOCATION OFF"}
          </span>
          <button
            className="cw-arrow-button"
            onClick={() => navigate("location")}
            aria-label="Open live location"
          >
            <Icon name="upRight" size={21} />
          </button>
        </div>
      </div>
      <div className="cw-map-window">
        <MapPreview />
      </div>
      <div className="cw-location-context">
        <span className="cw-context-icon">
          <Icon name={live ? "radio" : "locate"} size={20} />
        </span>
        <div>
          <strong>
            {live
              ? "Your device is sharing its position"
              : paused
                ? "Last known position · Updates paused"
                : p
                  ? "A fixed place, chosen by you"
                  : "Your location adds the context."}
          </strong>
          <p>
            {p
              ? `${p.latitude.toFixed(5)}°, ${p.longitude.toFixed(5)}°${live && p.accuracy !== null ? ` · ±${p.accuracy} m` : ""}`
              : "Connect your device to receive live updates."}
          </p>
        </div>
      </div>
      <button className="cw-card-link" onClick={() => navigate("location")}>
        <span>{live ? "Manage live location" : "Open location controls"}</span>
        <Icon name="arrow" size={18} />
      </button>
    </section>
  );
}
