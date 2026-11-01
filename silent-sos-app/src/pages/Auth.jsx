import { useState, useEffect } from "react";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
export default function Auth() {
  const { login, register, enterDemo } = useAuth();
  const [mode, setMode] = useState(
    window.location.hash === "#register" ? "register" : "signin",
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => {
    const sync = () => {
      setMode(window.location.hash === "#register" ? "register" : "signin");
      setError("");
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const change = (e) =>
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  const switchMode = (next) => {
    setMode(next);
    setError("");
    setForm((old) => ({ ...old, password: "", confirm: "" }));
    window.location.hash = next;
  };
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && form.password !== form.confirm) {
      setError("Your passwords need to match.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") await register(form);
      else await login(form.email, form.password);
      window.location.hash = mode === "register" ? "users" : "dashboard";
    } catch (err) {
      setError(
        err.message || "Unable to open your local account. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="auth-page">
      <section className="auth-story">
        <a className="auth-brand" href="#signin">
          <Icon name="shield" size={32} />
          haven<span>.</span>
        </a>
        <span className="auth-orbit orbit-a" />
        <span className="auth-orbit orbit-b" />
        <div className="auth-story-copy">
          <span className="eyebrow">YOUR EVERYDAY BACKUP</span>
          <h1>
            Your people.
            <br />
            Your place.
            <br />
            <em>Your peace of mind.</em>
          </h1>
          <p>
            One personal space for the people you trust and the moments that
            matter.
          </p>
          <div className="auth-connection-art" aria-hidden="true">
            <span>
              <Icon name="fingerprint" size={32} />
            </span>
            <i />
            <i />
            <i />
            <span>
              <Icon name="heart" size={32} />
            </span>
          </div>
        </div>
        <div className="auth-story-footer">
          <Icon name="mute" size={17} />
          YOUR SIGNAL. YOUR CHOICE.<span>✳</span>CONNECTED BY CHOICE
        </div>
      </section>
      <section className="auth-form-area">
        <div className="auth-mode">
          <span>HAVEN / PERSONAL SPACE</span>
          <span className="pill amber">LOCAL DEMO</span>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-tabs">
            <button
              className={mode === "signin" ? "selected" : ""}
              onClick={() => switchMode("signin")}
            >
              Sign in
            </button>
            <button
              className={mode === "register" ? "selected" : ""}
              onClick={() => switchMode("register")}
            >
              Create account
            </button>
          </div>
          <span className="eyebrow">
            {mode === "register"
              ? "LET’S MAKE THIS YOURS"
              : "YOUR SPACE IS WAITING"}
          </span>
          <h2>
            {mode === "register"
              ? "Good things start here."
              : "Hey, welcome back."}
          </h2>
          <p>
            {mode === "register"
              ? "Set up your local demo account and build your safety circle."
              : "Sign in to the account you created in this browser."}
          </p>
          <form onSubmit={submit} className="form-grid">
            {mode === "register" && (
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength="60"
                  value={form.name}
                  onChange={change}
                  placeholder="What should we call you?"
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                value={form.email}
                onChange={change}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Demo password
              <div className="password-field">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  minLength={mode === "register" ? 8 : undefined}
                  required
                  value={form.password}
                  onChange={change}
                  placeholder={
                    mode === "register"
                      ? "At least 8 characters"
                      : "Your demo password"
                  }
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow(!show)}
                >
                  <Icon name={show ? "eyeOff" : "eye"} size={18} />
                </button>
              </div>
            </label>
            {mode === "register" && (
              <label>
                Confirm password
                <input
                  type={show ? "text" : "password"}
                  name="confirm"
                  autoComplete="new-password"
                  required
                  value={form.confirm}
                  onChange={change}
                  placeholder="One more time"
                />
              </label>
            )}
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary-button" type="submit" disabled={busy}>
              {busy
                ? "Opening your space…"
                : mode === "register"
                  ? "Create my demo account"
                  : "Sign in"}
              <Icon name="arrow" size={18} />
            </button>
          </form>
          <div className="auth-divider">
            <span />
            or explore first
            <span />
          </div>
          <button
            className="outline-button full-width"
            onClick={() => {
              enterDemo();
              window.location.hash = "dashboard";
            }}
          >
            Try the interactive demo
            <Icon name="upRight" size={18} />
          </button>
          <div className="auth-disclosure">
            <Icon name="info" size={18} />
            <p>
              Frontend account demo only. Credentials are checked locally; this
              is not secure server authentication. Use a fictional email and a
              password you don’t use elsewhere. No verification email is sent.
            </p>
          </div>
        </div>
        <footer className="auth-bottom">
          YOUR SAFETY. YOUR PEOPLE. YOUR SPACE.
        </footer>
      </section>
    </main>
  );
}
