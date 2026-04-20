import { motion } from "framer-motion";
import { Lock, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/data/seedChallenges";
import type { UiLanguage } from "@/i18n";

interface Props {
  challenge: Challenge;
  state: "completed" | "current" | "locked";
  uiLang: UiLanguage;
  index: number;
}

export function MapNode({ challenge, state, uiLang, index }: Props) {
  const title = challenge.title[uiLang] ?? challenge.title.en;
  const isLocked = state === "locked";

  const inner = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={isLocked ? undefined : { scale: 1.05, y: -2 }}
      className={cn(
        "relative w-full aspect-square max-w-[120px] grid place-items-center border-2 transition-colors",
        state === "completed" && "border-success bg-success/15 text-success glow-accent",
        state === "current" && "border-primary bg-primary/15 text-primary animate-pulse-glow",
        state === "locked" && "border-border bg-muted/30 text-muted-foreground",
      )}
      style={{ borderRadius: 4 }}
    >
      <div className="font-pixel text-2xl">
        {state === "completed" ? <Check className="h-6 w-6" /> : isLocked ? <Lock className="h-5 w-5" /> : challenge.order}
      </div>
      <div className="absolute -top-2 -right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-card border-2 border-accent/60 rounded font-pixel text-[8px] text-accent">
        <Star className="h-2 w-2 fill-current" />
        {challenge.xpReward}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {isLocked ? (
        <div className="cursor-not-allowed opacity-60 w-full max-w-[120px]">{inner}</div>
      ) : (
        <Link to={`/challenge/${challenge.id}`} className="w-full max-w-[120px] group" aria-label={title}>
          {inner}
        </Link>
      )}
      <div className="text-center max-w-[140px]">
        <div className={cn("font-pixel text-[9px] leading-tight", isLocked && "text-muted-foreground")}>
          {title}
        </div>
        <div className="font-mono text-[10px] text-muted-foreground capitalize">
          {challenge.difficulty}
        </div>
      </div>
    </div>
  );
}
