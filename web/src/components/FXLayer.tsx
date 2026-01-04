"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function FXLayer() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // smooth the cursor movement
  const x = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.2 });
  const y = useSpring(my, { stiffness: 120, damping: 20, mass: 0.2 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mx.set(e.clientX);
      my.set(e.clientY);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <>
      {/* Cursor glow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-25"
        style={{
          x,
          y,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.7) 0%, rgba(34,211,238,0.25) 40%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Slow moving ambient orb */}
      <motion.div
        className="pointer-events-none fixed right-10 top-24 hidden h-28 w-28 rounded-full blur-xl lg:block"
        animate={{ y: [0, 10, 0], opacity: [0.45, 0.6, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(99,102,241,0.35) 45%, rgba(0,0,0,0) 70%)",
        }}
      />
    </>
  );
}