import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Flame, Star, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ALL_BADGES, SEED_CHALLENGES } from "@/data/seedChallenges";
import { XPBar } from "@/components/XPBar";
import { progressInLevel } from "@/lib/xp";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { level } = progressInLevel(user.xp);

  return (
    <div className="container py-8 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pixel-card bg-gradient-card p-6 flex flex-col md:flex-row gap-6 items-center md:items-start"
      >
        <div className="h-24 w-24 rounded border-4 border-primary/60 bg-gradient-primary grid place-items-center font-pixel text-3xl text-primary-foreground glow-primary shrink-0">
          {(user.username || "A").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 w-full space-y-3 text-center md:text-left">
          <div>
            <h1 className="font-pixel text-base text-primary text-glow-primary">{user.username}</h1>
            <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
          </div>
          <XPBar xp={user.xp} />
          <div className="grid grid-cols-3 gap-2">
            <Stat icon={<Star className="h-4 w-4" />} label={t("profile.totalXp")} value={user.xp} color="accent" />
            <Stat icon={<Trophy className="h-4 w-4" />} label={t("profile.level")} value={level} color="primary" />
            <Stat icon={<Flame className="h-4 w-4" />} label={t("profile.streak")} value={user.streak} color="warning" />
          </div>
        </div>
      </motion.section>

      <section className="pixel-card bg-card p-6 space-y-4">
        <h2 className="font-pixel text-xs text-secondary">{t("profile.badges")}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ALL_BADGES.map((b) => {
            const earned = user.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={cn(
                  "aspect-square pixel-border rounded flex flex-col items-center justify-center p-2 gap-1 transition-all",
                  earned ? "border-accent bg-accent/10 glow-accent" : "border-border bg-muted/20 opacity-50",
                )}
                title={b.desc}
              >
                <div className="text-2xl">{earned ? b.icon : "❓"}</div>
                <div className="font-pixel text-[8px] text-center leading-tight">{b.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pixel-card bg-card p-6 space-y-4">
        <h2 className="font-pixel text-xs text-secondary">{t("profile.skillTree")}</h2>
        <p className="font-mono text-xs text-muted-foreground">
          {t("profile.completed", { count: user.completed.length })} / {SEED_CHALLENGES.length}
        </p>
        <div className="flex flex-wrap gap-2">
          {SEED_CHALLENGES.map((c) => {
            const done = user.completed.includes(c.id);
            return (
              <div
                key={c.id}
                className={cn(
                  "px-3 py-2 border-2 rounded font-pixel text-[10px]",
                  done
                    ? "border-success bg-success/10 text-success"
                    : "border-border bg-muted/20 text-muted-foreground",
                )}
              >
                {c.order}. {c.title.en}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div
      className="p-3 border-2 rounded text-center"
      style={{ borderColor: `hsl(var(--${color}) / 0.4)`, background: `hsl(var(--${color}) / 0.08)` }}
    >
      <div className="flex items-center justify-center gap-1 font-pixel text-[9px]" style={{ color: `hsl(var(--${color}))` }}>
        {icon}
        {label}
      </div>
      <div className="font-pixel text-base mt-1" style={{ color: `hsl(var(--${color}))` }}>
        {value}
      </div>
    </div>
  );
}

export default Profile;
