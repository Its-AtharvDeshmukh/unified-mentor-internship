import { useState, useRef, useEffect, useCallback } from "react";
import { manualPosition, validCoordinates } from "../lib/location";
import { createGeolocationTracker } from "../lib/geolocationTracker";
const messages = {
  1: "Location permission is blocked. Allow this site and your browser app to use Location Services.",
  2: "Your device did not provide a location. Check Location Services or try this page in Chrome or Safari.",
  3: "The browser’s location service timed out. Check device/app location access and retry this live-location request.",
};
export default function useGeolocation() {
  const [position, setPosition] = useState(null),
    [status, setStatus] = useState("off"),
    [error, setError] = useState(""),
    [permission, setPermission] = useState("unknown"),
    [highAccuracy, setHighAccuracy] = useState(true),
    [attempt, setAttempt] = useState(null);
  const tracker = useRef(null);
  const ensureTracker = useCallback(() => {
    if (tracker.current) return tracker.current;
    tracker.current = createGeolocationTracker({
      geolocation: navigator.geolocation,
      onPosition: setPosition,
      onState: (state) => {
        setStatus(state.status);
        setAttempt(state);
        if (state.code === 1) setPermission("denied");
        if (state.status === "live") setPermission("granted");
        setError(
          state.status === "stale"
            ? "Updates are paused. The marker is your last known position, not a current live fix."
            : state.code
              ? messages[state.code] || messages[2]
              : "",
        );
      },
    });
    return tracker.current;
  }, []);
  const stop = useCallback(() => {
    tracker.current?.stop();
    setPosition(null);
    setStatus("off");
    setError("");
    setAttempt(null);
  }, []);
  const setManual = useCallback((lat, lng) => {
    const next = manualPosition(lat, lng);
    tracker.current?.stop();
    setPosition(next);
    setStatus("manual");
    setError("");
  }, []);
  const setChosen = useCallback((next) => {
    if (
      !validCoordinates(next.latitude, next.longitude) ||
      !["manual", "search", "network"].includes(next.source)
    )
      throw new Error("Invalid chosen location.");
    tracker.current?.stop();
    setPosition({ ...next, accuracy: null, updatedAt: Date.now() });
    setStatus(next.source);
    setError("");
  }, []);
  const recheckPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermission(result.state);
      if (result.state !== "denied") {
        setError("");
        setStatus((old) => (old === "error" ? "off" : old));
        setAttempt((old) => (old?.code === 1 ? null : old));
      }
      return result.state;
    } catch {
      setPermission("unknown");
      return "unknown";
    }
  }, []);
  const start = useCallback(() => {
    if (!window.isSecureContext || !navigator.geolocation) {
      setStatus("error");
      setError(
        !window.isSecureContext
          ? "Location requires HTTPS or localhost."
          : "This browser does not expose a location API. Open this page in Chrome or Safari, or choose a manual pin.",
      );
      return;
    }
    setPosition((previous) => (previous?.source === "gps" ? previous : null));
    ensureTracker().start({ highAccuracy });
  }, [ensureTracker, highAccuracy]);
  useEffect(() => {
    let alive = true,
      handle;
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((p) => {
        if (!alive) return;
        handle = p;
        const update = () => {
          if (alive) setPermission(p.state);
        };
        update();
        p.onchange = update;
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (handle) handle.onchange = null;
      tracker.current?.stop();
      tracker.current = null;
    };
  }, []);
  return {
    position,
    status,
    error,
    permission,
    highAccuracy,
    setHighAccuracy,
    recheckPermission,
    attempt,
    start,
    stop,
    setManual,
    setChosen,
    capability: {
      secure: window.isSecureContext,
      supported: !!navigator.geolocation,
      embedded: window.self !== window.top,
      policyAllowed:
        (document.permissionsPolicy || document.featurePolicy)?.allowsFeature?.(
          "geolocation",
        ) ?? null,
    },
  };
}
