import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
import { initials } from "../lib/alerts";
export default function ContactsCard({ navigate }) {
  const { contacts } = useSafety();
  return (
    <section className="essential-contacts-card">
      <div className="essential-card-heading">
        <div>
          <span className="eyebrow">THE PEOPLE WHO MATTER</span>
          <h3>Your trusted circle.</h3>
        </div>
        <span className="essential-contact-count">
          {contacts.length.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="essential-contact-list">
        {contacts.slice(0, 3).map((c, i) => (
          <button
            className="essential-contact-row"
            key={c.id}
            onClick={() => navigate("users")}
          >
            <span className={`avatar avatar-${i % 3}`}>{initials(c.name)}</span>
            <span>
              <strong>{c.name}</strong>
              <small>
                {c.relationship}
                {c.sample ? " · Demo contact" : ""}
              </small>
            </span>
            <span className="essential-contact-channel">
              <Icon name={c.channel === "Email" ? "mail" : "phone"} size={15} />
              {c.channel}
            </span>
            <Icon name="chevron" size={14} />
          </button>
        ))}
        {!contacts.length && (
          <div className="essential-circle-empty">
            <Icon name="users" size={30} />
            <strong>Start with one person you trust.</strong>
            <p>Add someone you would want to reach in an emergency.</p>
          </div>
        )}
      </div>
      <button
        className="essential-add-contact"
        onClick={() => navigate("users", true)}
      >
        <span>
          <Icon name="plus" size={17} />
          Add trusted contact
        </span>
        <Icon name="arrow" size={17} />
      </button>
    </section>
  );
}
