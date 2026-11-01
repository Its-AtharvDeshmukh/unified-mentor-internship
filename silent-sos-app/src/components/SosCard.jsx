import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
import { initials } from "../lib/alerts";
export default function SosCard({ navigate }) {
  const { trigger, active, profile, contacts, location } = useSafety();
  return (
    <section className="signal-hero">
      <div className="signal-hero-text">
        <div className="signal-eyebrow">
          <span className="signal-bars">
            <i />
            <i />
            <i />
          </span>
          WHEN WORDS AREN’T AN OPTION<span>DEMO</span>
        </div>
        <h2>
          A quiet signal.
          <br />
          <span>A powerful circle.</span>
        </h2>
        <p>
          One tap connects the dots between you
          <br className="desktop-copy-break" /> and the people who have your
          back.
        </p>
        <div className="signal-contact-stack">
          <div>
            {contacts.slice(0, 3).map((c, i) => (
              <span className={`signal-person person-${i}`} key={c.id}>
                {initials(c.name)}
              </span>
            ))}
            {!contacts.length && (
              <span className="signal-person">
                <Icon name="plus" size={16} />
              </span>
            )}
          </div>
          <span>
            {contacts.length
              ? `${contacts.length} ${contacts.length===1?"person":"people"} in your corner`
              : "Start with someone you trust"}
            <small>
              {location.status === "live"
                ? "Live device location ready"
                : location.position?.source === "manual"
                  ? "Manual location selected"
                  : "Location is optional for the demo"}
            </small>
          </span>
        </div>
        <div className="signal-actions">
          <button onClick={() => navigate("delivery")}>
            Explore Signal Studio
            <Icon name="upRight" size={17} />
          </button>
          <span>
            <Icon name="mute" size={15} />
            Always silent
          </span>
        </div>
      </div>
      <div className="signal-launchpad">
        <div className="launchpad-orbits" aria-hidden="true">
          <span />
          <span />
          <span />
          <i className="orbit-node node-a" />
          <i className="orbit-node node-b" />
          <i className="orbit-node node-c" />
          <svg viewBox="0 0 300 300">
            <path d="M18 150H70M230 150H282M150 18V70M150 230V282" />
            <circle cx="150" cy="150" r="137" />
          </svg>
        </div>
        <div className="launchpad-label">
          <i />
          {active ? "YOUR DEMO IS ACTIVE" : "YOUR SIGNAL STARTS HERE"}
        </div>
        <button
          className="signal-sos-control"
          aria-label="Start silent SOS demo"
          onClick={trigger}
        >
          <span className="signal-control-icon">
            <Icon name="fingerprint" size={35} />
          </span>
          <strong>SOS</strong>
          <span>{active ? "Demo in progress" : "One tap. No words."}</span>
          <span className="signal-control-arrow">
            <Icon name="arrow" size={16} />
          </span>
        </button>
        <div className="launchpad-caption">
          <Icon
            name={profile.discreet ? "eyeOff" : "outlineShield"}
            size={14}
          />
          {profile.discreet
            ? "Instantly switches to a neutral screen."
            : "Status stays visible. Change in Settings."}
        </div>
      </div>
      <div className="signal-hero-footer">
        <span>
          <Icon name="info" size={14} />
          Interactive demo. No real messages or emergency calls are sent.
        </span>
        <span>
          PRIVATE BY CHOICE
          <Icon name="lock" size={13} />
        </span>
      </div>
    </section>
  );
}
