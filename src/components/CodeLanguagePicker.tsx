import { Code2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { PROGRAMMING_LANGUAGES, type ProgrammingLanguage } from "@/lib/storage";
import { cn } from "@/lib/utils";

const SHORT: Record<ProgrammingLanguage, string> = {
  javascript: "JS",
  python: "PY",
  java: "JAVA",
  cpp: "C++",
};

const COLOR: Record<ProgrammingLanguage, string> = {
  javascript: "border-warning/60 text-warning hover:bg-warning/10 data-[active=true]:bg-warning/20 data-[active=true]:border-warning data-[active=true]:glow-accent",
  python: "border-secondary/60 text-secondary hover:bg-secondary/10 data-[active=true]:bg-secondary/20 data-[active=true]:border-secondary",
  java: "border-destructive/60 text-destructive hover:bg-destructive/10 data-[active=true]:bg-destructive/20 data-[active=true]:border-destructive",
  cpp: "border-accent/60 text-accent hover:bg-accent/10 data-[active=true]:bg-accent/20 data-[active=true]:border-accent",
};

interface Props {
  variant?: "compact" | "full";
  showLabel?: boolean;
}

export function CodeLanguagePicker({ variant = "full", showLabel = true }: Props) {
  const { t } = useTranslation();
  const { user, setProgrammingLanguage } = useAuth();
  const current = user.preferences.programmingLanguage;

  return (
    <div
      role="radiogroup"
      aria-label={t("languageSwitcher.code")}
      className={cn(
        "inline-flex items-center gap-1.5",
        variant === "full" && "p-1.5 border-2 border-primary/40 bg-card rounded shadow-pixel-sm",
      )}
    >
      {showLabel && variant === "full" && (
        <span className="hidden md:inline-flex items-center gap-1 px-2 font-pixel text-[9px] text-primary">
          <Code2 className="h-3 w-3" />
          {t("languageSwitcher.code")}
        </span>
      )}
      {PROGRAMMING_LANGUAGES.map((l) => {
        const active = current === l.code;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            onClick={() => setProgrammingLanguage(l.code)}
            className={cn(
              "font-pixel px-2.5 py-1.5 rounded border-2 transition-all",
              variant === "full" ? "text-[10px]" : "text-[9px] px-2 py-1",
              active ? "scale-105" : "border-transparent text-muted-foreground hover:scale-105",
              active && COLOR[l.code],
              !active && "hover:border-border",
            )}
            title={l.label}
          >
            {SHORT[l.code]}
          </button>
        );
      })}
    </div>
  );
}
