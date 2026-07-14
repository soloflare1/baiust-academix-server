const router  = require("express").Router();
const ctrl    = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const admin   = require("../middleware/adminMiddleware");

router.use(protect, admin);

router.get("/stats",                  ctrl.getStats);
router.get("/users",                  ctrl.getUsers);
router.patch("/users/:id/approve",    ctrl.approveUser);
router.patch("/users/:id/suspend",    ctrl.suspendUser);
router.delete("/users/:id",           ctrl.deleteUser);
router.get("/resources",              ctrl.getAllResources);

module.exports = router;
