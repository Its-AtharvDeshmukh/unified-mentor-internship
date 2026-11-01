import Icon from "../components/Icon";
const questions = [
  [
    "Does this app send real emergency alerts?",
    "No. Haven is a frontend internship project. SOS creates a local demonstration only. It does not send SMS, email, in-app messages to other users, or contact emergency services.",
  ],
  [
    "What happens when I tap SOS?",
    "A demo alert is created with a snapshot of your trusted contacts and your available location. Discreet mode opens a neutral notes page immediately. A short chime plays if Sound on SOS activation is enabled; turn it off for silent activation. Return to Haven, open Alert history, and simulate an acknowledgment or mark yourself safe.",
  ],
  [
    "How do I return from the neutral screen?",
    "Use the prominent “Back to workspace” button at the top right of the notes page. The demo alert remains in this browser tab until you resolve it or refresh.",
  ],
  [
    "Why can’t Haven find my location?",
    "Location requires HTTPS (or localhost), a supported browser, and your permission. If permission was denied, enable location in your browser’s site settings and try again. GPS accuracy depends on your device and surroundings.",
  ],
  [
    "What happens if I lose connection or close the tab?",
    "The loaded frontend can still demonstrate a local alert, but it cannot deliver anything. Browsers may pause background tabs. Closing or refreshing clears session alerts and stops location tracking. There is no offline SMS fallback.",
  ],
  [
    "Can trusted contacts see my location?",
    "No. There is no backend or contact portal in this build. Contacts cannot see your coordinates in this demo. The interactive map uses OpenFreeMap vector tiles using OpenStreetMap data; its provider receives the viewed map area. Contact acknowledgments are explicitly simulated.",
  ],
  [
    "How do demo accounts work?",
    "Create an account with a fictional email and a unique demo password. Sign-in checks a salted password hash stored in this browser. Each account has separate local profile and contact data. This is a frontend account flow, not secure server authentication or authorization. Signing out stops location tracking and clears session alerts.",
  ],
  [
    "How does the map work?",
    "The map shows real OpenFreeMap vector tiles using OpenStreetMap data. Choose Minimal, Street, or Dark; drag to pan and use + or − to zoom. Enable your device location to see your actual position and accuracy circle. Moving the map turns following off; use the recenter control to follow your device again. The map provider receives the viewed geographic area. If GPS is unavailable, choose a manual pin or enter coordinates; the app labels that source explicitly.",
  ],
  [
    "Is this ready to use as an emergency service?",
    "No. A real deployment needs secure authentication, a protected backend, tested message delivery with retries, receiver acknowledgment, monitoring, and appropriate privacy controls. This project demonstrates the interface and interaction flows only.",
  ],
];
export default function Help({ navigate }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE GUIDANCE</span>
          <h1>Feel at home with Haven.</h1>
          <p>Everything you need to explore your personal safety space.</p>
        </div>
      </div>
      <section className="how-it-works">
        {[
          [
            "01",
            "users",
            "Build your circle",
            "Add people you trust and choose their preferred demo contact channel.",
            "users",
          ],
          [
            "02",
            "fingerprint",
            "Try a quiet action",
            "Tap SOS once. Discreet mode opens a neutral screen; your sound setting controls the activation chime.",
            "dashboard",
          ],
          [
            "03",
            "shield",
            "Follow the response",
            "Simulate a contact acknowledgment, view the timeline, and resolve the demo.",
            "history",
          ],
        ].map(([n, icon, title, copy, page]) => (
          <button
            className="card step-card"
            key={n}
            onClick={() => navigate(page)}
          >
            <div>
              <span className="soft-icon">
                <Icon name={icon} />
              </span>
              <span className="step-number">{n}</span>
            </div>
            <h2>{title}</h2>
            <p>{copy}</p>
            <Icon name="arrow" size={20} />
          </button>
        ))}
      </section>
      <section className="card faq-card">
        <h2>A few things you might be wondering.</h2>
        {questions.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Icon name="plus" size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <section className="research-note">
        <Icon name="book" size={24} />
        <div>
          <h3>Thoughtfully researched. Independently designed.</h3>
          <p>
            Haven’s original interface draws on personal safety interaction
            patterns from{" "}
            <a
              href="https://bsafeworld.com/platform"
              target="_blank"
              rel="noreferrer"
            >
              bSafe
            </a>{" "}
            and{" "}
            <a
              href="https://www.noonlight.com/noonlight-app"
              target="_blank"
              rel="noreferrer"
            >
              Noonlight
            </a>
            . Location handling follows{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition"
              target="_blank"
              rel="noreferrer"
            >
              MDN’s Geolocation API guidance
            </a>
            . No affiliation or service integration is implied.
          </p>
        </div>
      </section>
    </>
  );
}
