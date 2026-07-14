const User     = require("../models/User");
const Resource = require("../models/Resource");

// Stats
exports.getStats = async (_req, res) => {
  const [totalUsers, pendingUsers, activeUsers, totalResources, pendingResources, approvedResources, rejectedResources] =
    await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "student", isApproved: false }),
      User.countDocuments({ role: "student", isApproved: true, isActive: true }),
      Resource.countDocuments(),
      Resource.countDocuments({ status: "pending" }),
      Resource.countDocuments({ status: "approved" }),
      Resource.countDocuments({ status: "rejected" }),
    ]);
  res.json({ success: true, data: {
    totalUsers, pendingUsers, activeUsers,
    totalResources, pendingResources, approvedResources, rejectedResources
  }});
};

// Get all students (exclude admins, exclude self)
exports.getUsers = async (req, res) => {
  const { page = 1, limit = 20, search, status } = req.query;
  const query = { role: "student" };
  if (search) query.$or = [
    { name:      { $regex: search, $options: "i" } },
    { email:     { $regex: search, $options: "i" } },
    { studentId: { $regex: search, $options: "i" } },
  ];
  if (status === "pending")  { query.isApproved = false; }
  if (status === "approved") { query.isApproved = true;  }

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);
  res.json({ success: true, data, meta: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
};

// Approve student
exports.approveUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: "student" });
  if (!user) return res.status(404).json({ success: false, message: "Student not found." });
  user.isApproved = true;
  user.isActive   = true;
  await user.save();
  res.json({ success: true, data: user });
};

// Remove/suspend student (cannot touch admins)
exports.suspendUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: "student" });
  if (!user) return res.status(404).json({ success: false, message: "Student not found." });
  user.isActive   = false;
  user.isApproved = false;
  await user.save();
  res.json({ success: true, data: user });
};

// Delete student
exports.deleteUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: "student" });
  if (!user) return res.status(404).json({ success: false, message: "Student not found." });
  await user.deleteOne();
  res.json({ success: true, message: "Student account deleted." });
};

// All resources (any status)
exports.getAllResources = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const skip  = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Resource.find(query)
      .populate("uploadedBy", "name studentId email")
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Resource.countDocuments(query),
  ]);
  res.json({ success: true, data, meta: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
};
