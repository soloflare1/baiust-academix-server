const multer                = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary            = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder:          "baiust-academix",
    resource_type:   "raw",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
  }),
});

const fileFilter = (_req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, DOC, DOCX, PPT files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload;