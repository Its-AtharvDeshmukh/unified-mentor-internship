import Icon from "../Icon";
import { useSafety } from "../../context/SafetyContext";
import SignalControl from "./SignalControl";
import "./SignalConsole.css";
export default function EmergencyAction({ navigate }) {
  const { active, contacts, profile, setProfile, trigger } = useSafety();
  const soundOn = profile.sosSound !== false;
  const activate = () => {
    if (active && !profile.discreet) navigate("delivery");
    else if (active || contacts.length) trigger();
    else navigate("users", true);
  };
  return (
    <section
      className="safety-action-bar"
      aria-labelledby="safety-action-title"
      data-overview-reveal
    >
      <div className="sos-ambient-layers" aria-hidden="true">
        <span />
        <span />
        <i />
        <i />
      </div>
      <span className="safety-bar-symbol">
        <Icon name="shield" size={27} />
      </span>
      <div>
        <div className="safety-bar-title">
          <h2 id="safety-action-title">SOS signal</h2>
          <span>DEMO</span>
        </div>
        <p>
          {active
            ? "Your demo is active. Open it to follow the response."
            : contacts.length
              ? "One action connects your circle and available location in this demo."
              : "Add a trusted contact to prepare your first SOS demo."}
        </p>
        <small>
          <Icon name={soundOn ? "volume" : "mute"} size={13} />
          {soundOn
            ? "A short chime plays on activation."
            : "Sound is off. SOS activation is silent."}{" "}
          No real messages or emergency calls.
        </small>
        <button
          className="sos-sound-control"
          type="button"
          role="switch"
          aria-label="Sound on SOS activation"
          aria-checked={soundOn}
          onClick={() => setProfile({ ...profile, sosSound: !soundOn })}
        >
          <Icon name={soundOn ? "volume" : "mute"} size={15} />
          <span>Sound {soundOn ? "on" : "off"}</span>
          <i aria-hidden="true" className={soundOn ? "is-on" : ""} />
        </button>
      </div>
      <div className="safety-action-control">
        <SignalControl
          active={active}
          contacts={contacts}
          profile={profile}
          onActivate={activate}
        />
      </div>
    </section>
  );
}
