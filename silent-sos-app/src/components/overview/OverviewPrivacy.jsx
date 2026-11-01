import Icon from "../Icon";
import { useSafety } from "../../context/SafetyContext";

export default function OverviewPrivacy({ navigate }) {
  const { profile, setProfile } = useSafety();
  return (
    <section
      className="ov-privacy cw-privacy"
      aria-label="Privacy controls"
      data-overview-reveal
    >
      <div className="cw-privacy-title">
        <span>
          <Icon name="lock" size={24} />
        </span>
        <div>
          <span className="cw-section-index">BUILT AROUND YOUR BOUNDARIES</span>
          <h3>Privacy controls</h3>
        </div>
      </div>
      <div className="cw-privacy-toggle">
        <span>
          <strong>Discreet screen</strong>
          <small>
            {profile.discreet
              ? "A neutral screen after SOS"
              : "Alert status stays visible"}
          </small>
        </span>
        <button
          className={`toggle ${profile.discreet ? "on" : ""}`}
          role="switch"
          aria-label="Discreet screen from dashboard"
          aria-checked={profile.discreet}
          onClick={() =>
            setProfile({ ...profile, discreet: !profile.discreet })
          }
        >
          <span />
        </button>
      </div>
      <button
        className="cw-privacy-settings"
        onClick={() => navigate("settings")}
      >
        Your privacy controls
        <Icon name="upRight" size={18} />
      </button>
    </section>
  );
}
