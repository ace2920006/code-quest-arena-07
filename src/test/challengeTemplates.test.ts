import { describe, expect, it } from "vitest";
import { createChallengeFromTemplate } from "@/data/challengeTemplates";

const localized = (base: string) => ({
  en: `${base} EN`,
  hi: `${base} HI`,
  "hi-en": `${base} HINGLISH`,
});

describe("challenge hardness templates", () => {
  it("creates valid easy challenge defaults", () => {
    const challenge = createChallengeFromTemplate({
      id: "tpl-easy-sample",
      order: 1001,
      track: "basics",
      difficulty: "easy",
      funcName: "easySolve",
      title: localized("Easy Title"),
      description: localized("Easy Description"),
      tests: [{ input: "easySolve()", expected: "1" }],
    });

    expect(challenge.xpReward).toBe(100);
    expect(challenge.hints.length).toBe(3);
    expect(challenge.starter.javascript).toContain("function easySolve");
  });

  it("creates valid medium challenge defaults", () => {
    const challenge = createChallengeFromTemplate({
      id: "tpl-medium-sample",
      order: 1002,
      track: "intermediate",
      difficulty: "medium",
      funcName: "mediumSolve",
      title: localized("Medium Title"),
      description: localized("Medium Description"),
      tests: [{ input: "mediumSolve()", expected: "2" }],
    });

    expect(challenge.xpReward).toBe(220);
    expect(challenge.hints.length).toBe(3);
  });

  it("creates valid hard challenge defaults", () => {
    const challenge = createChallengeFromTemplate({
      id: "tpl-hard-sample",
      order: 1003,
      track: "advanced",
      difficulty: "hard",
      funcName: "hardSolve",
      title: localized("Hard Title"),
      description: localized("Hard Description"),
      tests: [{ input: "hardSolve()", expected: "3" }],
    });

    expect(challenge.xpReward).toBe(400);
    expect(challenge.hints.length).toBe(4);
  });
});
