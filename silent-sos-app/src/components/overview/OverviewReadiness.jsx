import Icon from "../Icon";
import { useSafety } from "../../context/SafetyContext";
export default function OverviewReadiness({ navigate }) {
  const { contacts, location, profile } = useSafety();
  const live = location.status === "live";
  const items = [
    {
      icon: "users",
      title: "Your circle",
      value: contacts.length
        ? `${contacts.length} ${contacts.length === 1 ? "contact" : "contacts"} added`
        : "Add your first contact",
      detail: "The people you choose",
      route: "users",
      ready: !!contacts.length,
      color: "peach",
    },
    {
      icon: "locate",
      title: "Device location",
      value: live
        ? "Live & updating"
        : location.status === "stale"
          ? "Updates paused"
          : ["locating", "waiting"].includes(location.status)
            ? "Connecting…"
            : location.position
              ? "Fixed place selected"
              : "Connect your device",
      detail: live
        ? `Accuracy ±${location.position.accuracy ?? "—"} m`
        : "Your location, your choice",
      route: "location",
      ready: live,
      color: "sage",
    },
    {
      icon: "eyeOff",
      title: "Discreet mode",
      value: profile.discreet ? "Quietly enabled" : "Status stays visible",
      detail: profile.discreet
        ? "A neutral screen after SOS"
        : "Personalize your privacy",
      route: "settings",
      ready: profile.discreet,
      color: "lilac",
    },
  ];
  return (
    <section
      className="ov-readiness"
      aria-label="Your safety setup"
      data-overview-reveal
    >
      {items.map((item) => (
        <button
          key={item.title}
          className={`ov-readiness-item ${item.color}`}
          onClick={() => navigate(item.route)}
        >
          <span className="ov-readiness-icon">
            <Icon name={item.icon} size={21} />
          </span>
          <span className="ov-readiness-text">
            <small>{item.title}</small>
            <strong>{item.value}</strong>
            <span>{item.detail}</span>
          </span>
          <Icon
            name={item.ready ? "success" : "upRight"}
            size={17}
            className={item.ready ? "ov-ready-check" : "ov-next-arrow"}
          />
        </button>
      ))}
    </section>
  );
}
