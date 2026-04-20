import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Flame, LogOut, Map, Trophy, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LanguageToggle } from "@/components/LanguageToggle";
import { XPBar } from "@/components/XPBar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useTranslation();
  const { user, isGuest, logout } = useAuth();
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
          <div className="h-8 w-8 bg-primary border-2 border-primary-foreground/20 grid place-items-center text-primary-foreground font-pixel text-xs shadow-pixel-sm group-hover:animate-wiggle">
            CQ
          </div>
          <span className="font-pixel text-sm text-primary text-glow-primary hidden sm:inline">
            {t("appName")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/dashboard" icon={<Map className="h-4 w-4" />} label={t("nav.dashboard")} />
          <NavItem to="/leaderboard" icon={<Trophy className="h-4 w-4" />} label={t("nav.leaderboard")} />
          <NavItem to="/profile" icon={<User className="h-4 w-4" />} label={t("nav.profile")} />
        </nav>

        <div className="hidden lg:flex items-center gap-3 flex-1 max-w-xs ml-4">
          <XPBar xp={user.xp} compact />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 border-2 border-warning/40 bg-warning/10 rounded font-pixel text-[10px] text-warning">
            <Flame className="h-3 w-3" />
            {user.streak}
          </div>
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
          <LanguageSwitcher />
          <div className="h-9 w-9 rounded border-2 border-primary/60 bg-gradient-primary grid place-items-center text-primary-foreground font-pixel text-xs">
            {(user.username || "A").slice(0, 1).toUpperCase()}
          </div>
          {!isGuest && (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              aria-label={t("nav.logout")}
              className="hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-3 py-2 font-pixel text-[10px] border-2 border-transparent rounded transition-colors",
          isActive
            ? "border-primary/60 bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:border-border",
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
