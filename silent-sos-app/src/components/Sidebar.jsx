import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
import { initials } from "../lib/alerts";
const navigation = [
  { id: "dashboard", label: "Overview", index: "01" },
  { id: "users", label: "My circle", index: "02" },
  { id: "location", label: "Live location", index: "03" },
  { id: "history", label: "Activity", index: "04" },
  { id: "delivery", label: "Signal Studio", index: "05", icon: "radio" },
  { id: "settings", label: "Preferences", index: "06" },
];
export default function Sidebar({ page, navigate, open, close }) {
  const { profile, contacts, active } = useSafety();
  const panel = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [canHover, setCanHover] = useState(
    () => matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const closeRef = useRef(close);
  closeRef.current = close;
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width: 800px)").matches,
  );
  const collapsed = !mobile && canHover && !hovered && !keyboardFocus;
  const previousMainX = useRef(null);
  const mainMotion = useRef(null);
  const previousRailWidth = useRef(null);
  const railMotion = useRef(null);
  useLayoutEffect(() => {
    const rail = panel.current;
    const main = rail?.parentElement?.querySelector(".main-shell");
    if (!main || !rail) return;
    const startRailWidth =
      railMotion.current?.playState === "running"
        ? rail.getBoundingClientRect().width
        : previousRailWidth.current;
    const finalX = main.offsetLeft;
    const mainStyle = getComputedStyle(main);
    const transform = mainStyle.transform;
    const offset =
      transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
    const from = (previousMainX.current ?? finalX) + offset - finalX;
    mainMotion.current?.cancel();
    railMotion.current?.cancel();
    const finalRailWidth = rail.offsetWidth;
    previousMainX.current = finalX;
    previousRailWidth.current = finalRailWidth;
    if (
      !mobile &&
      canHover &&
      Math.abs(from) > 0.5 &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // One content layout/map resize; the rail and workspace share one clock.
      const timing = {
        duration:
          parseFloat(mainStyle.getPropertyValue("--navigation-duration")) || 480,
        easing: "cubic-bezier(.22,.68,.22,1)",
      };
      railMotion.current = rail.animate(
        [
          { width: `${startRailWidth ?? finalRailWidth}px` },
          { width: `${finalRailWidth}px` },
        ],
        timing,
      );
      mainMotion.current = main.animate(
        [
          { transform: `translateX(${from}px)` },
          { transform: "translateX(0)" },
        ],
        timing,
      );
    }
  }, [collapsed, mobile, canHover]);
  useEffect(() => {
    const resized = () => {
      mainMotion.current?.cancel();
      railMotion.current?.cancel();
      const main = panel.current?.parentElement?.querySelector(".main-shell");
      previousMainX.current = main?.offsetLeft ?? null;
      previousRailWidth.current = panel.current?.offsetWidth ?? null;
    };
    window.addEventListener("resize", resized);
    return () => {
      window.removeEventListener("resize", resized);
      mainMotion.current?.cancel();
      railMotion.current?.cancel();
    };
  }, []);
  useEffect(() => {
    const media = matchMedia("(hover: hover) and (pointer: fine)");
    const change = () => {
      setCanHover(media.matches);
      setHovered(false);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const media = matchMedia("(max-width: 800px)");
    const change = () => setMobile(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!open || !mobile) return;
    const before = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = () =>
      [...panel.current.querySelectorAll("a,button")].filter(
        (el) => el.getClientRects().length,
      );
    controls()[0]?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const items = controls(),
          first = items[0],
          last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      before?.focus();
    };
  }, [open, mobile]);
  return (
    <>
      <div
        className={`navigation-scrim ${open ? "visible" : ""}`}
        onClick={close}
      />
      <aside
        ref={panel}
        inert={mobile && !open}
        aria-hidden={mobile && !open ? true : undefined}
        role={mobile ? "dialog" : undefined}
        aria-modal={mobile && open ? true : undefined}
        className={`navigation-panel hover-navigation ${open ? "expanded" : ""} ${collapsed ? "is-collapsed" : ""}`}
        aria-label="Haven workspace"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" || event.pointerType === "pen")
            setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={() => setKeyboardFocus(false)}
        onFocusCapture={(event) =>
          setKeyboardFocus(event.target.matches(":focus-visible"))
        }
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setKeyboardFocus(false);
        }}
      >
        <button
          className="navigation-close"
          onClick={close}
          aria-label="Close navigation"
        >
          <Icon name="close" size={18} />
        </button>
        <a
          href="#dashboard"
          className="navigation-logo"
          onClick={(event) => {
            event.preventDefault();
            navigate("dashboard");
          }}
          aria-label="Haven overview"
        >
          <span className="navigation-emblem">
            <Icon name="shield" size={25} />
          </span>
          <span>
            haven<span className="navigation-period">.</span>
            <small>YOUR EVERYDAY BACKUP</small>
          </span>
        </a>
        <button
          className="workspace-switch"
          aria-label={`Open ${profile.name}'s profile`}
          onClick={() => navigate("settings")}
        >
          <span className="workspace-avatar">{initials(profile.name)}</span>
          <span>
            <strong>{profile.name.split(" ")[0]}’s space</strong>
            <small>Personal · Demo account</small>
          </span>
          <Icon name="down" size={13} />
        </button>
        <div className="navigation-section-label">
          <span>YOUR SPACE</span>
          <span>06</span>
        </div>
        <nav className="navigation-links" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-label={item.label}
              title={collapsed ? item.label : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigate(item.id);
              }}
              aria-current={page === item.id ? "page" : undefined}
              className={`navigation-link ${page === item.id ? "is-current" : ""}`}
            >
              <span className="navigation-icon">
                <Icon name={item.icon || item.id} size={19} />
              </span>
              <span>{item.label}</span>
              {page === item.id ? (
                <span className="navigation-active-arrow">
                  <Icon name="upRight" size={13} />
                </span>
              ) : item.id === "users" ? (
                <span className="navigation-badge">{contacts.length}</span>
              ) : item.id === "history" && active ? (
                <span
                  className="navigation-activity-dot"
                  aria-label="Active demo alert"
                />
              ) : (
                <span className="navigation-index">{item.index}</span>
              )}
            </a>
          ))}
        </nav>
        <div className="navigation-footer">
          <button
            className="circle-invitation"
            onClick={() => navigate("users")}
          >
            <span className="circle-illustration" aria-hidden="true">
              <span className="circle-person person-back">
                <Icon name="heart" size={18} />
              </span>
              <span className="circle-person person-front">
                <Icon name="users" size={22} />
              </span>
              <span className="circle-spark">✳</span>
            </span>
            <span className="circle-caption">LIFE’S BETTER CONNECTED</span>
            <strong>
              Your kind of people.
              <br />
              Your kind of backup.
            </strong>
            <span className="circle-invitation-link">
              {contacts.length} in your circle <Icon name="arrow" size={15} />
            </span>
          </button>
          <a
            href="#help"
            aria-label="Help and resources"
            className={`navigation-help ${page === "help" ? "help-current" : ""}`}
            onClick={(event) => {
              event.preventDefault();
              navigate("help");
            }}
          >
            <span className="help-circle">
              <Icon name="help" size={19} />
            </span>
            <span>
              <strong>A little guidance?</strong>
              <small>Help & resources</small>
            </span>
            <Icon name="upRight" size={15} />
          </a>
          <div className="navigation-signoff">
            <span className="navigation-small-star">✳</span>
            <span>MADE FOR YOUR PEACE OF MIND</span>
          </div>
        </div>
      </aside>
    </>
  );
}
