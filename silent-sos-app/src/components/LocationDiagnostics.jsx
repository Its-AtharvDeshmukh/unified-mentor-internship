import { useState } from "react";
import Icon from "./Icon";
import Modal from "./Modal";
import { useSafety } from "../context/SafetyContext";
export default function LocationDiagnostics() {
  const { location } = useSafety();
  const [guide, setGuide] = useState(false);
  const checks = [
    [
      "Secure connection",
      location.capability.secure ? "Ready" : "HTTPS required",
      location.capability.secure,
    ],
    [
      "Browser location API",
      location.capability.supported ? "Available" : "Unavailable",
      location.capability.supported,
    ],
    [
      "Site permission",
      location.permission === "granted"
        ? "Allowed"
        : location.permission === "denied"
          ? "Blocked"
          : location.permission === "prompt"
            ? "Not confirmed by browser"
            : "Browser controlled",
      location.permission === "granted",
    ],
    [
      "Page allows location",
      location.capability.policyAllowed === false
        ? "Blocked by page policy"
        : location.capability.policyAllowed === true
          ? "Allowed"
          : "Not reported",
      location.capability.policyAllowed === true,
    ],
    [
      "Native device response",
      location.status === "live"
        ? "Live"
        : location.status === "stale"
          ? "Last known fix"
          : location.status === "manual"
            ? "Manual pin"
            : ["locating", "waiting"].includes(location.status)
              ? "Waiting for device"
              : "Not returned",
      location.status === "live",
    ],
  ];
  return (
    <>
      <div className="location-diagnostics">
        <div className="diagnostics-title">
          <strong>Location check</strong>
          <button className="text-link" onClick={() => setGuide(true)}>
            Fix device access
            <Icon name="upRight" size={14} />
          </button>
        </div>
        {checks.map(([label, value, ok]) => (
          <div className="diagnostic-row" key={label}>
            <span>
              <Icon name={ok ? "success" : "circle"} size={14} />
              {label}
            </span>
            <strong className={ok ? "is-ready" : ""}>{value}</strong>
          </div>
        ))}
        {location.attempt?.native && (
          <div className="native-result-trace">
            <strong>Native browser response</strong>
            <span>
              Error {location.attempt.code}:{" "}
              {location.attempt.message || "No additional message returned"}
            </span>
          </div>
        )}
      </div>
      <label className="accuracy-setting">
        <span>
          <strong>High accuracy</strong>
          <small>Useful on phones. May take longer.</small>
        </span>
        <button
          className={`toggle ${location.highAccuracy ? "on" : ""}`}
          type="button"
          role="switch"
          aria-label="High accuracy location"
          aria-checked={location.highAccuracy}
          onClick={() => location.setHighAccuracy(!location.highAccuracy)}
        >
          <span />
        </button>
      </label>
      {guide && (
        <Modal
          title="Help your device find you"
          onClose={() => setGuide(false)}
        >
          <div className="device-location-guide">
            <p>
              A timeout means the browser did not supply coordinates. Haven
              cannot change system permissions for you.
            </p>
            <h3>On a Mac</h3>
            <ol>
              <li>
                Open System Settings → Privacy & Security → Location Services.
              </li>
              <li>
                Enable Location Services, then allow the browser or app
                displaying this page.
              </li>
              <li>
                In the browser’s site settings, allow location for this website.
              </li>
              <li>
                Return here and select Retry location. If needed, open the local
                preview in Chrome or Safari.
              </li>
            </ol>
            <h3>On a phone</h3>
            <p>
              Turn on device location, allow it for the browser and this site,
              then retry. Enable High accuracy if available.
            </p>
            <div className="guide-sources">
              <a
                href="https://support.apple.com/guide/mac-help/control-access-to-the-location-of-your-mac-mh35873/mac"
                target="_blank"
                rel="noreferrer"
              >
                Apple location guide
                <Icon name="external" size={13} />
              </a>
              <a
                href="https://support.google.com/chrome/answer/142065"
                target="_blank"
                rel="noreferrer"
              >
                Chrome location guide
                <Icon name="external" size={13} />
              </a>
            </div>
            <button
              className="primary-button full-width"
              onClick={() => {
                setGuide(false);
                location.start();
              }}
            >
              Retry location
              <Icon name="locate" size={17} />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
