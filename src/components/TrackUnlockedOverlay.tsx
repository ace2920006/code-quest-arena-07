import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { QuestCompletionOutput, type CompletionOutputData } from "@/components/QuestCompletionOutput";
import { OVERLAY_MOTION } from "@/lib/overlayMotion";

export function TrackUnlockedOverlay({
  show,
  trackName,
  challengeTitle,
  outputData,
  onGoToMap,
  onDone,
}: {
  show: boolean;
  trackName: string;
  challengeTitle: string;
  outputData?: CompletionOutputData;
  onGoToMap: () => void;
  onDone: () => void;
}) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4"
          initial={OVERLAY_MOTION.backdrop.initial}
          animate={OVERLAY_MOTION.backdrop.animate}
          exit={OVERLAY_MOTION.backdrop.exit}
        >
          <motion.div
            initial={OVERLAY_MOTION.card.initial}
            animate={OVERLAY_MOTION.card.animate}
            exit={OVERLAY_MOTION.card.exit}
            transition={OVERLAY_MOTION.card.transition}
            className="w-full max-w-xl pixel-card bg-gradient-card p-6 space-y-4"
          >
            <motion.div
              className="text-center space-y-2"
              initial={OVERLAY_MOTION.stage.initial}
              animate={OVERLAY_MOTION.stage.animate}
              transition={{ delay: 0.05, duration: 0.25 }}
            >
              <div className="font-pixel text-lg md:text-2xl text-accent text-glow-accent">
                {t("challenge.trackUnlocked")}
              </div>
              <motion.div
                className="font-pixel text-xs text-primary"
                initial={{ scale: 0.94 }}
                animate={{ scale: [0.94, 1.04, 1] }}
                transition={{ delay: 0.2, duration: 0.35 }}
              >
                {t("challenge.levelQualified")}: {trackName}
              </motion.div>
              <div className="font-mono text-xs text-muted-foreground">{challengeTitle}</div>
            </motion.div>

            <motion.div
              className="border-2 border-border rounded p-3 bg-card/50"
              initial={OVERLAY_MOTION.stage.initial}
              animate={OVERLAY_MOTION.stage.animate}
              transition={{ delay: 0.18, duration: 0.25 }}
            >
              <div className="font-pixel text-[10px] text-secondary mb-2">{t("challenge.completionOutput")}</div>
              <QuestCompletionOutput data={outputData} />
            </motion.div>

            <motion.div
              className="flex items-center justify-end gap-2"
              initial={OVERLAY_MOTION.stage.initial}
              animate={OVERLAY_MOTION.stage.animate}
              transition={{ delay: 0.28, duration: 0.25 }}
            >
              <Button
                variant="outline"
                onClick={onDone}
                className="font-pixel text-[10px]"
              >
                {t("challenge.continue")}
              </Button>
              <Button
                onClick={onGoToMap}
                className="font-pixel text-[10px] bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse-glow"
              >
                {t("challenge.viewMap")}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
