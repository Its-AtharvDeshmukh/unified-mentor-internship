import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
import { initials } from "../lib/alerts";
export default function Header({ openMenu, menuOpen, navigate }) {
  const { online, setNeutral, profile } = useSafety();
  return (
    <header className="workspace-header" aria-label="Workspace controls">
      <div className="header-context glass-header-island">
        <button
          className="header-menu-control"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={openMenu}
        >
          <Icon name="menu" />
        </button>
        <span className="header-page-symbol">
          <Icon name="dashboard" size={19} />
        </span>
        <span className="header-page-copy">
          <small>Haven</small>
          <strong>Your space</strong>
        </span>
      </div>
      <div className="header-control-cluster">
        <button
          className="header-hide-control glass-header-island"
          aria-label="Quick hide"
          title="Switch to the neutral screen"
          onClick={() => setNeutral(true)}
        >
          <Icon name="eyeOff" size={17} />
          <span>Quick hide</span>
        </button>
        <button
          className="header-account-control glass-header-island"
          aria-label="Open your profile"
          onClick={() => navigate("settings")}
        >
          <span className="header-account-avatar">
            {initials(profile.name)}
            <i className={online ? "is-online" : "is-offline"} />
          </span>
          <span className="header-account-copy">
            <strong>{profile.name.trim().split(/\s+/)[0] || "Profile"}</strong>
            <small>{online ? "Connected" : "Offline"}</small>
          </span>
        </button>
      </div>
    </header>
  );
}
