import Icon from "../Icon";
import { initials } from "../../lib/alerts";
export default function SignalCircleLink({ contacts, navigate }) {
  return (
    <button
      className={`signal-circle-link ${contacts.length ? "has-contacts" : ""}`}
      onClick={() => navigate("users", !contacts.length)}
    >
      <span className="signal-circle-avatars" aria-hidden="true">
        {contacts.slice(0, 3).map((c, i) => (
          <span className={`signal-circle-avatar person-${i}`} key={c.id}>
            {initials(c.name)}
          </span>
        ))}
        {!contacts.length && (
          <span className="signal-circle-avatar empty">
            <Icon name="plus" size={22} />
          </span>
        )}
      </span>
      <span>
        <strong>
          {contacts.length
            ? `${contacts.length} ${contacts.length === 1 ? "person" : "people"} in your corner`
            : "Start with someone you trust"}
        </strong>
        <small>
          {contacts.length
            ? "Your circle. Chosen by you."
            : "Add your first trusted contact"}
        </small>
      </span>
      <Icon name="upRight" size={18} />
    </button>
  );
}
