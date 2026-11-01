import { useState } from "react";
import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
export default function ManualLocationForm({ picking, setPicking }) {
  const { location, setToast } = useSafety();
  const [latitude, setLatitude] = useState(""),
    [longitude, setLongitude] = useState(""),
    [error, setError] = useState("");
  const save = (e) => {
    e.preventDefault();
    try {
      location.setManual(latitude, longitude);
      setError("");
      setPicking(false);
      setToast("Manual location set. This is a chosen pin, not a GPS fix.");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <section className="card padded-card manual-location">
      <span className="eyebrow">ANOTHER WAY TO GET THERE</span>
      <h2>Pick your place.</h2>
      <p>
        If GPS is unavailable, choose a point on the map or enter coordinates.
        It will be labeled as a manual location in your demo alert.
      </p>
      <button
        className={`outline-button full-width ${picking ? "picking-active" : ""}`}
        onClick={() => setPicking(!picking)}
      >
        <Icon name="location" size={18} />
        {picking ? "Cancel map selection" : "Choose a point on the map"}
      </button>
      <details>
        <summary>
          Or enter coordinates
          <Icon name="down" size={16} />
        </summary>
        <form className="form-grid" onSubmit={save}>
          <div className="coordinate-inputs">
            <label>
              Latitude
              <input
                required
                inputMode="decimal"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 19.0760"
              />
            </label>
            <label>
              Longitude
              <input
                required
                inputMode="decimal"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 72.8777"
              />
            </label>
          </div>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <button className="primary-button">
            Use these coordinates
            <Icon name="check" size={17} />
          </button>
        </form>
      </details>
    </section>
  );
}
