const router = require("express").Router();
const authRoutes = require("./authRoutes");
const accountRoutes = require("./accountRoutes");
const historyRoutes = require("./historyRoutes");
const splitPaymentRoutes = require("./splitPaymentRoutes");

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/history", historyRoutes);
router.use("/split-payments", splitPaymentRoutes);

module.exports = router;