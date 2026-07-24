const Resource   = require("../models/Resource");
const cloudinary = require("../config/cloudinary");


exports.getResources = async (req, res) => {
  const { course, type, semId, search, limit = 50 } = req.query;
  const filter = { status: "approved" };

  if (course)  filter.course = course;
  if (type)    filter.type   = type;
  if (semId)   filter.semId  = semId;
  if (search)  filter.$text  = { $search: search };

  const resources = await Resource.find(filter)
    .populate("uploadedBy", "name studentId")
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json({ success: true, data: resources });
};


exports.createResource = async (req, res) => {
  const { title, description, type, semId, course, level, term, fileUrl } = req.body;

  
  const finalUrl = req.file?.path || fileUrl || "";

  const resource = await Resource.create({
    title, description, type, semId, course,
    level: Number(level),
    term:  Number(term),
    fileUrl: finalUrl,
    uploadedBy: req.user._id,
    status: "pending",
  });

  res.status(201).json({ success: true, data: resource });
};


exports.deleteResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });

  const isOwner = resource.uploadedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin)
    return res.status(403).json({ success: false, message: "Not authorised." });

  if (resource.fileUrl && resource.fileUrl.includes("cloudinary.com")) {
    try {
      const publicId = resource.fileUrl
        .split("/").slice(-2).join("/").replace(/\.[^/.]+$/, "");
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    } catch (e) {
      console.warn("Cloudinary delete failed:", e.message);
    }
  }

  await resource.deleteOne();
  res.json({ success: true, message: "Resource deleted." });
};


exports.updateResourceStatus = async (req, res) => {
  const { status, rejectedReason } = req.body;
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { status, rejectedReason: rejectedReason || "" },
    { new: true }
  );
  if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });
  res.json({ success: true, data: resource });
};