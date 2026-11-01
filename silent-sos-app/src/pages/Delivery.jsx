import { useState, useEffect } from "react";
import Icon from "../components/Icon";
import AlertPanel from "../components/AlertPanel";
import { useSafety } from "../context/SafetyContext";
import { initials, formatTime } from "../lib/alerts";
import { locationSourceLabel } from "../lib/locationProviders";
export default function Delivery({ navigate }) {
  const { active, alerts, trigger, acknowledge, profile, setToast } =
    useSafety();
  const alert = active || alerts[0];
  const [selected, setSelected] = useState(null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active?.id]);
  const recipient =
    alert?.contacts.find((c) => c.id === selected) || alert?.contacts[0];
  const count = alert?.contacts.filter((c) => c.acknowledged).length || 0;
  const elapsed = alert
    ? Math.max(
        0,
        Math.floor(((alert.resolvedAt || now) - alert.createdAt) / 1000),
      )
    : 0;
  const response = alert?.acknowledgedAt
    ? ((alert.acknowledgedAt - alert.createdAt) / 1000).toFixed(1)
    : null;
  const copy = async () => {
    if (!alert) return;
    try {
      await navigator.clipboard.writeText(
        `HAVEN — DEMO ONLY\n${alert.id}\nStatus: ${alert.status}\nCreated: ${new Date(alert.createdAt).toLocaleString()}\nAcknowledgments: ${count}/${alert.contacts.length} (simulated)\nLocation: ${alert.location ? locationSourceLabel(alert.location) : "Unavailable"}\nNo real notifications were sent.`,
      );
      setToast("Demo summary copied. Coordinates were omitted.");
    } catch {
      setToast("Clipboard access is unavailable in this browser.");
    }
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LOOK BEHIND YOUR QUIET SIGNAL</span>
          <h1>
            Signal Studio.
            <br className="mobile-title-break" />
            <span className="muted-heading">Every step, connected.</span>
          </h1>
          <p>
            An interactive delivery rehearsal. Explore what a trusted contact
            could see.
          </p>
        </div>
        <span className="pill amber">SIMULATION ONLY</span>
      </div>
      <div className="studio-disclosure">
        <Icon name="info" size={18} />
        <p>
          This is a local preview. Nothing is delivered to a real contact, email
          provider, or emergency service.
        </p>
      </div>
      {!alert ? (
        <section className="studio-welcome">
          <div className="studio-welcome-art">
            <span>
              <Icon name="fingerprint" size={43} />
            </span>
            <i />
            <span>
              <Icon name="users" size={43} />
            </span>
          </div>
          <span className="eyebrow">PRACTICE MAKES IT FAMILIAR</span>
          <h2>
            One signal.
            <br />A whole circle of possibility.
          </h2>
          <p>
            Start a demo to see its route, preview a recipient’s message,
            simulate acknowledgment, and follow the response timeline.
          </p>
          <button className="primary-button" onClick={trigger}>
            Start an SOS rehearsal
            <Icon name="arrow" size={18} />
          </button>
          <button className="text-link" onClick={() => navigate("users")}>
            Manage your circle
            <Icon name="upRight" size={15} />
          </button>
          <small>
            Your discreet screen opens first. Use “Back to workspace” to
            continue this rehearsal.
          </small>
        </section>
      ) : (
        <>
          <div className="delivery-metrics">
            <div>
              <span>YOUR SIGNAL</span>
              <strong>
                {alert.status === "resolved"
                  ? "All wrapped up."
                  : alert.status === "acknowledged"
                    ? "Your circle responded."
                    : "Waiting for a demo response."}
              </strong>
              <small>{alert.id}</small>
            </div>
            <div>
              <span>ACKNOWLEDGMENTS</span>
              <strong>
                {count}
                <small> / {alert.contacts.length}</small>
              </strong>
            </div>
            <div>
              <span>FIRST DEMO RESPONSE</span>
              <strong>{response ? `${response}s` : "—"}</strong>
            </div>
            <div>
              <span>
                {alert.status === "resolved" ? "DEMO DURATION" : "TIME ELAPSED"}
              </span>
              <strong>
                {Math.floor(elapsed / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(elapsed % 60).toString().padStart(2, "0")}
              </strong>
            </div>
          </div>
          <section className="signal-route-card">
            <div className="signal-route-heading">
              <h2>A signal has a story.</h2>
              <span>SIMULATED DELIVERY PATH</span>
            </div>
            <div className="signal-route">
              <div className="route-stage complete">
                <span>
                  <Icon name="fingerprint" size={25} />
                </span>
                <strong>You activate</strong>
                <small>{formatTime(alert.createdAt)}</small>
              </div>
              <div className="route-connector">
                <i />
              </div>
              <div className="route-stage complete">
                <span>
                  <Icon name="location" size={25} />
                </span>
                <strong>Context attached</strong>
                <small>
                  {alert.location
                    ? locationSourceLabel(alert.location)
                    : "No location available"}
                </small>
              </div>
              <div className="route-connector">
                <i />
              </div>
              <div className="route-stage complete">
                <span>
                  <Icon name="users" size={25} />
                </span>
                <strong>Your circle</strong>
                <small>{alert.contacts.length} local recipient snapshots</small>
              </div>
              <div className="route-connector">
                <i />
              </div>
              <div className={`route-stage ${count ? "complete" : ""}`}>
                <span>
                  <Icon name={count ? "success" : "clock"} size={25} />
                </span>
                <strong>{count ? "Acknowledged" : "Awaiting response"}</strong>
                <small>
                  {count ? "Manually simulated" : "Use the preview below"}
                </small>
              </div>
            </div>
          </section>
          <div className="delivery-grid">
            <section className="recipient-preview-section">
              <div className="recipient-preview-heading">
                <div>
                  <span className="eyebrow">THE OTHER SIDE OF THE SIGNAL</span>
                  <h2>
                    A familiar face.
                    <br />A clear message.
                  </h2>
                </div>
                <Icon name="mail" size={24} />
              </div>
              <div className="recipient-tabs" aria-label="Preview recipient">
                {alert.contacts.map((c) => (
                  <button
                    key={c.id}
                    className={recipient?.id === c.id ? "selected" : ""}
                    onClick={() => setSelected(c.id)}
                  >
                    {initials(c.name)}
                    <span>{c.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
              {recipient && (
                <article className="recipient-message">
                  <div className="message-app-label">
                    <span>
                      <Icon name="shield" size={17} />
                      HAVEN
                    </span>
                    <span>LOCAL PREVIEW</span>
                  </div>
                  <div className="message-sender">
                    <span className="avatar">{initials(profile.name)}</span>
                    <div>
                      <strong>
                        {profile.name.split(" ")[0]}’s quiet signal
                      </strong>
                      <small>
                        {formatTime(alert.createdAt)} · {recipient.channel}{" "}
                        concept preview
                      </small>
                    </div>
                  </div>
                  <h3>
                    {alert.status === "resolved"
                      ? "This demo is marked safe."
                      : "Someone in your circle reached out."}
                  </h3>
                  <p>
                    Hi {recipient.name.split(" ")[0]}, this is a preview of the
                    context you could receive from {profile.name.split(" ")[0]}{" "}
                    during an alert.
                  </p>
                  <div className="message-location">
                    <Icon name="location" size={19} />
                    <div>
                      <strong>
                        {alert.location
                          ? locationSourceLabel(alert.location)
                          : "Location unavailable"}
                      </strong>
                      <p>
                        {alert.location
                          ? "Coordinates are intentionally hidden in this preview."
                          : "No location is fabricated or assumed."}
                      </p>
                    </div>
                  </div>
                  {recipient.acknowledged ? (
                    <div className="recipient-confirmation">
                      <Icon name="success" size={19} />
                      Acknowledged in this demo
                    </div>
                  ) : alert.status === "resolved" ? (
                    <p className="recipient-resolved">
                      This rehearsal has ended.
                    </p>
                  ) : (
                    <button
                      className="primary-button full-width"
                      onClick={() => acknowledge(alert.id, recipient.id)}
                    >
                      Simulate “I’ve seen this”
                      <Icon name="check" size={17} />
                    </button>
                  )}
                  <small className="message-preview-note">
                    Not a real message. No communication leaves this browser.
                  </small>
                </article>
              )}
            </section>
            <div className="delivery-timeline">
              <AlertPanel alert={alert} />
              <button className="outline-button full-width" onClick={copy}>
                <Icon name="download" size={17} />
                Copy demo summary
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
