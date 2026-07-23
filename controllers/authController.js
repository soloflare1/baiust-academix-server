const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const sendAuth = (res, user, statusCode = 200) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ success: true, token, user });
};

// Register — starts as pending (isApproved: false)
exports.register = async (req, res) => {
  const { name, email, studentId, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ success: false, message: "This email address is already registered." });
  await User.create({ name, email, studentId, password, isApproved: false, isActive: false });
  res.status(201).json({
    success: true,
    message: "Registration successful. Your account is pending administrator approval. Please wait for confirmation before signing in."
  });
};

// Login — check approved + active + route restriction
exports.login = async (req, res) => {
  const { email, password, isAdminLogin } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ success: false, message: "Invalid email address or password." });

  // Admin trying to login from student login page
  if (user.role === "admin" && !isAdminLogin)
    return res.status(403).json({ success: false, message: "Administrator accounts must sign in through the Administrator Sign In page." });

  // Student trying to login from admin login page
  if (user.role !== "admin" && isAdminLogin)
    return res.status(403).json({ success: false, message: "This login page is restricted to administrators only." });

  if (user.role !== "admin") {
    if (!user.isApproved)
      return res.status(403).json({ success: false, message: "Your account is awaiting administrator approval. You will be notified once access is granted." });
    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Your account has been suspended. Please contact the administrator." });
  }

  sendAuth(res, user);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
};