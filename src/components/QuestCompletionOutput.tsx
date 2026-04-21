import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export interface CompletionOutputData {
  passedCount: number;
  totalCount: number;
  outputs: string[];
  updatedAt: string;
}

export function QuestCompletionOutput({
  data,
  compact = false,
}: {
  data?: CompletionOutputData;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const displayOutputs = useMemo(
    () => (Array.isArray(data?.outputs) ? data.outputs.filter(Boolean) : []),
    [data?.outputs],
  );

  if (!data) {
    return (
      <div className="font-mono text-[11px] text-muted-foreground">
        {t("challenge.noCompletionOutput")}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="font-pixel text-[10px] text-secondary">
          {t("challenge.lastOutput")} ({data.passedCount}/{data.totalCount})
        </div>
        {displayOutputs.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            className="font-pixel h-6 px-2 text-[9px]"
          >
            {expanded ? t("challenge.hideOutput") : t("challenge.viewOutput")}
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {(expanded ? displayOutputs : displayOutputs.slice(0, 1)).map((output, index) => (
          <div key={index} className="p-2 bg-muted/40 border border-border rounded font-mono text-[11px] break-all">
            {compact && output.length > 90 ? `${output.slice(0, 90)}...` : output}
          </div>
        ))}
        {!displayOutputs.length && (
          <div className="p-2 bg-muted/40 border border-border rounded font-mono text-[11px] text-muted-foreground">
            {t("challenge.outputUnavailable")}
          </div>
        )}
      </div>
    </div>
  );
}
