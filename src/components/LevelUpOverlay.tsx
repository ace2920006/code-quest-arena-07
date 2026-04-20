import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

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
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="text-center p-8 pixel-card bg-gradient-card glow-primary"
          >
            <div className="font-pixel text-2xl md:text-4xl text-primary text-glow-primary mb-3">
              LEVEL UP!
            </div>
            <div className="font-pixel text-6xl text-accent text-glow-accent mb-3">{level}</div>
            <div className="font-mono text-sm text-muted-foreground">+{xp} XP</div>
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1.4, delay: i * 0.04 }}
                style={{ left: "50%", top: "50%" }}
              >
                {["⭐", "✨", "🎉", "⚡"][i % 4]}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
