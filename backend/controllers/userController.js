const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Progress = require("../models/Progress");

const signToken = (user) =>
  jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered." });

    const user = await User.create({ username, email, password });
    await Progress.create({ userId: user._id, completedQuests: [] });

    return res.status(201).json({
      token: signToken(user),
      user: { id: user._id, username: user.username, email: user.email, xp: user.xp, level: user.level },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    return res.json({
      token: signToken(user),
      user: { id: user._id, username: user.username, email: user.email, xp: user.xp, level: user.level },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });
    const progress = await Progress.findOne({ userId: user._id }).populate("completedQuests");
    return res.json({ user, progress });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, me };
