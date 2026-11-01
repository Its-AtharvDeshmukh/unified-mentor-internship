import { useEffect, useRef } from "react";
export default function PageTransition({ page, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const animation = node.animate(
      [
        { opacity: 0, transform: "translateY(12px)", filter: "blur(3px)" },
        { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
      ],
      { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" },
    );
    return () => animation.cancel();
  }, [page]);
  return (
    <div className="page-transition" ref={ref}>
      {children}
    </div>
  );
}
