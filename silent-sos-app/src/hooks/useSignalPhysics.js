import { useEffect, useRef } from "react";

// A small damped spring drives decorative depth. The SOS hit target never moves.
export default function useSignalPhysics(stage) {
  const engine = useRef(null);
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = { x: 0, y: 0, press: 0 };
    const velocity = { x: 0, y: 0, press: 0 };
    const target = { x: 0, y: 0, press: 0 };
    let frame = null,
      previous = 0,
      visible = true,
      alive = true;
    const paint = () => {
      node.style.setProperty("--signal-x", state.x.toFixed(4));
      node.style.setProperty("--signal-y", state.y.toFixed(4));
      node.style.setProperty("--signal-press", state.press.toFixed(4));
    };
    const reset = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previous = 0;
      for (const key of Object.keys(state))
        state[key] = velocity[key] = target[key] = 0;
      paint();
    };
    const canMove = () =>
      alive && visible && !document.hidden && !media.matches;
    const tick = (time) => {
      if (!canMove()) {
        reset();
        return;
      }
      const delta = previous
        ? Math.min((time - previous) / 1000, 0.032)
        : 1 / 60;
      previous = time;
      let moving = false;
      for (const key of Object.keys(state)) {
        const force = (target[key] - state[key]) * 155 - velocity[key] * 18;
        velocity[key] += force * delta;
        state[key] += velocity[key] * delta;
        moving ||=
          Math.abs(target[key] - state[key]) > 0.0005 ||
          Math.abs(velocity[key]) > 0.001;
      }
      paint();
      if (moving) frame = requestAnimationFrame(tick);
      else {
        frame = null;
        previous = 0;
      }
    };
    const schedule = () => {
      if (canMove() && frame === null) frame = requestAnimationFrame(tick);
    };
    engine.current = {
      move(x, y) {
        target.x = x;
        target.y = y;
        schedule();
      },
      press(value) {
        target.press = value;
        schedule();
      },
      settle() {
        target.x = target.y = target.press = 0;
        schedule();
      },
    };
    const updatePause = () => {
      node.dataset.motionPaused = String(!canMove());
      if (!canMove()) reset();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updatePause();
      },
      { threshold: 0 },
    );
    observer.observe(node);
    media.addEventListener("change", updatePause);
    document.addEventListener("visibilitychange", updatePause);
    updatePause();
    return () => {
      alive = false;
      reset();
      observer.disconnect();
      media.removeEventListener("change", updatePause);
      document.removeEventListener("visibilitychange", updatePause);
      engine.current = null;
    };
  }, [stage]);
  return {
    onPointerMove(event) {
      if (!["mouse", "pen"].includes(event.pointerType)) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1),
      );
      const y = Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      );
      engine.current?.move(x, y);
    },
    onPointerLeave() {
      engine.current?.settle();
    },
    onPointerDown() {
      engine.current?.press(1);
    },
    onPointerUp() {
      engine.current?.press(0);
    },
    onPointerCancel() {
      engine.current?.settle();
    },
  };
}
