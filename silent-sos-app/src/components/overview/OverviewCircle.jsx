import Icon from "../Icon";
import { initials } from "../../lib/alerts";
import { useSafety } from "../../context/SafetyContext";

export default function OverviewCircle({ navigate }) {
  const { contacts } = useSafety();
  return (
    <section
      className="ov-card ov-circle cw-card cw-circle"
      data-overview-reveal
    >
      <div className="cw-aligned-heading">
        <h3>Trusted contacts</h3>
        <span className="cw-circle-count">
          {String(contacts.length).padStart(2, "0")}
        </span>
      </div>
      <p className="cw-circle-intro">
        Your trusted circle. Always your choice.
      </p>
      <div className="cw-people-list">
        {contacts.slice(0, 3).map((c, i) => (
          <button
            className="cw-person"
            key={c.id}
            onClick={() => navigate("users")}
          >
            <span className={`cw-person-avatar avatar-tone-${i}`}>
              {initials(c.name)}
            </span>
            <span className="cw-person-name">
              <strong>{c.name}</strong>
              <small>
                {c.relationship || "Trusted contact"}
                {c.sample ? " · Sample" : ""}
              </small>
            </span>
            <span className="cw-channel">
              <Icon name={c.channel === "Email" ? "mail" : "phone"} size={14} />
              <span>{c.channel}</span>
            </span>
            <Icon name="chevron" size={15} />
          </button>
        ))}
        {!contacts.length && (
          <div className="cw-circle-empty">
            <div className="cw-trust-illustration" aria-hidden="true">
              <span className="cw-trust-orbit" />
              <span className="cw-trust-person">
                <Icon name="users" size={37} />
              </span>
              <span className="cw-trust-heart">
                <Icon name="heart" size={20} />
              </span>
              <span className="cw-trust-star">✳</span>
              <i />
            </div>
            <strong>Every circle starts with one.</strong>
            <p>
              A friend, a roommate, your family.
              <br />
              Start with someone you trust.
            </p>
          </div>
        )}
        {contacts.length > 0 && contacts.length < 3 && (
          <div className="cw-circle-small-note">
            <span aria-hidden="true">✳</span>
            <p>
              Small circle.
              <br />
              <strong>Meaningful connections.</strong>
            </p>
          </div>
        )}
      </div>
      <button
        className="cw-add-contact"
        onClick={() => navigate("users", true)}
      >
        <span>
          <Icon name="plus" size={18} />
          Add trusted contact
        </span>
        <Icon name="arrow" size={18} />
      </button>
    </section>
  );
}
