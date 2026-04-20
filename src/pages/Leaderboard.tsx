import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface LbEntry {
  rank: number;
  name: string;
  xp: number;
  isYou?: boolean;
}

const Leaderboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [scope, setScope] = useState<"global" | "weekly">("global");

  const mock: LbEntry[] = [
    { rank: 1, name: "PixelMage", xp: 12480 },
    { rank: 2, name: "ByteRanger", xp: 9870 },
    { rank: 3, name: "NeonNinja", xp: 8210 },
    { rank: 4, name: "QuestQueen", xp: 6540 },
    { rank: 5, name: "GlitchGoblin", xp: 5120 },
    { rank: 6, name: "RetroRogue", xp: 4400 },
    { rank: 7, name: "LoopLord", xp: 3120 },
    { rank: 8, name: "ArrayKnight", xp: 2480 },
    { rank: 9, name: "BugSlayer", xp: 1890 },
    { rank: 10, name: "NoobHero", xp: 720 },
  ];

  const withYou = [...mock, { rank: 0, name: user.username, xp: user.xp, isYou: true }]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const weekly = withYou.map((e) => ({ ...e, xp: Math.round(e.xp * 0.18) })).sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));

  const list = scope === "global" ? withYou : weekly;

  return (
    <div className="container py-8 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-pixel text-base md:text-lg text-primary text-glow-primary flex items-center gap-2"
      >
        <Trophy className="h-5 w-5" /> {t("leaderboard.title")}
      </motion.h1>

      <Tabs value={scope} onValueChange={(v) => setScope(v as "global" | "weekly")}>
        <TabsList className="grid w-full max-w-xs grid-cols-2 border-2 border-border bg-card">
          <TabsTrigger value="global" className="font-pixel text-[10px]">
            {t("leaderboard.global")}
          </TabsTrigger>
          <TabsTrigger value="weekly" className="font-pixel text-[10px]">
            {t("leaderboard.weekly")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={scope} className="mt-4">
          <div className="pixel-card bg-card overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_100px] px-4 py-3 border-b-2 border-border font-pixel text-[10px] text-muted-foreground bg-muted/30">
              <div>{t("leaderboard.rank")}</div>
              <div>{t("leaderboard.player")}</div>
              <div className="text-right">{t("leaderboard.xp")}</div>
            </div>
            <div className="divide-y-2 divide-border">
              {list.map((e, i) => (
                <motion.div
                  key={`${e.name}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "grid grid-cols-[60px_1fr_100px] items-center px-4 py-3",
                    e.isYou && "bg-primary/10 border-l-4 border-l-primary",
                  )}
                >
                  <div className="font-pixel text-xs flex items-center gap-1">
                    {e.rank === 1 ? (
                      <Crown className="h-4 w-4 text-warning" />
                    ) : e.rank <= 3 ? (
                      <Medal className={cn("h-4 w-4", e.rank === 2 ? "text-secondary" : "text-accent")} />
                    ) : null}
                    <span>{e.rank}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded border-2 border-border bg-gradient-primary grid place-items-center font-pixel text-[10px] text-primary-foreground shrink-0">
                      {e.name.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="font-mono text-sm truncate">{e.name}</span>
                    {e.isYou && (
                      <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded">
                        {t("leaderboard.you")}
                      </span>
                    )}
                  </div>
                  <div className="text-right font-pixel text-xs text-accent">{e.xp.toLocaleString()}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
