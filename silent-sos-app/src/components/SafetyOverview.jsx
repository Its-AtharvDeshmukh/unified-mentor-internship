import Icon from "./Icon";
import LocationCard from "./LocationCard";
import ContactsCard from "./ContactsCard";
import { useSafety } from "../context/SafetyContext";
import { formatDate, formatTime } from "../lib/alerts";
export default function SafetyOverview({ navigate }) {
  const { alerts, profile, setProfile } = useSafety();
  return (
    <section className="safety-overview">
      <div className="safety-overview-heading">
        <div>
          <span className="eyebrow">YOUR SAFETY ESSENTIALS</span>
          <h2>Everything in its place.</h2>
        </div>
        <button
          className="overview-settings-link"
          onClick={() => navigate("settings")}
        >
          <Icon name="sliders" size={17} />
          Personalize
        </button>
      </div>
      <div className="essential-grid">
        <LocationCard navigate={navigate} />
        <ContactsCard navigate={navigate} />
      </div>
      <section className="activity-overview">
        <div className="activity-overview-heading">
          <span className="activity-heading-icon">
            <Icon name="history" size={19} />
          </span>
          <div>
            <h3>Your activity</h3>
            <p>Alerts, responses, and moments marked safe.</p>
          </div>
          <button onClick={() => navigate("history")}>
            View history
            <Icon name="upRight" size={16} />
          </button>
        </div>
        {alerts.length ? (
          <div className="overview-activity-list">
            {alerts.slice(0, 3).map((a) => (
              <button key={a.id} onClick={() => navigate("history")}>
                <span className={`activity-state-icon ${a.status}`}>
                  <Icon
                    name={
                      a.status === "resolved"
                        ? "success"
                        : a.status === "acknowledged"
                          ? "users"
                          : "radio"
                    }
                    size={18}
                  />
                </span>
                <span>
                  <strong>
                    {a.status === "resolved"
                      ? "Marked safe"
                      : a.status === "acknowledged"
                        ? "A contact responded"
                        : "SOS demo started"}
                  </strong>
                  <small>
                    {formatDate(a.createdAt)} · {formatTime(a.createdAt)}
                  </small>
                </span>
                <span
                  className={`pill ${a.status === "resolved" ? "green" : "amber"}`}
                >
                  {a.status}
                </span>
                <Icon name="chevron" size={16} />
              </button>
            ))}
          </div>
        ) : (
          <div className="overview-activity-empty">
            <span className="empty-activity-line" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div>
              <strong>No alerts in this session.</strong>
              <p>
                Once you try SOS, its timeline and contact responses will appear
                here.
              </p>
            </div>
            <span className="quiet-label">
              <Icon name="mute" size={14} />
              ALL QUIET
            </span>
          </div>
        )}
      </section>
      <section className="practical-controls">
        <div>
          <span className="practical-control-icon">
            <Icon name="mute" size={18} />
          </span>
          <span>
            <strong>Silent by default</strong>
            <small>No sounds or vibration</small>
          </span>
          <Icon name="check" size={15} />
        </div>
        <div>
          <span className="practical-control-icon">
            <Icon name="eyeOff" size={18} />
          </span>
          <span>
            <strong>Discreet screen</strong>
            <small>
              {profile.discreet
                ? "Opens immediately on SOS"
                : "Status remains visible"}
            </small>
          </span>
          <button
            className={`toggle ${profile.discreet ? "on" : ""}`}
            role="switch"
            aria-checked={profile.discreet}
            aria-label="Discreet screen from dashboard"
            onClick={() =>
              setProfile({ ...profile, discreet: !profile.discreet })
            }
          >
            <span />
          </button>
        </div>
        <button
          className="practical-data-control"
          onClick={() => navigate("settings")}
        >
          <Icon name="lock" size={18} />
          <span>Your data controls</span>
          <Icon name="upRight" size={16} />
        </button>
      </section>
    </section>
  );
}
