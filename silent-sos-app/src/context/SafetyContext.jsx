import { createContext, useContext, useState, useEffect, useRef } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useGeolocation from "../hooks/useGeolocation";
import { createAlert, acknowledgeAlert, resolveAlert } from "../lib/alerts";
import { playSosChime } from "../lib/sosSound";
const SafetyContext = createContext(null);
const sampleContacts = [
  {
    id: "sample-1",
    name: "Priya Sharma",
    relationship: "Friend",
    phone: "+91 00000 00001",
    email: "priya@example.com",
    channel: "SMS",
    sample: true,
  },
  {
    id: "sample-2",
    name: "Arjun Patel",
    relationship: "Family",
    phone: "+91 00000 00002",
    email: "arjun@example.com",
    channel: "Email",
    sample: true,
  },
  {
    id: "sample-3",
    name: "Neha Desai",
    relationship: "Roommate",
    phone: "+91 00000 00003",
    email: "neha@example.com",
    channel: "SMS",
    sample: true,
  },
];
export function SafetyProvider({ children, account }) {
  const [contacts, setContacts, contactsError] = useLocalStorage(
    `haven-contacts-${account.id}-v1`,
    account.role === "guest" ? sampleContacts : [],
    (v) =>
      Array.isArray(v) &&
      v.every(
        (c) => c && typeof c.id === "string" && typeof c.name === "string",
      ),
  );
  const [profile, setProfile, profileError] = useLocalStorage(
    `haven-profile-${account.id}-v1`,
    {
      name: account.name,
      email: account.email,
      discreet: true,
      sosSound: true,
    },
    (v) => v && typeof v.name === "string" && typeof v.discreet === "boolean",
  );
  const [alerts, setAlerts] = useState([]); // Sensitive alert/location data stays in memory, never localStorage.
  const [neutral, setNeutral] = useState(false);
  const [toast, setToast] = useState("");
  const [online, setOnline] = useState(navigator.onLine);
  const location = useGeolocation();
  const active = alerts.find((a) => a.status !== "resolved");
  const activeLock = useRef(false);
  const stopChime = useRef(null);
  useEffect(() => () => stopChime.current?.(), []);
  useEffect(() => {
    const on = () => setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!location.position) return;
    setAlerts((old) =>
      old.map((a) =>
        a.status === "resolved" ? a : { ...a, location: location.position },
      ),
    );
  }, [location.position]);
  const trigger = () => {
    if (activeLock.current || active) {
      if (profile.discreet) setNeutral(true);
      return;
    }
    if (!contacts.length) {
      setToast("Add at least one trusted contact before starting a demo.");
      return;
    }
    activeLock.current = true;
    setAlerts((old) => [createAlert(contacts, location.position), ...old]);
    if (profile.sosSound !== false) {
      stopChime.current?.();
      stopChime.current = playSosChime();
    }
    if (profile.discreet) setNeutral(true);
  };
  const acknowledge = (id, contactId) =>
    setAlerts((old) =>
      old.map((a) => (a.id === id ? acknowledgeAlert(a, contactId) : a)),
    );
  const resolve = (id) => {
    stopChime.current?.();
    setAlerts((old) => old.map((a) => (a.id === id ? resolveAlert(a) : a)));
    activeLock.current = false;
    location.stop();
    setToast("Demo resolved. Location tracking stopped.");
  };
  const reset = () => {
    setContacts([]);
    setProfile({
      name: "Your name",
      email: "",
      discreet: true,
      sosSound: true,
    });
    stopChime.current?.();
    setAlerts([]);
    location.stop();
    activeLock.current = false;
    setToast("Local data cleared.");
  };
  return (
    <SafetyContext.Provider
      value={{
        contacts,
        setContacts,
        profile,
        setProfile,
        alerts,
        active,
        trigger,
        acknowledge,
        resolve,
        location,
        neutral,
        setNeutral,
        toast,
        setToast,
        online,
        reset,
        storageError: contactsError || profileError,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
}
export const useSafety = () => useContext(SafetyContext);
