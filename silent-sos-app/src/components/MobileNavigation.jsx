import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
export default function MobileNavigation({ page, navigate }) {
  const { trigger } = useSafety();
  return (
    <nav
      className="mobile-bottom-navigation"
      aria-label="Mobile main navigation"
    >
      {[
        ["dashboard", "Home"],
        ["users", "Circle"],
        ["sos", "SOS"],
        ["location", "Location"],
        ["history", "Activity"],
      ].map(([id, label]) =>
        id === "sos" ? (
          <button
            key={id}
            className="mobile-sos-action"
            aria-label="Start SOS demo from navigation"
            onClick={trigger}
          >
            <Icon name="fingerprint" size={26} />
            <span>SOS</span>
          </button>
        ) : (
          <button
            key={id}
            className={
              page === id || (id === "history" && page === "delivery")
                ? "selected"
                : ""
            }
            aria-current={page === id ? "page" : undefined}
            onClick={() => navigate(id)}
          >
            <Icon name={id} size={20} />
            <span>{label}</span>
          </button>
        ),
      )}
    </nav>
  );
}
