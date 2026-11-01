import { useEffect, useRef } from "react";
import OverviewLocation from "../components/overview/OverviewLocation";
import OverviewCircle from "../components/overview/OverviewCircle";
import OverviewActivity from "../components/overview/OverviewActivity";
import OverviewPrivacy from "../components/overview/OverviewPrivacy";
import AlertPanel from "../components/AlertPanel";
import Icon from "../components/Icon";
import { useSafety } from "../context/SafetyContext";
import "../components/overview/Overview.css";
import EmergencyAction from "../components/overview/EmergencyAction";
import "../components/overview/PracticalOverview.css";

export default function Dashboard({ navigate }) {
  const { active, profile } = useSafety();
  const root = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animations.push(
            entry.target.animate(
              [
                { opacity: 0.15, transform: "translateY(20px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 600, easing: "cubic-bezier(.2,.75,.2,1)" },
            ),
          );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );
    root.current
      .querySelectorAll("[data-overview-reveal]")
      .forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);
  return (
    <div className="overview-page practical-overview" ref={root}>
      <div className="practical-heading" data-overview-reveal>
        <div>
          <h1>Overview</h1>
          <p>
            Welcome, {profile.name.trim().split(/\s+/)[0]}. Your essentials, all
            in one place.
          </p>
        </div>
        <button className="outline-button" onClick={() => navigate("help")}>
          <Icon name="help" size={17} />
          Quick guide
        </button>
      </div>
      {active && <AlertPanel alert={active} navigate={navigate} />}
      <EmergencyAction navigate={navigate} />
      <div className="practical-workspace-grid">
        <OverviewLocation navigate={navigate} />
        <OverviewCircle navigate={navigate} />
      </div>
      <OverviewActivity navigate={navigate} />
      <OverviewPrivacy navigate={navigate} />
    </div>
  );
}
