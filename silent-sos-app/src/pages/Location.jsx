import { useState } from "react";
import MapPreview from "../components/MapPreview";
import ManualLocationForm from "../components/ManualLocationForm";
import PlaceSearch from "../components/PlaceSearch";
import LiveLocationPanel from "../components/LiveLocationPanel";
import Icon from "../components/Icon";
import { useSafety } from "../context/SafetyContext";
import { formatTime } from "../lib/alerts";
import { locationSourceLabel } from "../lib/locationProviders";
export default function Location() {
  const { location, setToast } = useSafety();
  const p = location.position;
  const [picking, setPicking] = useState(false);
  const pick = (lat, lng) => {
    location.setManual(lat, lng);
    setPicking(false);
    setToast("Map position confirmed. It will be attached to your alert.");
  };
  const selectMode = (value) => {
    setPicking(value);
    if (value)
      document.querySelector(".position-map-card")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  };
  return (
    <>
      <div className="page-heading position-page-heading">
        <div>
          <span className="eyebrow">YOUR LOCATION</span>
          <h1>Live device location.</h1>
          <p>
            Connect your device once. Follow your current position and keep
            location updates active for your SOS.
          </p>
        </div>
        <span className={`position-status ${p ? "confirmed" : ""}`}>
          <Icon name={p ? "success" : "location"} size={16} />
          {location.status === "live"
            ? "Live device position"
            : location.status === "waiting"
              ? "Waiting for device"
              : p
                ? locationSourceLabel(p)
                : "Not connected"}
        </span>
      </div>
      <div className="position-workspace">
        <div className="position-tools">
          <LiveLocationPanel />
          <details className="fixed-location-alternatives">
            <summary>
              Fixed location tools<span>Not live tracking</span>
              <Icon name="down" size={16} />
            </summary>
            <div>
              <PlaceSearch />
              <ManualLocationForm picking={picking} setPicking={selectMode} />
            </div>
          </details>
        </div>
        <section className="position-map-card">
          <div className="position-map-toolbar">
            <span>
              <Icon name="navigation" size={16} />
              {p
                ? p.source === "gps"
                  ? location.status === "live"
                    ? "Your current device position"
                    : "Your last known device position"
                  : "Your chosen fixed position"
                : "Explore the map"}
            </span>
            {picking && (
              <span className="pin-selection-hint">Tap to place your pin</span>
            )}
            <span className="map-toolbar-hint">
              Drag to move · + / − to zoom
            </span>
          </div>
          <MapPreview large picking={picking} onPick={pick} />
          <div className={`position-confirmation ${p ? "has-position" : ""}`}>
            <span className="position-confirmation-icon">
              <Icon name={p ? "success" : "location"} size={24} />
            </span>
            <div>
              <span className="eyebrow">
                {p ? "LOCATION ATTACHED" : "READY WHEN YOU ARE"}
              </span>
              <h2>
                {p
                  ? p.source === "gps"
                    ? location.status === "live"
                      ? "Your live device position"
                      : "Your last known device position"
                    : p.label || "Your chosen fixed position"
                  : "Waiting for a current device position."}
              </h2>
              <p>
                {p
                  ? `${p.latitude.toFixed(5)}°, ${p.longitude.toFixed(5)}°`
                  : "Enable live location to receive coordinates directly from your device."}
              </p>
              {p && (
                <div className="position-metadata">
                  <span>
                    <Icon name="location" size={13} />
                    {locationSourceLabel(p)}
                  </span>
                  <span>
                    <Icon name="clock" size={13} />
                    {formatTime(p.updatedAt)}
                  </span>
                  {p.source === "gps" && <span>Accuracy ±{p.accuracy} m</span>}
                </div>
              )}
            </div>
            {p && (
              <button
                className="position-clear-button"
                onClick={location.stop}
                aria-label="Clear selected location"
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
          <div className="position-privacy-note">
            <Icon name="lock" size={14} />
            <p>
              {p?.source === "gps"
                ? "Live device updates continue until you stop or resolve your alert."
                : "A searched or chosen place is a fixed location, not live GPS tracking."}{" "}
              Map providers receive the area you view.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
