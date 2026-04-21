const Quest = require("../models/Quest");
const mongoose = require("mongoose");

const getQuests = async (_req, res) => {
  try {
    const quests = await Quest.find().sort({ createdAt: 1 });
    return res.json(quests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getQuestById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ _id: id }, { challengeId: id }] } : { challengeId: id };
    const quest = await Quest.findOne(query);
    if (!quest) return res.status(404).json({ error: "Quest not found." });
    return res.json(quest);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const upsertQuest = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.challengeId) return res.status(400).json({ error: "challengeId is required." });

    const quest = await Quest.findOneAndUpdate(
      { challengeId: payload.challengeId },
      { $set: payload },
      { upsert: true, new: true, runValidators: true },
    );
    return res.status(201).json(quest);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getQuests, getQuestById, upsertQuest };
