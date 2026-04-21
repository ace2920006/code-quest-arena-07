import type { Challenge } from "@/data/seedChallenges";
import { PROGRAMMING_LANGUAGES, type ProgrammingLanguage } from "./storage";

export interface TestResult {
  input: string;
  expected: string;
  output: string;
  passed: boolean;
  error?: string;
  timeMs?: number;
}

export interface RunResult {
  results: TestResult[];
  passed: boolean;
  totalTimeMs: number;
}

/**
 * In-browser JS execution via sandboxed Function. For non-JS languages,
 * MVP returns a friendly mock until Judge0 (RapidAPI) is wired through the
 * external backend at POST /execute.
 */
export async function runCode(
  code: string,
  language: ProgrammingLanguage,
  challenge: Challenge,
): Promise<RunResult> {
  try {
    return await runViaBackend(code, language, challenge);
  } catch (error) {
    if (language === "javascript") {
      return runJs(code, challenge);
    }
    return mockRun(challenge, language, error instanceof Error ? error.message : String(error));
  }
}

async function runViaBackend(
  code: string,
  language: ProgrammingLanguage,
  challenge: Challenge,
): Promise<RunResult> {
  const singleTest = challenge.tests.slice(0, 1);
  const languageId = PROGRAMMING_LANGUAGES.find((entry) => entry.code === language)?.judge0Id;
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000"}/api/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      language_id: languageId,
      questId: challenge.id,
      tests: singleTest.map((test) => ({
        input: test.input,
        expectedOutput: test.expected,
      })),
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Backend returned ${response.status}`);
  }

  const payload = await response.json();
  return {
    results: payload.results ?? [],
    passed: Boolean(payload.passed),
    totalTimeMs: Number(payload.totalTimeMs || 0),
  };
}

function runJs(code: string, challenge: Challenge): RunResult {
  const singleTest = challenge.tests.slice(0, 1);
  const results: TestResult[] = [];
  const start = performance.now();
  let fn: ((...args: unknown[]) => unknown) | null = null;
  let setupError: string | null = null;

  try {
    // Wrap user code so we can extract their function from a sandboxed scope.
    const factory = new Function(
      `${code}\n; return (typeof ${challenge.funcName} !== 'undefined') ? ${challenge.funcName} : null;`,
    ) as () => unknown;
    const maybeFn = factory();
    fn = typeof maybeFn === "function" ? (maybeFn as (...args: unknown[]) => unknown) : null;
    if (typeof fn !== "function") {
      setupError = `Function ${challenge.funcName} is not defined.`;
    }
  } catch (e: unknown) {
    setupError = e instanceof Error ? e.message : String(e);
  }

  for (const test of singleTest) {
    if (setupError) {
      results.push({
        input: test.input,
        expected: test.expected,
        output: "",
        passed: false,
        error: setupError,
      });
      continue;
    }
    try {
      if (!fn) {
        throw new Error(`Function ${challenge.funcName} is not defined.`);
      }
      // Build a runner that calls the test expression but with `fn` injected as the function name.
      // Replace funcName(...) -> __fn(...)
      const expr = test.input.replace(new RegExp(`\\b${challenge.funcName}\\b`, "g"), "__fn");
      const runner = new Function("__fn", `return (${expr});`) as (fnArg: (...args: unknown[]) => unknown) => unknown;
      const t0 = performance.now();
      const out = runner(fn);
      const dt = performance.now() - t0;
      const outStr = stringify(out);
      results.push({
        input: test.input,
        expected: test.expected,
        output: outStr,
        passed: outStr === test.expected,
        timeMs: dt,
      });
    } catch (e: unknown) {
      results.push({
        input: test.input,
        expected: test.expected,
        output: "",
        passed: false,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const totalTimeMs = performance.now() - start;
  return {
    results,
    passed: results.length > 0 && results.every((r) => r.passed),
    totalTimeMs,
  };
}

function stringify(v: unknown): string {
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return String(v);
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function mockRun(challenge: Challenge, language: ProgrammingLanguage, reason?: string): RunResult {
  const results: TestResult[] = challenge.tests.slice(0, 1).map((t) => ({
    input: t.input,
    expected: t.expected,
    output: "(execution requires Judge0 backend)",
    passed: false,
    error:
      `${language} execution not yet wired. Connect Judge0 via your backend's POST /execute.` +
      (reason ? ` (${reason})` : ""),
  }));
  return { results, passed: false, totalTimeMs: 0 };
}
