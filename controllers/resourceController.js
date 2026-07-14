const Resource = require("../models/Resource");

exports.getResources = async (req, res) => {
  const { search, type, semId, course, level, term, status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (req.user.role !== "admin") query.status = "approved";
  else if (status) query.status = status;
  if (search) query.$text = { $search: search };
  if (type) query.type = type;
  if (semId) query.semId = semId;
  if (course) query.course = course;
  if (level) query.level = Number(level);
  if (term) query.term = Number(term);

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Resource.find(query).populate("uploadedBy", "name studentId email").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Resource.countDocuments(query),
  ]);
  res.json({ success: true, data, meta: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
};

exports.getResource = async (req, res) => {
  const r = await Resource.findById(req.params.id).populate("uploadedBy", "name studentId email");
  if (!r) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: r });
};

exports.createResource = async (req, res) => {
  const { title, description, type, semId, course, level, term, fileUrl } = req.body;
  const resolvedUrl = req.file ? `/uploads/${req.file.filename}` : (fileUrl || "");
  const resource = await Resource.create({
    title, description, type, semId, course,
    level: Number(level), term: Number(term),
    fileUrl: resolvedUrl, uploadedBy: req.user.id, status: "pending",
  });
  await resource.populate("uploadedBy", "name studentId email");
  res.status(201).json({ success: true, data: resource });
};

exports.deleteResource = async (req, res) => {
  const r = await Resource.findById(req.params.id);
  if (!r) return res.status(404).json({ success: false, message: "Not found" });
  if (r.uploadedBy.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorised" });
  await r.deleteOne();
  res.json({ success: true, message: "Deleted" });
};

exports.updateStatus = async (req, res) => {
  const { status, rejectedReason } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ success: false, message: "Invalid status" });
  const r = await Resource.findByIdAndUpdate(
    req.params.id,
    { status, rejectedReason: status === "rejected" ? (rejectedReason || "") : "" },
    { new: true }
  ).populate("uploadedBy", "name studentId email");
  if (!r) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: r });
};
