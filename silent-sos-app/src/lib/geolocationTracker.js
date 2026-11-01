// One user action creates one native position watch. No fabricated timeout errors
// and no second request while the browser is waiting for permission.
export function createGeolocationTracker({
  geolocation,
  onPosition,
  onState,
  clock = globalThis,
}) {
  let version = 0,
    watch = null,
    notice = null,
    lastFix = null;
  const clear = () => {
    if (watch !== null) geolocation.clearWatch(watch);
    watch = null;
    if (notice !== null) clock.clearTimeout(notice);
    notice = null;
  };
  return {
    start({ highAccuracy = true } = {}) {
      clear();
      const request = ++version,
        startedAt = Date.now();
      let callbacks = 0;
      const state = (status, extra = {}) =>
        onState({ status, startedAt, highAccuracy, callbacks, ...extra });
      state("locating", { phase: "requesting", code: null });
      const succeed = (p) => {
        if (request !== version) return;
        callbacks++;
        if (notice !== null) clock.clearTimeout(notice);
        notice = null;
        const c = p?.coords;
        if (
          !c ||
          !Number.isFinite(c.latitude) ||
          !Number.isFinite(c.longitude) ||
          Math.abs(c.latitude) > 90 ||
          Math.abs(c.longitude) > 180
        ) {
          state(lastFix ? "stale" : "error", {
            code: 2,
            message: "The device returned an invalid position.",
            phase: "native-error",
          });
          return;
        }
        lastFix = {
          latitude: c.latitude,
          longitude: c.longitude,
          accuracy: Number.isFinite(c.accuracy) ? Math.round(c.accuracy) : null,
          updatedAt: Number.isFinite(p.timestamp) ? p.timestamp : Date.now(),
          source: "gps",
        };
        onPosition(lastFix);
        state("live", {
          code: null,
          phase: "tracking",
          lastFixAt: lastFix.updatedAt,
        });
      };
      const fail = (e) => {
        if (request !== version) return;
        callbacks++;
        if (notice !== null) clock.clearTimeout(notice);
        notice = null;
        state(lastFix ? "stale" : "error", {
          code: e.code || 2,
          message: String(e.message || ""),
          phase: "native-error",
          native: true,
        });
        if (e.code === 1) clear();
      };
      // This notice describes an unanswered request; it never pretends the API timed out.
      notice = clock.setTimeout(() => {
        if (request === version && !callbacks)
          state("waiting", {
            code: null,
            phase: "waiting-for-browser",
            native: false,
          });
      }, 10000);
      try {
        watch = geolocation.watchPosition(succeed, fail, {
          enableHighAccuracy: highAccuracy,
          maximumAge: 0,
          timeout: 30000,
        });
      } catch (e) {
        fail({ code: e.name === "SecurityError" ? 1 : 2, message: e.message });
      }
    },
    stop() {
      version++;
      clear();
      lastFix = null;
    },
  };
}
