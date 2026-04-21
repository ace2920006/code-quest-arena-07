import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lightbulb, Play, Send, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestResults } from "@/components/TestResults";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { QuestCompletionOutput, type CompletionOutputData } from "@/components/QuestCompletionOutput";
import { TrackUnlockedOverlay } from "@/components/TrackUnlockedOverlay";
import { useAuth } from "@/hooks/useAuth";
import { ALL_CHALLENGES, TRACK_CHALLENGES, TRACK_ORDER, type Track } from "@/data/seedChallenges";
import { runCode, type RunResult } from "@/lib/runner";
import { levelFromXp } from "@/lib/xp";
import { toast } from "@/hooks/use-toast";
import type { UiLanguage } from "@/i18n";

const monacoLang = (l: string) => (l === "cpp" ? "cpp" : l);

const toCompletionOutput = (results: RunResult["results"], updatedAt: string): CompletionOutputData => ({
  passedCount: results.filter((x) => x.passed).length,
  totalCount: results.length,
  outputs: results.map((x) => x.error || x.output || "—"),
  updatedAt,
});

const getUnlockedTracks = (completedIds: string[]): Track[] =>
  TRACK_ORDER.filter((track, idx) =>
    TRACK_ORDER.slice(0, idx).every((prevTrack) =>
      TRACK_CHALLENGES[prevTrack].every((c) => completedIds.includes(c.id)),
    ),
  );

const Challenge = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [params] = useSearchParams();
  const isDaily = params.get("daily") === "1";
  const navigate = useNavigate();
  const { user, update } = useAuth();
  const lang = user.preferences.programmingLanguage;
  const uiLang = user.preferences.uiLanguage as UiLanguage;

  const idx = ALL_CHALLENGES.findIndex((c) => c.id === id);
  const challenge = ALL_CHALLENGES[idx];
  const next = ALL_CHALLENGES[idx + 1];

  const [code, setCode] = useState<string>("");
  const [results, setResults] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [levelUp, setLevelUp] = useState<{ level: number; xp: number } | null>(null);
  const [trackUnlocked, setTrackUnlocked] = useState<{
    track: Track;
    outputData: CompletionOutputData;
  } | null>(null);
  const [pendingTrackUnlock, setPendingTrackUnlock] = useState<{
    track: Track;
    outputData: CompletionOutputData;
  } | null>(null);
  const [overlayState, setOverlayState] = useState<"none" | "level" | "track">("none");

  useEffect(() => {
    if (!challenge) return;
    setCode(challenge.starter[lang]);
    setResults(null);
    setHintsShown(user.hintsUsed[challenge.id] ?? 0);
  }, [challenge?.id, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const alreadyCompleted = useMemo(
    () => (challenge ? user.completed.includes(challenge.id) : false),
    [challenge, user.completed],
  );

  if (!challenge) {
    return (
      <div className="container py-20 text-center">
        <p className="font-pixel text-sm">Quest not found.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">{t("challenge.back")}</Link>
        </Button>
      </div>
    );
  }

  const onRun = async () => {
    setLoading(true);
    const r = await runCode(code, lang, challenge);
    setResults(r);
    setLoading(false);
  };

  const onSubmit = async () => {
    setLoading(true);
    const r = await runCode(code, lang, challenge);
    setResults(r);
    setLoading(false);

    if (!r.passed) {
      toast({ title: t("challenge.failed"), description: t("common.tryAgain"), variant: "destructive" });
      return;
    }

    if (alreadyCompleted) {
      const outputData = toCompletionOutput(r.results, new Date().toISOString());
      update((u) => ({
        ...u,
        completionOutputs: {
          ...u.completionOutputs,
          [challenge.id]: outputData,
        },
      }));
      toast({ title: t("challenge.success"), description: "Already completed — no extra XP." });
      return;
    }

    // Award XP, with hint penalty (10% per hint), daily 2x bonus
    const hintPenalty = 1 - 0.1 * hintsShown;
    const dailyMult = isDaily ? 2 : 1;
    const earned = Math.max(10, Math.round(challenge.xpReward * hintPenalty * dailyMult));

    const prevLevel = levelFromXp(user.xp);
    const newXp = user.xp + earned;
    const newLevel = levelFromXp(newXp);
    const completedBefore = user.completed;
    const completedAfter = [...completedBefore, challenge.id];
    const unlockedBefore = getUnlockedTracks(completedBefore);
    const unlockedAfter = getUnlockedTracks(completedAfter);
    const newlyUnlockedTrack = unlockedAfter.find((track) => !unlockedBefore.includes(track));

    // Streak update
    const today = new Date();
    const last = user.lastSolvedAt ? new Date(user.lastSolvedAt) : null;
    let streak = user.streak;
    if (!last) streak = 1;
    else {
      const diffDays = Math.floor((+today - +last) / 86400000);
      if (diffDays === 0) streak = Math.max(1, streak);
      else if (diffDays === 1) streak = streak + 1;
      else streak = 1;
    }

    // Badges
    const badges = new Set(user.badges);
    if (user.completed.length === 0) badges.add("first-blood");
    if (streak >= 3) badges.add("streak-3");
    if (user.completed.length + 1 >= 5) badges.add("five-solved");
    if (hintsShown === 0) badges.add("no-hints");
    if (challenge.id === "fibonacci") badges.add("boss-slayer");

    const outputData = toCompletionOutput(r.results, today.toISOString());

    update((u) => ({
      ...u,
      xp: newXp,
      completed: completedAfter,
      streak,
      lastSolvedAt: today.toISOString(),
      badges: Array.from(badges),
      completionOutputs: {
        ...u.completionOutputs,
        [challenge.id]: outputData,
      },
    }));

    toast({
      title: t("challenge.success"),
      description: t("challenge.xpEarned", { xp: earned }),
    });

    if (newLevel > prevLevel) {
      setOverlayState("level");
      setLevelUp({ level: newLevel, xp: earned });
      if (newlyUnlockedTrack) {
        setPendingTrackUnlock({ track: newlyUnlockedTrack, outputData });
      }
    } else if (newlyUnlockedTrack) {
      setOverlayState("track");
      setTrackUnlocked({ track: newlyUnlockedTrack, outputData });
    }
  };

  const showHint = () => {
    if (hintsShown >= challenge.hints.length) return;
    const newCount = hintsShown + 1;
    setHintsShown(newCount);
    update((u) => ({ ...u, hintsUsed: { ...u.hintsUsed, [challenge.id]: newCount } }));
  };

  const trackLabelKey: Record<Track, string> = {
    basics: "dashboard.trackBasics",
    intermediate: "dashboard.trackIntermediate",
    advanced: "dashboard.trackAdvanced",
    hardcore: "dashboard.trackHardcore",
  };

  return (
    <div className="container py-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" asChild className="font-pixel text-[10px]">
          <Link to="/dashboard">
            <ArrowLeft className="h-3 w-3 mr-1" /> {t("challenge.back")}
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {isDaily && (
            <span className="font-pixel text-[10px] px-2 py-1 border-2 border-accent/60 bg-accent/10 text-accent rounded">
              ★ DAILY · 2x XP
            </span>
          )}
          <span className="font-pixel text-[10px] px-2 py-1 border-2 border-secondary/60 bg-secondary/10 text-secondary rounded uppercase">
            {lang}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Problem panel */}
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="pixel-card bg-gradient-card p-6 space-y-4"
        >
          <div>
            <h1 className="font-pixel text-base md:text-lg text-primary text-glow-primary leading-tight">
              {challenge.title[uiLang] ?? challenge.title.en}
            </h1>
            <div className="flex items-center gap-3 mt-3 text-[10px] font-pixel">
              <span className="px-2 py-1 border-2 border-border rounded uppercase text-muted-foreground">
                {t("challenge.difficulty")}: <span className="text-warning">{challenge.difficulty}</span>
              </span>
              <span className="px-2 py-1 border-2 border-accent/40 bg-accent/10 text-accent rounded inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {challenge.xpReward * (isDaily ? 2 : 1)} XP
              </span>
            </div>
          </div>

          <p className="font-mono text-sm leading-relaxed">
            {challenge.description[uiLang] ?? challenge.description.en}
          </p>

          <div className="space-y-2">
            <div className="font-pixel text-[10px] text-secondary">{t("challenge.examples")}</div>
            <div className="space-y-1 font-mono text-xs">
              {challenge.tests.slice(0, 2).map((tc, i) => (
                <div key={i} className="p-2 bg-muted/40 border border-border rounded">
                  <code>{tc.input}</code>{" "}
                  <span className="text-muted-foreground">→</span>{" "}
                  <code className="text-success">{tc.expected}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t-2 border-border">
            <div className="flex items-center justify-between">
              <div className="font-pixel text-[10px] text-warning flex items-center gap-1">
                <Lightbulb className="h-3 w-3" /> {t("challenge.hintsUsed", { used: hintsShown, total: challenge.hints.length })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={showHint}
                disabled={hintsShown >= challenge.hints.length}
                className="font-pixel text-[10px] border-2 border-warning/60 text-warning hover:bg-warning/10"
              >
                {t("challenge.hint")}
              </Button>
            </div>
            <div className="space-y-1">
              {challenge.hints.slice(0, hintsShown).map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-2 bg-warning/5 border border-warning/30 rounded font-mono text-xs"
                >
                  💡 {h[uiLang] ?? h.en}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Editor panel */}
        <motion.section
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="pixel-card bg-card overflow-hidden flex flex-col"
        >
          <div className="border-b-2 border-border bg-muted/30 px-3 py-2 font-pixel text-[10px] text-muted-foreground flex items-center justify-between">
            <span>solution.{lang === "javascript" ? "js" : lang === "python" ? "py" : lang === "java" ? "java" : "cpp"}</span>
            <span className="text-secondary">●</span>
          </div>
          <div className="h-[340px]">
            <Editor
              height="100%"
              language={monacoLang(lang)}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                tabSize: 2,
                padding: { top: 12 },
              }}
            />
          </div>
          <div className="border-t-2 border-border p-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRun}
              disabled={loading}
              className="font-pixel text-[10px] border-2 border-secondary/60 text-secondary hover:bg-secondary/10"
            >
              <Play className="h-3 w-3 mr-1" /> {t("challenge.run")}
            </Button>
            <Button
              size="sm"
              onClick={onSubmit}
              disabled={loading}
              className="font-pixel text-[10px] bg-gradient-primary glow-primary border-2 border-primary-glow ml-auto"
            >
              <Send className="h-3 w-3 mr-1" /> {t("challenge.submit")}
            </Button>
          </div>
          <div className="border-t-2 border-border max-h-72 overflow-auto">
            <div className="px-3 py-2 font-pixel text-[10px] text-muted-foreground border-b-2 border-border">
              {t("challenge.tests")}
            </div>
            <TestResults results={results?.results ?? null} loading={loading} />
          </div>
        </motion.section>
      </div>

      {results?.passed && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="pixel-card bg-success/10 border-success p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-success" />
            <div>
              <div className="font-pixel text-xs text-success">{t("challenge.success")}</div>
              <div className="font-mono text-xs text-muted-foreground">
                {results.results.filter((r) => r.passed).length}/{results.results.length} {t("challenge.passed")}
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <QuestCompletionOutput data={user.completionOutputs[challenge.id]} compact />
          </div>
          {next && (
            <Button
              onClick={() => navigate(`/challenge/${next.id}`)}
              className="font-pixel text-[10px] bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {t("challenge.next")} <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </motion.div>
      )}

      <LevelUpOverlay
        show={overlayState === "level" && !!levelUp}
        level={levelUp?.level ?? 1}
        xp={levelUp?.xp ?? 0}
        onDone={() => {
          setLevelUp(null);
          if (pendingTrackUnlock) {
            setTrackUnlocked(pendingTrackUnlock);
            setPendingTrackUnlock(null);
            setOverlayState("track");
          } else {
            setOverlayState("none");
          }
        }}
      />
      <TrackUnlockedOverlay
        show={overlayState === "track" && !!trackUnlocked}
        trackName={trackUnlocked ? t(trackLabelKey[trackUnlocked.track]) : ""}
        challengeTitle={challenge.title[uiLang] ?? challenge.title.en}
        outputData={trackUnlocked?.outputData}
        onDone={() => {
          setTrackUnlocked(null);
          setOverlayState("none");
        }}
        onGoToMap={() => {
          setTrackUnlocked(null);
          setOverlayState("none");
          navigate("/dashboard");
        }}
      />
    </div>
  );
};

export default Challenge;
