import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { UI_LANGUAGES } from "@/i18n";
import { PROGRAMMING_LANGUAGES, type ProgrammingLanguage } from "@/lib/storage";

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { user, setUiLanguage, setProgrammingLanguage } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 font-pixel text-[10px] border-2 border-secondary/60 hover:border-secondary hover:bg-secondary/10 hover:text-secondary"
          aria-label={t("languageSwitcher.title")}
        >
          <Languages className="h-4 w-4 text-secondary" />
          <span className="hidden sm:inline">🌐</span>
          <span className="uppercase">{user.preferences.uiLanguage}</span>
          <span className="opacity-60">·</span>
          <span className="uppercase">{user.preferences.programmingLanguage.slice(0, 2)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 pixel-card">
        <DropdownMenuLabel className="font-pixel text-[10px] text-secondary">
          {t("languageSwitcher.ui")}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={user.preferences.uiLanguage} onValueChange={setUiLanguage}>
          {UI_LANGUAGES.map((l) => (
            <DropdownMenuRadioItem key={l.code} value={l.code} className="font-mono text-sm">
              {l.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-pixel text-[10px] text-accent">
          {t("languageSwitcher.code")}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={user.preferences.programmingLanguage}
          onValueChange={(v) => setProgrammingLanguage(v as ProgrammingLanguage)}
        >
          {PROGRAMMING_LANGUAGES.map((l) => (
            <DropdownMenuRadioItem key={l.code} value={l.code} className="font-mono text-sm">
              {l.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
