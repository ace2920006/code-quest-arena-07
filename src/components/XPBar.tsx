import { progressInLevel } from "@/lib/xp";
import { motion } from "framer-motion";

export function XPBar({ xp, compact = false }: { xp: number; compact?: boolean }) {
  const { level, current, needed, pct } = progressInLevel(xp);
  return (
    <div className={compact ? "flex items-center gap-2 min-w-0" : "w-full"}>
      <div
        className="font-pixel text-[10px] text-accent shrink-0 px-2 py-1 border-2 border-accent/40 bg-accent/10 rounded"
        title={`Level ${level}`}
      >
        Lv {level}
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-3 w-full bg-muted border-2 border-border overflow-hidden rounded-sm">
          <motion.div
            className="h-full xp-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        {!compact && (
          <div className="mt-1 font-mono text-[10px] text-muted-foreground">
            {current} / {needed} XP
          </div>
        )}
      </div>
    </div>
  );
}
