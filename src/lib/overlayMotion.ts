export const OVERLAY_MOTION = {
  autoDismissMs: 2600,
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  card: {
    initial: { scale: 0.88, y: 18, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1 },
    exit: { scale: 0.9, y: 10, opacity: 0 },
    transition: { type: "spring" as const, stiffness: 210, damping: 16 },
  },
  stage: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
};

export const CELEBRATION_PARTICLES = [
  { x: -180, y: -140, icon: "⭐", delay: 0.0 },
  { x: 160, y: -120, icon: "✨", delay: 0.04 },
  { x: -120, y: 150, icon: "⚡", delay: 0.08 },
  { x: 140, y: 170, icon: "🎉", delay: 0.12 },
  { x: -220, y: 20, icon: "✨", delay: 0.16 },
  { x: 220, y: 30, icon: "⭐", delay: 0.2 },
];
