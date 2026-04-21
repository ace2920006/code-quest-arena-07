// Local storage helpers + types

export type ProgrammingLanguage = "javascript" | "python" | "java" | "cpp";

export const PROGRAMMING_LANGUAGES: { code: ProgrammingLanguage; label: string; judge0Id: number }[] = [
  { code: "javascript", label: "JavaScript", judge0Id: 63 },
  { code: "python", label: "Python", judge0Id: 71 },
  { code: "java", label: "Java", judge0Id: 62 },
  { code: "cpp", label: "C++", judge0Id: 54 },
];

export interface UserProgress {
  username: string;
  email: string;
  avatarSeed: string;
  xp: number;
  completed: string[]; // challenge ids
  hintsUsed: Record<string, number>;
  streak: number;
  lastSolvedAt: string | null;
  badges: string[];
  completionOutputs: Record<
    string,
    {
      passedCount: number;
      totalCount: number;
      outputs: string[];
      updatedAt: string;
    }
  >;
  preferences: {
    uiLanguage: string;
    programmingLanguage: ProgrammingLanguage;
  };
}

const KEY = "cq:user";

const DEFAULT_USER = (overrides?: Partial<UserProgress>): UserProgress => ({
  username: "Adventurer",
  email: "guest@codequest.local",
  avatarSeed: "pixel" + Math.floor(Math.random() * 9999),
  xp: 0,
  completed: [],
  hintsUsed: {},
  streak: 0,
  lastSolvedAt: null,
  badges: [],
  completionOutputs: {},
  preferences: {
    uiLanguage: (typeof window !== "undefined" && localStorage.getItem("cq:uiLang")) || "en",
    programmingLanguage:
      ((typeof window !== "undefined" && localStorage.getItem("cq:codeLang")) as ProgrammingLanguage) || "javascript",
  },
  ...overrides,
});

export const storage = {
  get(): UserProgress | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<UserProgress>;
      const fallback = DEFAULT_USER();
      return {
        ...fallback,
        ...parsed,
        badges: parsed.badges ?? [],
        completed: parsed.completed ?? [],
        hintsUsed: parsed.hintsUsed ?? {},
        completionOutputs: parsed.completionOutputs ?? {},
        preferences: {
          ...fallback.preferences,
          ...parsed.preferences,
        },
      };
    } catch {
      return null;
    }
  },
  set(u: UserProgress) {
    localStorage.setItem(KEY, JSON.stringify(u));
    localStorage.setItem("cq:uiLang", u.preferences.uiLanguage);
    localStorage.setItem("cq:codeLang", u.preferences.programmingLanguage);
  },
  clear() {
    localStorage.removeItem(KEY);
  },
  ensure(): UserProgress {
    const u = storage.get();
    if (u) return u;
    const fresh = DEFAULT_USER();
    storage.set(fresh);
    return fresh;
  },
  createGuest: DEFAULT_USER,
};
