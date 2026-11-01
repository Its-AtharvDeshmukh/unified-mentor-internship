import { useRef } from "react";
import Icon from "../Icon";
import useSignalPhysics from "../../hooks/useSignalPhysics";
export default function SignalControl({
  active,
  contacts,
  profile,
  onActivate,
}) {
  const stage = useRef(null);
  const motion = useSignalPhysics(stage);
  const ready = !!active || contacts.length > 0;
  return (
    <div className="signal-stage" ref={stage} {...motion}>
      <div className="signal-stage-grid" aria-hidden="true" />
      <div className="signal-stage-depth" aria-hidden="true">
        <div className="signal-track track-outer">
          <span />
          <i />
        </div>
        <div className="signal-track track-inner">
          <i />
        </div>
        <span className="signal-orbital-star">✳</span>
        <span className="signal-orbital-plus">+</span>
        <div className="signal-button-plinth" />
      </div>
      <span className={`signal-stage-label ${active ? "is-active" : ""}`}>
        <i />
        {active ? "DEMO IN PROGRESS" : "YOUR SIGNAL STARTS HERE"}
      </span>
      <div className="signal-button-holder">
        <button
          className="signal-physical-button"
          type="button"
          onClick={onActivate}
          aria-label={
            active
              ? "Return to active SOS demo"
              : ready
                ? "Start SOS demo"
                : "Add your first trusted contact"
          }
        >
          <span className="signal-button-surface">
            <Icon name="fingerprint" size={34} />
            <strong>SOS</strong>
            <span>
              {active
                ? "Return to demo"
                : ready
                  ? "One tap to try"
                  : "Set up to begin"}
            </span>
          </span>
        </button>
        <span className="signal-button-shadow" aria-hidden="true" />
      </div>
      <div className="signal-float-chip signal-you-chip" aria-hidden="true">
        <span>
          <Icon name="fingerprint" size={16} />
        </span>
        <div>
          <small>01</small>
          <strong>You</strong>
        </div>
      </div>
      <div className="signal-float-chip signal-circle-chip" aria-hidden="true">
        <span>
          <Icon name="users" size={16} />
        </span>
        <div>
          <small>02</small>
          <strong>Your circle</strong>
        </div>
        <i />
      </div>
      <span className="signal-stage-caption">
        <Icon name={profile.discreet ? "eyeOff" : "mute"} size={14} />
        {profile.discreet
          ? "One tap. Then a neutral screen."
          : profile.sosSound !== false
            ? "One tap. Activation chime on."
            : "One tap. Sound off."}
      </span>
    </div>
  );
}
