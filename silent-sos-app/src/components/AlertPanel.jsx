import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
import { formatTime } from "../lib/alerts";
export default function AlertPanel({ alert, navigate }) {
  const { acknowledge, resolve } = useSafety();
  return (
    <section className="card alert-panel">
      <div className="card-heading">
        <div>
          <span className="eyebrow">DEMO ALERT · {alert.id}</span>
          <h3>
            {alert.status === "resolved"
              ? "You marked this demo as safe."
              : "Your demo is in progress."}
          </h3>
        </div>
        <span
          className={`pill ${alert.status === "resolved" ? "green" : "amber"}`}
        >
          {alert.status}
        </span>
      </div>
      <p className="muted-text">
        No SMS or email was sent. Use the controls below to simulate a trusted
        contact’s response.
      </p>
      {navigate && (
        <button
          className="alert-delivery-link"
          onClick={() => navigate("delivery")}
        >
          Trace this signal in Signal Studio
          <Icon name="upRight" size={16} />
        </button>
      )}
      <div className="response-list">
        {alert.contacts.map((c) => (
          <div className="response-row" key={c.id}>
            <span>
              <Icon name={c.acknowledged ? "success" : "clock"} size={17} />
              {c.name}
            </span>
            {c.acknowledged ? (
              <small className="text-green">Acknowledged · simulated</small>
            ) : alert.status !== "resolved" ? (
              <button
                className="small-button"
                onClick={() => acknowledge(alert.id, c.id)}
              >
                Simulate acknowledgment
              </button>
            ) : (
              <small>No acknowledgment</small>
            )}
          </div>
        ))}
      </div>
      <ol className="timeline">
        {alert.events.map((e, i) => (
          <li key={i}>
            <span className="timeline-dot" />
            <p>{e.text}</p>
            <time>{formatTime(e.at)}</time>
          </li>
        ))}
      </ol>
      {alert.status !== "resolved" && (
        <button className="primary-button" onClick={() => resolve(alert.id)}>
          <Icon name="check" size={18} />
          I’m safe — resolve demo
        </button>
      )}
    </section>
  );
}
