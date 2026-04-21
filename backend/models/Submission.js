const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expected: { type: String, required: true },
    output: { type: String, default: "" },
    passed: { type: Boolean, required: true },
    error: { type: String, default: null },
    timeMs: { type: Number, default: null },
  },
  { _id: false },
);

const submissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    questId: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", default: null, index: true },
    challengeId: { type: String, required: true, index: true },
    code: { type: String, required: true },
    language: { type: Number, required: true },
    status: { type: String, required: true, enum: ["Accepted", "Wrong Answer", "Runtime Error"] },
    output: { type: String, default: "" },
    results: { type: [testResultSchema], default: [] },
  },
  { timestamps: true },
);

submissionSchema.index({ userId: 1, questId: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);
