const express = require("express");
const { getQuests, getQuestById, upsertQuest } = require("../controllers/questController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/quests", getQuests);
router.get("/quests/:id", getQuestById);
router.post("/quests", authMiddleware, upsertQuest);

module.exports = router;
