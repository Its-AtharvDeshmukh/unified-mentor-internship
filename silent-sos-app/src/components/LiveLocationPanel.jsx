import { useState, useEffect } from "react";
import Icon from "./Icon";
import LocationDiagnostics from "./LocationDiagnostics";
import { useSafety } from "../context/SafetyContext";
export default function LiveLocationPanel() {
  const { location, setToast } = useSafety();
  const [now, setNow] = useState(Date.now());
  const blocked = location.permission === "denied";
  const tracking = location.status === "live",
    pending = ["locating", "waiting"].includes(location.status);
  const p = location.position?.source === "gps" ? location.position : null;
  useEffect(() => {
    if (!pending && !p) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [pending, p?.updatedAt]);
  const elapsed = location.attempt?.startedAt
    ? Math.max(0, Math.floor((now - location.attempt.startedAt) / 1000))
    : 0;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/#location`,
      );
      setToast("Live-location link copied. Open it in Safari or Chrome.");
    } catch {
      setToast(`Open ${window.location.origin}/#location in Safari or Chrome.`);
    }
  };
  return (
    <section className={`live-position-panel state-${location.status}`}>
      <div className="live-position-heading">
        <span className="live-position-glyph">
          <Icon name="locate" size={26} />
        </span>
        <span className={`live-state-badge ${tracking ? "connected" : ""}`}>
          <i />
          {tracking
            ? "LIVE"
            : pending
              ? "CONNECTING"
              : location.status === "stale"
                ? "PAUSED"
                : "NOT CONNECTED"}
        </span>
      </div>
      <span className="eyebrow">CURRENT DEVICE LOCATION</span>
      <h2>
        {tracking
          ? "Your live position."
          : pending
            ? "Connecting to your device…"
            : "Enable live location."}
      </h2>
      <p>
        Receive your current coordinates and continuous movement updates.
        Tracking stays active until you stop it or mark your alert safe.
      </p>
      <div className="native-position-status" role="status">
        <Icon
          name={
            tracking
              ? "radio"
              : pending
                ? "clock"
                : location.status === "error"
                  ? "warning"
                  : "location"
          }
          size={19}
        />
        <div>
          <strong>
            {tracking
              ? "Receiving native device coordinates"
              : location.status === "waiting"
                ? "Waiting for browser permission or a native response"
                : location.status === "locating"
                  ? "Native location watch requested"
                  : location.status === "stale"
                    ? "Last known position · Updates paused"
                    : location.error
                      ? "The device location request did not succeed"
                      : "No live position has been received yet"}
          </strong>
          <small>
            {tracking && p
              ? `${p.latitude.toFixed(6)}°, ${p.longitude.toFixed(6)}° · ±${p.accuracy} m`
              : pending
                ? `${elapsed}s elapsed · One native watch · No assumed coordinates`
                : location.error ||
                  "Use the button below and allow location if prompted."}
          </small>
        </div>
      </div>
      {p && (
        <div className="live-fix-metrics">
          <span>
            Last device fix
            <strong>
              {Math.max(0, Math.floor((now - p.updatedAt) / 1000))}s ago
            </strong>
          </span>
          <span>
            Native callbacks<strong>{location.attempt?.callbacks || 0}</strong>
          </span>
        </div>
      )}
      <button
        className="primary-button full-width native-connect-button"
        onClick={location.start}
        disabled={pending}
      >
        {pending ? (
          <span className="loading-spinner" />
        ) : (
          <Icon name="locate" size={18} />
        )}{" "}
        {blocked
          ? "Try device location again"
          : pending
            ? "Waiting for your device…"
            : tracking
              ? "Restart live tracking"
              : "Enable live location"}
      </button>
      {location.status !== "off" && (
        <button
          className="outline-button full-width native-stop-button"
          onClick={location.stop}
        >
          <Icon name="close" size={16} />
          Stop location request
        </button>
      )}
      {blocked && (
        <div className="location-permission-action">
          <strong>Browser permission must be changed first.</strong>
          <p>
            Allow location for this site, then recheck. If this in-app browser
            has no permission control, open the copied link in Safari or Chrome.
          </p>
          <button
            className="outline-button full-width"
            onClick={async () => {
              const state = await location.recheckPermission();
              setToast(
                state === "granted"
                  ? "Location permission is allowed. Start live tracking."
                  : "The browser still reports location as " + state + ".",
              );
            }}
          >
            Recheck location permission
            <Icon name="locate" size={16} />
          </button>
        </div>
      )}
      <LocationDiagnostics />
      {(blocked ||
        location.status === "waiting" ||
        location.status === "error") && (
        <div className="host-browser-help">
          <strong>No location prompt appears?</strong>
          <p>
            The in-app browser may not be forwarding the device permission
            request. Open this same app in Safari or Chrome and allow location
            there.
          </p>
          <button className="outline-button full-width" onClick={copy}>
            <Icon name="external" size={16} />
            Copy link for Safari / Chrome
          </button>
          <a href="/location-check.html" target="_blank" rel="noreferrer">
            Run the direct browser location test
            <Icon name="upRight" size={14} />
          </a>
        </div>
      )}
      <div className="native-privacy-note">
        <Icon name="lock" size={14} />
        <span>
          Your position comes only from the device API. A map provider cannot
          grant device permission.
        </span>
      </div>
    </section>
  );
}
