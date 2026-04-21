import type { ProgrammingLanguage } from "@/lib/storage";
import type { Challenge, ChallengeTest, LocalizedText, Track } from "@/data/seedChallenges";
import { validateGeneratedChallenge } from "@/data/challengeTemplateValidation";

type Difficulty = Challenge["difficulty"];

export interface NewChallengeInput {
  id: string;
  order: number;
  track: Track;
  difficulty: Difficulty;
  funcName: string;
  xpReward?: number;
  title: LocalizedText;
  description: LocalizedText;
  hints?: LocalizedText[];
  tests: ChallengeTest[];
}

interface DifficultyProfile {
  defaultXpReward: number;
  hintCount: number;
  starterComment: string;
}

export const DIFFICULTY_PROFILES: Record<Difficulty, DifficultyProfile> = {
  easy: {
    defaultXpReward: 100,
    hintCount: 3,
    starterComment: "Start with a straightforward implementation.",
  },
  medium: {
    defaultXpReward: 220,
    hintCount: 3,
    starterComment: "Handle edge cases before optimizing.",
  },
  hard: {
    defaultXpReward: 400,
    hintCount: 4,
    starterComment: "Aim for an efficient and scalable solution.",
  },
};

const t = (en: string, hi: string, hiEn: string): LocalizedText => ({ en, hi, "hi-en": hiEn });

function fallbackHints(profile: DifficultyProfile): LocalizedText[] {
  const defaults = [
    t("Understand the input-output contract first.", "पहले इनपुट-आउटपुट समझें।", "Pehle input-output samjho."),
    t("Break the problem into smaller steps.", "समस्या को छोटे भागों में तोड़ें।", "Problem ko chhote steps me todo."),
    t("Test with edge cases before final submit.", "अंतिम सबमिट से पहले edge cases जाँचें।", "Final submit se pehle edge cases test karo."),
    t("Check algorithm complexity for larger inputs.", "बड़े इनपुट के लिए complexity देखें।", "Large input ke liye complexity check karo."),
  ];
  return defaults.slice(0, profile.hintCount);
}

function starterTemplate(funcName: string, comment: string): Record<ProgrammingLanguage, string> {
  return {
    javascript: `function ${funcName}() {\n  // ${comment}\n}\n`,
    python: `def ${funcName}():\n    # ${comment}\n    pass\n`,
    java: `class Solution {\n  public Object ${funcName}() {\n    // ${comment}\n    return null;\n  }\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nauto ${funcName}() {\n  // ${comment}\n  return 0;\n}\n`,
  };
}

export function createChallengeFromTemplate(input: NewChallengeInput): Challenge {
  const profile = DIFFICULTY_PROFILES[input.difficulty];
  const challenge: Challenge = {
    id: input.id,
    order: input.order,
    track: input.track,
    difficulty: input.difficulty,
    xpReward: input.xpReward ?? profile.defaultXpReward,
    funcName: input.funcName,
    title: input.title,
    description: input.description,
    hints: input.hints?.length ? input.hints : fallbackHints(profile),
    starter: starterTemplate(input.funcName, profile.starterComment),
    tests: input.tests,
  };

  validateGeneratedChallenge(challenge);
  return challenge;
}
