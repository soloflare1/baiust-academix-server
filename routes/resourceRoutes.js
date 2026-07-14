const router = require("express").Router();
const ctrl = require("../controllers/resourceController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

router.use(protect);

router.route("/")
  .get(ctrl.getResources)
  .post(upload.single("file"), ctrl.createResource);

router.route("/:id")
  .get(ctrl.getResource)
  .delete(ctrl.deleteResource);

router.patch("/:id/status", admin, ctrl.updateStatus);

module.exports = router;
