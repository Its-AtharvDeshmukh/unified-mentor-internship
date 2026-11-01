import Icon from "../Icon";
import { formatDate, formatTime } from "../../lib/alerts";
import { useSafety } from "../../context/SafetyContext";

export default function OverviewActivity({ navigate }) {
  const { alerts } = useSafety();
  return (
    <section
      className="ov-card ov-activity cw-card cw-activity"
      data-overview-reveal
    >
      <div className="cw-card-top">
        <span className="cw-section-index">
          <Icon name="history" size={17} />
          03 / YOUR ACTIVITY
        </span>
        <span className="cw-session-label">THIS SESSION</span>
      </div>
      <div className="cw-title-row">
        <h3>Recent activity</h3>
        <button
          className="cw-arrow-button"
          onClick={() => navigate("history")}
          aria-label="View all activity"
        >
          <Icon name="upRight" size={20} />
        </button>
      </div>
      {alerts.length ? (
        <div className="cw-activity-list">
          {alerts.slice(0, 3).map((alert) => (
            <button key={alert.id} onClick={() => navigate("history")}>
              <span className={`cw-event-icon ${alert.status}`}>
                <Icon
                  name={
                    alert.status === "resolved"
                      ? "success"
                      : alert.status === "acknowledged"
                        ? "users"
                        : "radio"
                  }
                  size={19}
                />
              </span>
              <span>
                <strong>
                  {alert.status === "resolved"
                    ? "Demo marked safe"
                    : alert.status === "acknowledged"
                      ? "A demo contact responded"
                      : "SOS demo started"}
                </strong>
                <small>
                  {formatDate(alert.createdAt)} · {formatTime(alert.createdAt)}
                </small>
              </span>
              <span className={`cw-event-state ${alert.status}`}>
                {alert.status}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="cw-activity-empty">
          <div className="cw-quiet-track" aria-hidden="true">
            <span />
            <i />
            <i />
            <i />
            <i />
            <i />
            <span />
          </div>
          <span className="cw-all-quiet">
            <i />
            ALL QUIET
          </span>
          <strong>Nothing urgent. Just living.</strong>
          <p>Your demo alerts and responses will find a home here.</p>
        </div>
      )}
      <button className="cw-card-link" onClick={() => navigate("history")}>
        <span>View your activity</span>
        <Icon name="arrow" size={18} />
      </button>
    </section>
  );
}
