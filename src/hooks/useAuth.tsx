import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { storage, type ProgrammingLanguage, type UserProgress } from "@/lib/storage";

interface AuthContextValue {
  user: UserProgress;
  isGuest: boolean;
  login: (email: string, username: string) => void;
  logout: () => void;
  update: (patch: Partial<UserProgress> | ((u: UserProgress) => UserProgress)) => void;
  setUiLanguage: (l: string) => void;
  setProgrammingLanguage: (l: ProgrammingLanguage) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<UserProgress>(() => storage.ensure());

  useEffect(() => {
    if (i18n.language !== user.preferences.uiLanguage) {
      i18n.changeLanguage(user.preferences.uiLanguage);
    }
  }, [user.preferences.uiLanguage, i18n]);

  const persist = useCallback((next: UserProgress) => {
    storage.set(next);
    setUser(next);
  }, []);

  const update: AuthContextValue["update"] = useCallback(
    (patch) => {
      setUser((prev) => {
        const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
        storage.set(next);
        return next;
      });
    },
    [],
  );

  const login = useCallback(
    (email: string, username: string) => {
      const fresh = storage.createGuest({ email, username, avatarSeed: username || email });
      persist(fresh);
    },
    [persist],
  );

  const logout = useCallback(() => {
    storage.clear();
    persist(storage.ensure());
  }, [persist]);

  const setUiLanguage = useCallback(
    (l: string) => {
      i18n.changeLanguage(l);
      update((u) => ({ ...u, preferences: { ...u.preferences, uiLanguage: l } }));
    },
    [i18n, update],
  );

  const setProgrammingLanguage = useCallback(
    (l: ProgrammingLanguage) => {
      update((u) => {
        const badges = u.badges.includes("polyglot") || u.preferences.programmingLanguage === l
          ? u.badges
          : [...u.badges, "polyglot"];
        return { ...u, badges, preferences: { ...u.preferences, programmingLanguage: l } };
      });
    },
    [update],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isGuest: user.email === "guest@codequest.local",
      login,
      logout,
      update,
      setUiLanguage,
      setProgrammingLanguage,
    }),
    [user, login, logout, update, setUiLanguage, setProgrammingLanguage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
