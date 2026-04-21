const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { _id: false },
);

const questSchema = new mongoose.Schema(
  {
    challengeId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ["easy", "medium", "hard"] },
    functionName: { type: String, required: true },
    testCases: { type: [testCaseSchema], default: [] },
    xpReward: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Quest", questSchema);
