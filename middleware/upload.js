const multer                = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary            = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder:        "baiust-academix",
    resource_type: "raw",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload;