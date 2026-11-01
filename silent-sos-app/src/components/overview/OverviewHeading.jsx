import Icon from "../Icon";
import { useSafety } from "../../context/SafetyContext";
export default function OverviewHeading({ navigate }) {
  const { profile } = useSafety();
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  return (
    <div className="ov-heading" data-overview-reveal>
      <div>
        <span className="ov-eyebrow">
          <span className="ov-sun" aria-hidden="true">
            ✳
          </span>{" "}
          YOUR EVERYDAY BACKUP
        </span>
        <h1>
          Hey {profile.name.trim().split(/\s+/)[0] || "there"},{" "}
          <span>we’re here.</span>
        </h1>
        <p>A little more connected. A little more at ease.</p>
      </div>
      <div className="ov-heading-aside">
        <time dateTime={new Date().toLocaleDateString("en-CA")}>{today}</time>
        <button onClick={() => navigate("help")}>
          A quick guide <Icon name="upRight" size={15} />
        </button>
      </div>
    </div>
  );
}
