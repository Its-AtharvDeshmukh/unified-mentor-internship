import { useState, useEffect } from "react";
import { useSafety } from "../context/SafetyContext";
import Icon from "../components/Icon";
export default function NeutralScreen() {
  const { setNeutral } = useSafety();
  const [note, setNote] = useState("A few things for today…\n\n");
  useEffect(() => {
    document.title = "Notes";
    return () => {
      document.title = "Haven — Your safety, quietly connected.";
    };
  }, []);
  return (
    <main className="neutral-screen">
      <div className="notes-top">
        <span>notes.</span>
        <span>
          {new Date().toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <section>
        <span className="eyebrow">A LITTLE ROOM TO THINK</span>
        <h1>One thing at a time.</h1>
        <textarea
          aria-label="Your notes"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <small>Notes are temporary and stay on this page.</small>
      </section>
      <button className="neutral-back" onClick={() => setNeutral(false)}>
        <Icon name="arrow" size={19} />
        Back to workspace
      </button>
    </main>
  );
}
