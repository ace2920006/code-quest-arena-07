import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Local auth fallback. Wire to your /auth endpoints in src/lib/api.ts when backend is ready.
    await new Promise((r) => setTimeout(r, 400));
    login(email, username || email.split("@")[0] || "Adventurer");
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-hero scanlines flex flex-col">
      <header className="container flex items-center justify-between py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary border-2 border-primary-foreground/20 grid place-items-center text-primary-foreground font-pixel text-xs shadow-pixel-sm">
            CQ
          </div>
          <span className="font-pixel text-sm text-primary text-glow-primary">{t("appName")}</span>
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 grid place-items-center container py-10">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md pixel-card bg-gradient-card p-6 space-y-5"
        >
          <div className="text-center space-y-1">
            <div className="font-pixel text-base text-primary text-glow-primary">
              {mode === "login" ? t("auth.login") : t("auth.signup")}
            </div>
            <div className="font-display text-xl text-muted-foreground">{t("tagline")}</div>
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="username" className="font-pixel text-[10px]">
                {t("auth.username")}
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="font-mono border-2"
                placeholder="hero42"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-pixel text-[10px]">
              {t("auth.email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-mono border-2"
              placeholder="hero@quest.dev"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-pixel text-[10px]">
              {t("auth.password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              className="font-mono border-2"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full font-pixel text-xs bg-gradient-primary glow-primary border-2 border-primary-glow"
          >
            {loading
              ? mode === "login"
                ? t("auth.loggingIn")
                : t("auth.signingUp")
              : mode === "login"
                ? t("auth.login")
                : t("auth.signup")}
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="block w-full text-center font-mono text-xs text-muted-foreground hover:text-secondary transition-colors"
          >
            {mode === "login" ? t("auth.switchToSignup") : t("auth.switchToLogin")}
          </button>
        </motion.form>
      </main>
    </div>
  );
};

export default Login;
