import { useState } from "react";
import Modal from "./Modal";
import { useSafety } from "../context/SafetyContext";
export default function ContactForm({ contact, onClose }) {
  const { contacts, setContacts, setToast } = useSafety();
  const [form, setForm] = useState(
    contact || {
      name: "",
      relationship: "Friend",
      phone: "",
      email: "",
      channel: "SMS",
    },
  );
  const [error, setError] = useState("");
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const clean = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };
    if (!clean.name) {
      setError("Please enter a name.");
      return;
    }
    if (
      clean.channel === "SMS" &&
      (!/^\+?[\d\s()-]{7,20}$/.test(clean.phone) ||
        clean.phone.replace(/\D/g, "").length < 7)
    ) {
      setError("Enter a valid phone number for SMS.");
      return;
    }
    if (
      clean.channel === "Email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)
    ) {
      setError("Enter a valid email address.");
      return;
    }
    const updated = {
      ...clean,
      id: contact?.id || crypto.randomUUID(),
      sample: false,
    };
    setContacts(
      contact
        ? contacts.map((c) => (c.id === contact.id ? updated : c))
        : [...contacts, updated],
    );
    setToast(
      contact
        ? "Contact updated on this device."
        : "Contact added on this device.",
    );
    onClose();
  };
  return (
    <Modal
      title={contact ? "Edit trusted contact" : "Add a trusted contact"}
      onClose={onClose}
    >
      <p className="modal-intro">
        Choose someone you trust. This demo stores contacts in your browser and
        sends no invitations.
      </p>
      <form onSubmit={submit} className="form-grid">
        <label>
          Full name
          <input
            autoFocus
            required
            maxLength="60"
            name="name"
            value={form.name}
            onChange={change}
            placeholder="e.g. Sam Taylor"
          />
        </label>
        <label>
          Relationship
          <select
            name="relationship"
            value={form.relationship}
            onChange={change}
          >
            {[
              "Friend",
              "Family",
              "Partner",
              "Roommate",
              "Colleague",
              "Other",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Phone number
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={change}
            placeholder="+91 98765 43210"
            required={form.channel === "SMS"}
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            placeholder="sam@example.com"
            required={form.channel === "Email"}
          />
        </label>
        <label>
          Preferred demo channel
          <select name="channel" value={form.channel} onChange={change}>
            <option>SMS</option>
            <option>Email</option>
          </select>
        </label>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <button type="button" className="outline-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            {contact ? "Save changes" : "Add contact"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
