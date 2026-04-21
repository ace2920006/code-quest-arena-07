const submitCode = require("../services/judge0Service");
const Quest = require("../models/Quest");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Progress = require("../models/Progress");
const mongoose = require("mongoose");

const normalizeOutput = (result) => {
  if (typeof result.stdout === "string") return result.stdout.trim();
  if (typeof result.compile_output === "string") return result.compile_output.trim();
  if (typeof result.stderr === "string") return result.stderr.trim();
  return "";
};

const executeCode = async (req, res) => {
  try {
    const { code, language_id, questId, userId, tests } = req.body;

    if (!code || !language_id || !questId) {
      return res.status(400).json({ error: "code, language_id and questId are required." });
    }

    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });
    }

    const questQuery = mongoose.Types.ObjectId.isValid(questId)
      ? { $or: [{ _id: questId }, { challengeId: questId }] }
      : { challengeId: questId };

    const quest = await Quest.findOne(questQuery);

    const testCases = Array.isArray(tests) && tests.length > 0 ? tests : quest?.testCases || [];
    if (!testCases.length) return res.status(400).json({ error: "No test cases found for this quest." });

    const results = [];
    let allPassed = true;

    for (const test of testCases) {
      const judgeResult = await submitCode({
        source_code: code,
        language_id,
        stdin: test.input,
      });

      const output = normalizeOutput(judgeResult);
      const expected = (test.expectedOutput ?? test.expected ?? "").trim();
      const statusId = Number(judgeResult.status?.id ?? 0);
      const passed = statusId === 3 && output === expected;
      const errorText = judgeResult.stderr || judgeResult.compile_output || null;

      results.push({
        input: test.input,
        expected,
        output,
        passed,
        error: errorText,
        timeMs: judgeResult.time ? Number(judgeResult.time) * 1000 : null,
      });

      if (statusId !== 3) {
        allPassed = false;
        break;
      }

      if ((judgeResult.stdout || "").trim() !== expected) {
        allPassed = false;
        break;
      }
    }

    const status = allPassed ? "Accepted" : "Wrong Answer";
    const xpReward = quest?.xpReward ?? 0;

    if (user?._id) {
      await Submission.create({
        userId,
        questId: quest?._id,
        challengeId: questId,
        code,
        language: language_id,
        status,
        output: results.at(-1)?.output ?? "",
        results,
      });
    }

    let awardedXp = 0;
    if (allPassed && quest?._id && user?._id) {
      let progress = await Progress.findOne({ userId });
      if (!progress) {
        progress = await Progress.create({ userId, completedQuests: [] });
      }

      const alreadySolved = progress.completedQuests.some((id) => String(id) === String(quest._id));
      if (!alreadySolved) {
        progress.completedQuests.push(quest._id);
        await progress.save();

        awardedXp = xpReward;
        user.xp += awardedXp;
        user.level = Math.floor(user.xp / 100) + 1;
        await user.save();
      }
    }

    return res.json({
      success: true,
      status,
      passed: allPassed,
      results,
      totalTimeMs: results.reduce((sum, r) => sum + (r.timeMs || 0), 0),
      user: user ? { xp: user.xp, level: user.level } : null,
      awardedXp,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Execution failed." });
  }
};

module.exports = { executeCode };
