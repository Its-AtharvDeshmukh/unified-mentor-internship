import { useState } from "react";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import { useSafety } from "../context/SafetyContext";
import { useAuth } from "../context/AuthContext";
export default function Settings() {
  const { profile, setProfile, setToast, reset } = useSafety();
  const { user, logout } = useAuth();
  const soundOn = profile.sosSound !== false;
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [confirm, setConfirm] = useState(false);
  const save = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfile({ ...profile, name: name.trim(), email: email.trim() });
    setToast("Profile saved on this device.");
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE THIS SPACE YOURS</span>
          <h1>A little more personal.</h1>
          <p>Your profile, your preferences, your privacy.</p>
        </div>
      </div>
      <div className="settings-grid">
        <section className="card padded-card">
          <h2>Personal profile</h2>
          <p>
            Your personal profile is saved in this browser. Account access is a
            frontend demonstration with no server authentication.
          </p>
          <form className="form-grid" onSubmit={save}>
            <label>
              Your name
              <input
                required
                maxLength="60"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <button className="primary-button" type="submit">
              Save profile
            </button>
          </form>
        </section>
        <section className="card padded-card">
          <h2>Discreet by default</h2>
          <div className="setting-row">
            <div>
              <strong>Open neutral screen on SOS</strong>
              <p>
                Show a simple notes page immediately after activation. The
                activation chime follows your sound setting below.
              </p>
            </div>
            <button
              className={`toggle ${profile.discreet ? "on" : ""}`}
              role="switch"
              aria-checked={profile.discreet}
              aria-label="Open neutral screen on SOS"
              onClick={() =>
                setProfile({ ...profile, discreet: !profile.discreet })
              }
            >
              <span />
            </button>
          </div>
          <div className="setting-row">
            <div>
              <strong>Sound on SOS activation</strong>
              <p>
                {soundOn
                  ? "A short chime plays once when a new SOS demo starts. Turn this off when you need a silent experience."
                  : "SOS starts silently. Turn this on for a short activation chime."}
              </p>
            </div>
            <button
              className={`toggle ${soundOn ? "on" : ""}`}
              role="switch"
              aria-checked={soundOn}
              aria-label="Sound on SOS activation"
              onClick={() => setProfile({ ...profile, sosSound: !soundOn })}
            >
              <span />
            </button>
          </div>
          <div className="info-banner compact">
            <Icon name="info" size={18} />
            <p>
              The neutral screen hides the app interface; it does not erase
              browser history or guarantee concealment.
            </p>
          </div>
        </section>
        <section className="card padded-card account-settings">
          <div>
            <span className="eyebrow">ACCOUNT & ACCESS</span>
            <h2>
              {user.role === "guest"
                ? "Exploring as a guest."
                : "Your local demo account."}
            </h2>
            <p>
              {user.role === "guest"
                ? "Create an account to try registration and sign-in."
                : `${user.email} · Member access · This browser only`}
            </p>
          </div>
          <button className="outline-button" onClick={logout}>
            <Icon name="logout" size={17} />
            {user.role === "guest" ? "Sign in / Create account" : "Sign out"}
          </button>
        </section>
        <section className="card padded-card privacy-settings">
          <h2>Your data belongs to you.</h2>
          <div className="privacy-points">
            <div>
              <Icon name="users" />
              <strong>Profile & contacts</strong>
              <p>
                Saved in this browser’s local storage. Use fictional details on
                shared devices.
              </p>
            </div>
            <div>
              <Icon name="location" />
              <strong>Location & alerts</strong>
              <p>
                GPS and alert snapshots stay in page memory. The map provider
                receives the geographic area you view.
              </p>
            </div>
            <div>
              <Icon name="lock" />
              <strong>No external notifications</strong>
              <p>
                Contact channels are preferences for demonstration. No providers
                are connected.
              </p>
            </div>
          </div>
          <button className="danger-outline" onClick={() => setConfirm(true)}>
            <Icon name="trash" size={17} />
            Clear local safety data
          </button>
        </section>
      </div>
      {confirm && (
        <Modal
          title="Clear your safety data?"
          onClose={() => setConfirm(false)}
        >
          <p>
            This clears this account’s profile, contacts, and current demo
            alerts. Your demo sign-in remains available. Location tracking will
            stop. This cannot be undone.
          </p>
          <div className="modal-actions">
            <button
              className="outline-button"
              onClick={() => setConfirm(false)}
            >
              Keep my data
            </button>
            <button
              className="danger-button"
              onClick={() => {
                reset();
                setName("Your name");
                setEmail("");
                setConfirm(false);
              }}
            >
              Clear all data
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
