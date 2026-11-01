import { useState } from "react";
import Icon from "../components/Icon";
import AlertPanel from "../components/AlertPanel";
import { useSafety } from "../context/SafetyContext";
import { formatDate, formatTime } from "../lib/alerts";
export default function History({ navigate }) {
  const { alerts } = useSafety();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered = alerts.filter(
    (a) => filter === "All" || a.status === filter.toLowerCase(),
  );
  const exportLog = () => {
    const data = alerts.map(({ location, ...a }) => ({
      ...a,
      location: location ? "Coordinates omitted for privacy" : null,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "haven-demo-alerts.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR SAFETY JOURNEY</span>
          <h1>Every moment, accounted for.</h1>
          <p>
            Explore demo alerts, contact responses, and time-stamped updates.
          </p>
        </div>
        <button
          className="outline-button"
          onClick={exportLog}
          disabled={!alerts.length}
        >
          <Icon name="download" size={17} />
          Export activity
        </button>
      </div>
      <div className="stats-grid">
        {[
          ["Total demo alerts", alerts.length, "history"],
          [
            "Acknowledged",
            alerts.filter((a) => a.acknowledgedAt).length,
            "users",
          ],
          [
            "Resolved",
            alerts.filter((a) => a.status === "resolved").length,
            "shield",
          ],
        ].map(([label, value, icon]) => (
          <div className="card stat-card" key={label}>
            <span className="soft-icon">
              <Icon name={icon} />
            </span>
            <div>
              <p>{label}</p>
              <strong>{value.toString().padStart(2, "0")}</strong>
            </div>
          </div>
        ))}
      </div>
      <p className="muted-text history-note">
        Session-only history · Refreshing clears alert data · Export excludes
        location coordinates.
      </p>
      <div className="filter-tabs" aria-label="Filter alerts">
        {["All", "Sent", "Acknowledged", "Resolved"].map((v) => (
          <button
            aria-pressed={filter === v}
            className={filter === v ? "selected" : ""}
            key={v}
            onClick={() => setFilter(v)}
          >
            {v}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <section className="card history-table">
          <div className="table-heading">
            <span>ALERT</span>
            <span>STARTED</span>
            <span>CONTACTS</span>
            <span>STATUS</span>
            <span />
          </div>
          {filtered.map((a) => (
            <button
              className="table-row"
              key={a.id}
              onClick={() => setSelected(selected === a.id ? null : a.id)}
            >
              <strong>
                {a.id}
                <small>SOS · Demo</small>
              </strong>
              <span>
                {formatDate(a.createdAt)}
                <small>{formatTime(a.createdAt)}</small>
              </span>
              <span>{a.contacts.length} contacts</span>
              <span
                className={`pill ${a.status === "resolved" ? "green" : "amber"}`}
              >
                {a.status}
              </span>
              <Icon name="chevron" size={18} />
            </button>
          ))}
        </section>
      ) : (
        <div className="card empty-state">
          <span className="soft-icon">
            <Icon name="history" size={32} />
          </span>
          <h2>
            {alerts.length
              ? "No alerts in this view"
              : "A quiet history is a good history."}
          </h2>
          <p>
            {alerts.length
              ? "Choose another filter to see your activity."
              : "Try the SOS demo to see how alert tracking works."}
          </p>
          {!alerts.length && (
            <button
              className="primary-button"
              onClick={() => navigate("dashboard")}
            >
              Explore the SOS demo
              <Icon name="arrow" size={17} />
            </button>
          )}
        </div>
      )}
      {selected && alerts.find((a) => a.id === selected) && (
        <div className="history-detail">
          <AlertPanel
            alert={alerts.find((a) => a.id === selected)}
            navigate={navigate}
          />
        </div>
      )}
    </>
  );
}
