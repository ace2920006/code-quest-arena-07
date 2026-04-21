import { Check, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { TestResult } from "@/lib/runner";

export function TestResults({
  results,
  loading,
}: {
  results: TestResult[] | null;
  loading: boolean;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 font-mono text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> {t("challenge.running")}
      </div>
    );
  }
  if (!results) {
    return (
      <div className="p-4 font-mono text-sm text-muted-foreground">
        {t("challenge.run")} → {t("challenge.tests").toLowerCase()}
      </div>
    );
  }

  return (
    <div className="divide-y-2 divide-border">
      {results.map((r, i) => (
        <div key={i} className="p-3 space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={cn(
                "h-5 w-5 grid place-items-center border-2 rounded",
                r.passed
                  ? "border-success bg-success/20 text-success"
                  : "border-destructive bg-destructive/20 text-destructive",
              )}
            >
              {r.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </span>
            <span className="text-muted-foreground">#{i + 1}</span>
            <code className="text-foreground truncate">{r.input}</code>
            {typeof r.timeMs === "number" && (
              <span className="ml-auto text-[10px] text-muted-foreground">{r.timeMs.toFixed(1)}ms</span>
            )}
          </div>
          {!r.passed && (
            <div className="ml-7 p-2 bg-muted/50 border border-border rounded font-mono text-[11px]">
              <code className="text-destructive break-all">{r.error || t("challenge.failed")}</code>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
