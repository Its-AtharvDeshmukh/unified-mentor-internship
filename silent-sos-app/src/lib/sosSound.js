// This short demo chime is opt-out in the interface. It never delays an alert.
export function playSosChime() {
  const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!Context) return () => {};
  let context;
  try {
    context = new Context();
  } catch {
    return () => {};
  }
  const nodes = [];
  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    for (const { oscillator, gain } of nodes) {
      try {
        oscillator.stop();
      } catch {
        /* It may already have ended. */
      }
      oscillator.disconnect();
      gain.disconnect();
    }
    if (context.state !== "closed") void context.close().catch(() => {});
  };
  const start = () => {
    if (stopped) return;
    try {
      const now = context.currentTime + 0.015;
      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const at = now + index * 0.09;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.045, at + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.26);
        oscillator.connect(gain);
        gain.connect(context.destination);
        nodes.push({ oscillator, gain });
        if (index === 2) oscillator.onended = stop;
        oscillator.start(at);
        oscillator.stop(at + 0.28);
      });
    } catch {
      stop();
    }
  };
  if (context.state === "suspended")
    void context.resume().then(start).catch(stop);
  else start();
  return stop;
}
