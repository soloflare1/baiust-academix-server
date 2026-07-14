const errorHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(e => e.message).join(", ");
    return res.status(400).json({ success: false, message });
  }
  if (err.code === 11000) return res.status(409).json({ success: false, message: "Duplicate value entered" });
  if (err.name === "JsonWebTokenError") return res.status(401).json({ success: false, message: "Invalid token" });
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
};

module.exports = errorHandler;
