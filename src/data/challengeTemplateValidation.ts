import type { ProgrammingLanguage } from "@/lib/storage";
import type { Challenge, ChallengeTest, LocalizedText } from "@/data/seedChallenges";

const REQUIRED_LANGS: ProgrammingLanguage[] = ["javascript", "python", "java", "cpp"];

export function validateLocalizedText(value: LocalizedText, label: string) {
  if (!value.en.trim() || !value.hi.trim() || !value["hi-en"].trim()) {
    throw new Error(`${label} must include non-empty en, hi, and hi-en values.`);
  }
}

export function validateChallengeTests(funcName: string, tests: ChallengeTest[]) {
  if (!tests.length) {
    throw new Error("At least one test is required.");
  }

  for (const test of tests) {
    if (!test.input.trim() || !test.expected.trim()) {
      throw new Error("Each test must include non-empty input and expected.");
    }
    if (!test.input.includes(`${funcName}(`)) {
      throw new Error(`Test input "${test.input}" must call ${funcName}(...).`);
    }
  }
}

export function validateStarterTemplates(funcName: string, starter: Record<ProgrammingLanguage, string>) {
  for (const lang of REQUIRED_LANGS) {
    const template = starter[lang];
    if (!template?.trim()) {
      throw new Error(`Missing starter template for ${lang}.`);
    }
    if (!template.includes(funcName)) {
      throw new Error(`Starter template for ${lang} must include function name ${funcName}.`);
    }
  }
}

export function validateGeneratedChallenge(challenge: Challenge) {
  validateLocalizedText(challenge.title, "title");
  validateLocalizedText(challenge.description, "description");
  challenge.hints.forEach((hint, index) => validateLocalizedText(hint, `hint #${index + 1}`));
  validateStarterTemplates(challenge.funcName, challenge.starter);
  validateChallengeTests(challenge.funcName, challenge.tests);
}
