import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
export default function ReadinessCard({ navigate }) {
  const { contacts, location, profile } = useSafety();
  const items = [
    {
      label: "Your people",
      detail: `${contacts.length} contacts added`,
      ready: contacts.length > 0,
      page: "users",
      icon: "users",
    },
    {
      label: "Your location",
      detail:
        location.status === "stale"
          ? "Last known position"
          : location.position && location.position.source !== "gps"
            ? "Location chosen"
            : location.position
              ? "Device GPS enabled"
              : "One step to enable",
      ready: !!location.position,
      page: "location",
      icon: "location",
    },
    {
      label: "Your privacy",
      detail: profile.discreet ? "Discreet mode is on" : "Discreet mode is off",
      ready: profile.discreet,
      page: "settings",
      icon: "eyeOff",
    },
  ];
  const done = items.filter((i) => i.ready).length;
  return (
    <section className="readiness-card">
      <div className="readiness-title">
        <span
          className="readiness-ring"
          style={{ "--progress": `${(done / 3) * 100}%` }}
        >
          <strong>
            {done}
            <small>/3</small>
          </strong>
        </span>
        <div>
          <h3>Make it your own.</h3>
          <p>A few small steps to get started.</p>
        </div>
      </div>
      <div className="readiness-items">
        {items.map((item) => (
          <button
            className="checklist-row"
            key={item.label}
            onClick={() => navigate(item.page)}
          >
            <span className={`setup-icon ${item.ready ? "done" : ""}`}>
              <Icon name={item.icon} size={18} />
            </span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </span>
            <Icon
              name={item.ready ? "success" : "upRight"}
              size={16}
              className={item.ready ? "text-green" : "text-muted"}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
