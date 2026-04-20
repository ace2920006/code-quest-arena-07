import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Code2, Globe, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-hero scanlines">
      <header className="container flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary border-2 border-primary-foreground/20 grid place-items-center text-primary-foreground font-pixel text-xs shadow-pixel-sm">
            CQ
          </div>
          <span className="font-pixel text-sm text-primary text-glow-primary">{t("appName")}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm" className="font-pixel text-[10px]">
            <Link to="/login">{t("nav.login")}</Link>
          </Button>
        </div>
      </header>

      <main className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 border-2 border-primary/40 bg-primary/10 rounded font-pixel text-[10px] text-primary"
          >
            ▶ PRESS START
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-pixel text-3xl md:text-5xl lg:text-6xl leading-tight text-glow-primary"
          >
            <span className="text-primary">CODE.</span>{" "}
            <span className="text-accent">QUEST.</span>{" "}
            <span className="text-secondary">CONQUER.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto"
          >
            {t("landing.heroSubtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <Button
              size="lg"
              onClick={() => navigate(isGuest ? "/login" : "/dashboard")}
              className="font-pixel text-xs bg-gradient-primary glow-primary hover:scale-105 transition-transform border-2 border-primary-glow"
            >
              ⚔ {t("landing.ctaStart")}
            </Button>
            <Button asChild size="lg" variant="outline" className="font-pixel text-xs border-2">
              <Link to="/login">{t("landing.ctaLogin")}</Link>
            </Button>
          </motion.div>

          {/* Pixel mascot block */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-8 flex justify-center"
          >
            <div className="grid grid-cols-8 gap-1 animate-float" aria-hidden>
              {[
                "..PPPP..",
                ".PWWWWP.",
                "PWBWWBWP",
                "PWWWWWWP",
                "PWAAAAWP",
                ".PWWWWP.",
                "..P..P..",
                ".PP..PP.",
              ].map((row, ri) =>
                row.split("").map((ch, ci) => (
                  <span
                    key={`${ri}-${ci}`}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    style={{
                      background:
                        ch === "P"
                          ? "hsl(var(--primary))"
                          : ch === "W"
                            ? "hsl(var(--foreground))"
                            : ch === "B"
                              ? "hsl(var(--background))"
                              : ch === "A"
                                ? "hsl(var(--accent))"
                                : "transparent",
                    }}
                  />
                )),
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-20 max-w-5xl mx-auto">
          {[
            { icon: Globe, color: "primary", k: "feature1" },
            { icon: Zap, color: "accent", k: "feature2" },
            { icon: Trophy, color: "secondary", k: "feature3" },
          ].map(({ icon: Icon, color, k }, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="pixel-card bg-gradient-card p-6 space-y-3 hover:-translate-y-1 transition-transform"
            >
              <div
                className={`h-10 w-10 grid place-items-center border-2 rounded`}
                style={{
                  borderColor: `hsl(var(--${color}))`,
                  background: `hsl(var(--${color}) / 0.15)`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: `hsl(var(--${color}))` }} />
              </div>
              <h3 className="font-pixel text-xs">{t(`landing.${k}Title`)}</h3>
              <p className="font-mono text-sm text-muted-foreground">{t(`landing.${k}Desc`)}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="container py-10 text-center font-mono text-xs text-muted-foreground">
        <Code2 className="inline h-3 w-3 mr-1" /> {t("appName")} · {t("tagline")}
      </footer>
    </div>
  );
};

export default Landing;
