import { useState } from "react";
import Icon from "../components/Icon";
import ContactForm from "../components/ContactForm";
import Modal from "../components/Modal";
import { useSafety } from "../context/SafetyContext";
import { initials } from "../lib/alerts";
export default function Contacts({ addInitially = false }) {
  const { contacts, setContacts, setToast } = useSafety();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(addInitially ? {} : null);
  const [deleting, setDeleting] = useState(null);
  const filtered = contacts.filter((c) =>
    (c.name + " " + c.relationship).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE PEOPLE IN YOUR CORNER</span>
          <h1>Your safety circle.</h1>
          <p>A familiar face. A trusted connection. Keep your people close.</p>
        </div>
        <button className="primary-button" onClick={() => setEditing({})}>
          <Icon name="plus" size={18} />
          Add contact
        </button>
      </div>
      <div className="info-banner">
        <Icon name="lock" size={18} />
        <span>
          Contacts are saved only in this browser. Sample contacts are
          fictional; no messages or invitations are sent.
        </span>
      </div>
      <div className="section-toolbar">
        <h2>
          Trusted contacts{" "}
          <span className="count-badge">{contacts.length}</span>
        </h2>
        <label className="search-input">
          <Icon name="search" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your circle"
            aria-label="Search contacts"
          />
        </label>
      </div>
      <div className="contacts-grid">
        {filtered.map((c, i) => (
          <article className="card person-card" key={c.id}>
            <div className="person-top">
              <span className={`avatar big-avatar avatar-${i % 3}`}>
                {initials(c.name)}
              </span>
              <span className="pill muted">
                {c.sample ? "SAMPLE" : "LOCAL CONTACT"}
              </span>
            </div>
            <h3>{c.name}</h3>
            <p>{c.relationship}</p>
            <div className="person-detail">
              <Icon name="phone" size={16} />
              <span>{c.phone || "No phone added"}</span>
            </div>
            <div className="person-detail">
              <Icon name="mail" size={16} />
              <span>{c.email || "No email added"}</span>
            </div>
            <div className="person-footer">
              <span>{c.channel} preferred</span>
              <button
                className="icon-button"
                aria-label={`Edit ${c.name}`}
                onClick={() => setEditing(c)}
              >
                <Icon name="edit" size={17} />
              </button>
              <button
                className="icon-button"
                aria-label={`Remove ${c.name}`}
                onClick={() => setDeleting(c)}
              >
                <Icon name="trash" size={17} />
              </button>
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className="card empty-state">
            <Icon name="users" size={34} />
            <h3>
              {query ? "No matching contacts" : "Your circle starts here"}
            </h3>
            <p>
              {query
                ? "Try another name or relationship."
                : "Add someone you would want by your side."}
            </p>
            {!query && (
              <button className="primary-button" onClick={() => setEditing({})}>
                Add your first contact
              </button>
            )}
          </div>
        )}
      </div>
      {editing && (
        <ContactForm
          contact={editing.id ? editing : null}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <Modal title="Remove this contact?" onClose={() => setDeleting(null)}>
          <p>
            {deleting.name} will be removed from your local safety circle.
            Existing demo alert snapshots will stay unchanged.
          </p>
          <div className="modal-actions">
            <button
              className="outline-button"
              onClick={() => setDeleting(null)}
            >
              Keep contact
            </button>
            <button
              className="danger-button"
              onClick={() => {
                setContacts(contacts.filter((c) => c.id !== deleting.id));
                setDeleting(null);
                setToast("Contact removed.");
              }}
            >
              Remove contact
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
