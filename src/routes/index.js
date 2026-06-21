const router = require("express").Router();
const authRoutes = require("./authRoutes");
const accountRoutes = require("./accountRoutes");
const historyRoutes = require("./historyRoutes");

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/history", historyRoutes);

module.exports = router;