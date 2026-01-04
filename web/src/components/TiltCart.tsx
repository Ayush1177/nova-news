"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { PropsWithChildren, useRef } from "react";

export function TiltCard({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  const sx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sy = useSpring(ry, { stiffness: 200, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1

    const tiltX = (0.5 - py) * 10; // degrees
    const tiltY = (px - 0.5) * 10;

    rx.set(tiltX);
    ry.set(tiltY);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className={[
        "relative group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl",
        "will-change-transform glow",
        className,
      ].join(" ")}
    >
      {/* subtle inner highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.14), transparent 55%)",
        }}
      />
      {children}
    </motion.div>
  );
}