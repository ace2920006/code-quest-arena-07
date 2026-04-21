import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { QuestCompletionOutput, type CompletionOutputData } from "@/components/QuestCompletionOutput";

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="w-full max-w-xl pixel-card bg-gradient-card p-6 space-y-4"
          >
            <div className="text-center space-y-2">
              <div className="font-pixel text-lg md:text-2xl text-accent text-glow-accent">
                {t("challenge.trackUnlocked")}
              </div>
              <div className="font-pixel text-xs text-primary">
                {t("challenge.newTrack")}: {trackName}
              </div>
              <div className="font-mono text-xs text-muted-foreground">{challengeTitle}</div>
            </div>

            <div className="border-2 border-border rounded p-3 bg-card/50">
              <div className="font-pixel text-[10px] text-secondary mb-2">{t("challenge.completionOutput")}</div>
              <QuestCompletionOutput data={outputData} />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={onDone}
                className="font-pixel text-[10px]"
              >
                {t("challenge.continue")}
              </Button>
              <Button
                onClick={onGoToMap}
                className="font-pixel text-[10px] bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {t("challenge.viewMap")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
