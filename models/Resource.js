const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["book", "note", "video", "question"], required: true },
  fileUrl: { type: String, default: "" },
  level: { type: Number, required: true },
  term: { type: Number, required: true },
  semId: { type: String, required: true },
  course: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  rejectedReason: { type: String, default: "" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

resourceSchema.index({ title: "text", description: "text" });
resourceSchema.index({ semId: 1, course: 1, type: 1, status: 1 });

module.exports = mongoose.model("Resource", resourceSchema);
