const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  studentId: { type: String, default: "" },
  password:  { type: String, required: true, select: false },
  role:      { type: String, enum: ["student", "admin"], default: "student" },
  isActive:  { type: Boolean, default: false }, // students start inactive until approved
  isApproved:{ type: Boolean, default: false }, // admin must approve first
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function (c) { return bcrypt.compare(c, this.password); };
userSchema.set("toJSON", { transform: (_d, r) => { delete r.password; return r; } });

module.exports = mongoose.model("User", userSchema);
