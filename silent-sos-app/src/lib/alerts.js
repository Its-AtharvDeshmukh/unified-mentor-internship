export function createAlert(contacts, location, now = Date.now()) {
  return {
    id: `SOS-${now.toString(36).toUpperCase()}`,
    createdAt: now,
    status: "sent",
    demo: true,
    contacts: contacts.map(({ id, name, channel }) => ({
      id,
      name,
      channel,
      acknowledged: false,
    })),
    location: location ? { ...location } : null,
    events: [
      { at: now, text: "Demo alert created. No messages were sent." },
      {
        at: now,
        text: location
          ? location.source === "manual"
            ? "Manual map pin attached locally. Not a GPS fix."
            : location.source === "search"
              ? "Confirmed place attached locally. This is a fixed address, not live GPS."
              : location.source === "network"
                ? "Approximate network area attached. Not a precise or live location."
                : "Device location attached locally."
          : "Location unavailable. Alert created without coordinates.",
      },
    ],
  };
}
export function acknowledgeAlert(alert, contactId, now = Date.now()) {
  if (alert.status === "resolved") return alert;
  const contact = alert.contacts.find((c) => c.id === contactId);
  if (!contact || contact.acknowledged) return alert;
  return {
    ...alert,
    status: "acknowledged",
    acknowledgedAt: alert.acknowledgedAt || now,
    contacts: alert.contacts.map((c) =>
      c.id === contactId
        ? { ...c, acknowledged: true, acknowledgedAt: now }
        : c,
    ),
    events: [
      ...alert.events,
      { at: now, text: `${contact.name} acknowledged (simulated).` },
    ],
  };
}
export function resolveAlert(alert, now = Date.now()) {
  if (alert.status === "resolved") return alert;
  return {
    ...alert,
    status: "resolved",
    resolvedAt: now,
    events: [
      ...alert.events,
      { at: now, text: "Marked safe. Local location tracking stopped." },
    ],
  };
}
export const formatTime = (time) =>
  new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const formatDate = (time) =>
  new Date(time).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
