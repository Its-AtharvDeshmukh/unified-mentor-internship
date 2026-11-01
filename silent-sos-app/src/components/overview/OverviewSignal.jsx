import Icon from "../Icon";
import { useSafety } from "../../context/SafetyContext";
import SignalControl from "./SignalControl";
import SignalCircleLink from "./SignalCircleLink";
import "./SignalConsole.css";
export default function OverviewSignal({ navigate }) {
  const { trigger, contacts, profile, active, location } = useSafety();
  const activate = () => {
    if (active) {
      if (profile.discreet) trigger();
      else navigate("delivery");
    } else if (contacts.length) trigger();
    else navigate("users", true);
  };
  return (
    <section
      className="signal-console"
      aria-labelledby="signal-console-title"
      data-overview-reveal
    >
      <div className="signal-console-top">
        <span className="signal-console-wordmark">
          <span aria-hidden="true">✳</span> A QUIET KIND OF BACKUP
        </span>
        <span className="signal-demo-tag">
          INTERACTIVE DEMO <i />
        </span>
      </div>
      <div className="signal-console-body">
        <div className="signal-console-copy">
          <h2 id="signal-console-title">
            A quiet tap.
            <br />
            <span>A little closer.</span>
          </h2>
          <p>
            For the moments you can’t say it out loud.
            <br className="signal-copy-break" /> Your people, one silent action
            away.
          </p>
        </div>
        <SignalControl
          active={active}
          contacts={contacts}
          profile={profile}
          onActivate={activate}
        />
        <div className="signal-console-support">
          <SignalCircleLink contacts={contacts} navigate={navigate} />
          <button
            className="signal-explore-link"
            onClick={() => navigate("delivery")}
          >
            See how your signal travels <Icon name="arrow" size={17} />
          </button>
        </div>
      </div>
      <div className="signal-console-status">
        <span>
          <Icon name="mute" size={15} />
          Always silent
        </span>
        <button onClick={() => navigate("settings")}>
          <Icon name="eyeOff" size={15} />
          Discreet screen <strong>{profile.discreet ? "On" : "Off"}</strong>
        </button>
        <button onClick={() => navigate("location")}>
          <span
            className={`signal-location-dot ${location.status === "live" ? "is-live" : ""}`}
          />
          {location.status === "live"
            ? "Live location connected"
            : location.status === "stale"
              ? "Location updates paused"
              : "Location controls"}
          <Icon name="upRight" size={13} />
        </button>
      </div>
      <p className="signal-console-disclaimer">
        <Icon name="info" size={14} />
        <span>
          Made for practice. No real messages or emergency calls are sent.
        </span>
      </p>
    </section>
  );
}
