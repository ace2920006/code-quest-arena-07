import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CELEBRATION_PARTICLES, OVERLAY_MOTION } from "@/lib/overlayMotion";

export function LevelUpOverlay({
  show,
  level,
  xp,
  onDone,
}: {
  show: boolean;
  level: number;
  xp: number;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, OVERLAY_MOTION.autoDismissMs);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm"
          initial={OVERLAY_MOTION.backdrop.initial}
          animate={OVERLAY_MOTION.backdrop.animate}
          exit={OVERLAY_MOTION.backdrop.exit}
        >
          <motion.div
            initial={OVERLAY_MOTION.card.initial}
            animate={OVERLAY_MOTION.card.animate}
            exit={OVERLAY_MOTION.card.exit}
            transition={OVERLAY_MOTION.card.transition}
            className="relative text-center p-8 pixel-card bg-gradient-card glow-primary"
          >
            <motion.div
              className="font-pixel text-2xl md:text-4xl text-primary text-glow-primary mb-3"
              initial={OVERLAY_MOTION.stage.initial}
              animate={OVERLAY_MOTION.stage.animate}
              transition={{ delay: 0.05, duration: 0.25 }}
            >
              LEVEL UP!
            </motion.div>
            <motion.div
              className="font-pixel text-6xl text-accent text-glow-accent mb-3"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: [0.7, 1.08, 1], opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.35 }}
            >
              {level}
            </motion.div>
            <motion.div
              className="font-mono text-sm text-muted-foreground"
              initial={OVERLAY_MOTION.stage.initial}
              animate={OVERLAY_MOTION.stage.animate}
              transition={{ delay: 0.35, duration: 0.25 }}
            >
              +{xp} XP
            </motion.div>
            {CELEBRATION_PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: 0,
                  rotate: i % 2 ? 220 : -220,
                }}
                transition={{ duration: 1.1, delay: 0.45 + p.delay }}
                style={{ left: "50%", top: "50%" }}
              >
                {p.icon}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
