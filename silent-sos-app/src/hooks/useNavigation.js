import { useState, useRef, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
export const pageTitles = {
  dashboard: "Overview",
  users: "Trusted contacts",
  location: "Live location",
  history: "Alert history",
  delivery: "Signal Studio",
  settings: "Settings",
  help: "Help & resources",
};
const read = () =>
  pageTitles[location.hash.slice(1)] ? location.hash.slice(1) : "dashboard";
export default function useNavigation() {
  const [page, setPage] = useState(read);
  const current = useRef(page);
  const commit = useCallback((next) => {
    if (current.current === next) return;
    current.current = next;
    // Commit immediately; PageTransition animates the live page without a
    // browser snapshot overlay that can swallow a rapid second navigation.
    flushSync(() => setPage(next));
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const change = () => {
      if (location.hash !== "#main-content") commit(read());
    };
    window.addEventListener("popstate", change);
    window.addEventListener("hashchange", change);
    return () => {
      window.removeEventListener("popstate", change);
      window.removeEventListener("hashchange", change);
    };
  }, [commit]);
  const navigate = useCallback(
    (id) => {
      if (!pageTitles[id]) return;
      if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
      commit(id);
    },
    [commit],
  );
  return { page, navigate };
}
