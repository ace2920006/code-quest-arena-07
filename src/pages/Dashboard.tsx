import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, Flame, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ALL_CHALLENGES, INTERMEDIATE_CHALLENGES, SEED_CHALLENGES, type Track } from "@/data/seedChallenges";
import { MapNode } from "@/components/MapNode";
import { XPBar } from "@/components/XPBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UiLanguage } from "@/i18n";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const uiLang = user.preferences.uiLanguage as UiLanguage;

  // Daily challenge: deterministic by date — pick from full pool
  const day = Math.floor(Date.now() / 86400000);
  const daily = ALL_CHALLENGES[day % ALL_CHALLENGES.length];

  const basicsDone = SEED_CHALLENGES.every((c) => user.completed.includes(c.id));
  const [track, setTrack] = useState<Track>(basicsDone ? "intermediate" : "basics");

  const list = track === "basics" ? SEED_CHALLENGES : INTERMEDIATE_CHALLENGES;
  // Intermediate is locked branch-wide until basics complete
  const branchLocked = track === "intermediate" && !basicsDone;
  const currentIdx = list.findIndex((c) => !user.completed.includes(c.id));

  const tabs: { key: Track; label: string }[] = [
    { key: "basics", label: t("dashboard.trackBasics") },
    { key: "intermediate", label: t("dashboard.trackIntermediate") },
  ];

  return (
    <div className="container py-8 space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pixel-card bg-gradient-card p-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="font-pixel text-base md:text-lg text-primary text-glow-primary">
              {t("dashboard.welcome", { name: user.username })}
            </h1>
            <p className="font-mono text-sm text-muted-foreground mt-1">
              {t("dashboard.currentTrack")}: <span className="text-secondary capitalize">{user.preferences.programmingLanguage} {track === "basics" ? t("dashboard.trackBasics") : t("dashboard.trackIntermediate")}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border-2 border-warning/50 bg-warning/10 rounded font-pixel text-[10px] text-warning">
            <Flame className="h-4 w-4" />
            {t("dashboard.streak", { count: user.streak })}
          </div>
        </div>
        <XPBar xp={user.xp} />
      </motion.section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* World map */}
        <section className="pixel-card bg-card p-6 space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-pixel text-xs text-secondary flex items-center gap-2">
              <Target className="h-4 w-4" /> WORLD MAP
            </h2>
            <div
              role="tablist"
              aria-label={t("dashboard.branchTitle")}
              className="inline-flex items-center gap-1 p-1 border-2 border-secondary/40 bg-muted/20 rounded"
            >
              {tabs.map((tab) => {
                const active = track === tab.key;
                const locked = tab.key === "intermediate" && !basicsDone;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTrack(tab.key)}
                    className={cn(
                      "font-pixel text-[10px] px-3 py-1.5 rounded border-2 transition-colors",
                      active
                        ? "border-secondary bg-secondary/20 text-secondary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                    )}
                    title={locked ? t("dashboard.locked") : tab.label}
                  >
                    {locked ? "🔒 " : ""}{tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-4 gap-y-8 justify-items-center">
            {list.map((c, i) => {
              const completed = user.completed.includes(c.id);
              const isCurrent = !branchLocked && i === currentIdx;
              const state: "completed" | "current" | "locked" = completed
                ? "completed"
                : isCurrent
                  ? "current"
                  : "locked";
              return <MapNode key={c.id} challenge={c} state={state} uiLang={uiLang} index={i} />;
            })}
          </div>
          {branchLocked && (
            <p className="font-mono text-xs text-muted-foreground text-center">
              🔒 {t("dashboard.trackBasics")} → {t("dashboard.trackIntermediate")}
            </p>
          )}
        </section>

        <aside className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="pixel-card bg-gradient-card p-5 space-y-3 glow-accent"
          >
            <div className="flex items-center gap-2 font-pixel text-[10px] text-accent">
              <Calendar className="h-3 w-3" /> {t("dashboard.dailyChallenge")}
            </div>
            <div className="font-pixel text-sm leading-snug">
              {daily.title[uiLang] ?? daily.title.en}
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              {t("dashboard.dailyChallengeDesc")}
            </div>
            <Button
              asChild
              size="sm"
              className="w-full font-pixel text-[10px] bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to={`/challenge/${daily.id}?daily=1`}>{t("dashboard.playDaily")} →</Link>
            </Button>
          </motion.div>

          <div className="pixel-card bg-card p-5 space-y-3">
            <div className="font-pixel text-[10px] text-secondary">BADGES</div>
            <div className="grid grid-cols-4 gap-2">
              {(user.badges.length ? user.badges : ["?", "?", "?", "?"]).slice(0, 8).map((b, i) => (
                <div
                  key={`${b}-${i}`}
                  className="aspect-square grid place-items-center text-xl border-2 border-border bg-muted/30 rounded"
                  title={b}
                >
                  {b === "first-blood" ? "⚔️" : b === "streak-3" ? "🔥" : b === "five-solved" ? "🛡️" : b === "polyglot" ? "🌐" : b === "no-hints" ? "🧠" : b === "boss-slayer" ? "👑" : "?"}
                </div>
              ))}
            </div>
            <Link to="/profile" className="block text-center font-mono text-xs text-muted-foreground hover:text-secondary">
              View all →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
