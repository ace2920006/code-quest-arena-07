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

export function LanguageToggle() {
  const { t } = useTranslation();
  const { user, setProgrammingLanguage } = useAuth();
  const current = user.preferences.programmingLanguage;

  return (
    <div
      role="radiogroup"
      aria-label={t("languageSwitcher.code")}
      className="inline-flex items-center gap-0.5 p-1 border-2 border-accent/40 bg-card rounded"
    >
      {PROGRAMMING_LANGUAGES.map((l) => {
        const active = current === l.code;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setProgrammingLanguage(l.code)}
            className={cn(
              "font-pixel text-[9px] px-2 py-1 rounded border-2 transition-colors",
              active
                ? "border-accent bg-accent/20 text-accent glow-accent"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
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
