import type { Challenge } from "@/data/seedChallenges";
import type { ProgrammingLanguage } from "./storage";

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
  if (language === "javascript") {
    return runJs(code, challenge);
  }
  // Mock for other languages
  return mockRun(challenge, language);
}

function runJs(code: string, challenge: Challenge): RunResult {
  const results: TestResult[] = [];
  const start = performance.now();
  let fn: any = null;
  let setupError: string | null = null;

  try {
    // Wrap user code so we can extract their function from a sandboxed scope.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const factory = new Function(
      `${code}\n; return (typeof ${challenge.funcName} !== 'undefined') ? ${challenge.funcName} : null;`,
    );
    fn = factory();
    if (typeof fn !== "function") {
      setupError = `Function ${challenge.funcName} is not defined.`;
    }
  } catch (e: any) {
    setupError = e?.message || String(e);
  }

  for (const test of challenge.tests) {
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
      // Build a runner that calls the test expression but with `fn` injected as the function name.
      // Replace funcName(...) -> __fn(...)
      const expr = test.input.replace(new RegExp(`\\b${challenge.funcName}\\b`, "g"), "__fn");
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
      const runner = new Function("__fn", `return (${expr});`);
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
    } catch (e: any) {
      results.push({
        input: test.input,
        expected: test.expected,
        output: "",
        passed: false,
        error: e?.message || String(e),
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

function mockRun(challenge: Challenge, language: ProgrammingLanguage): RunResult {
  const results: TestResult[] = challenge.tests.map((t) => ({
    input: t.input,
    expected: t.expected,
    output: "(execution requires Judge0 backend)",
    passed: false,
    error: `${language} execution not yet wired. Connect Judge0 via your backend's POST /execute.`,
  }));
  return { results, passed: false, totalTimeMs: 0 };
}
