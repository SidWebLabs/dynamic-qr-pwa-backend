const router = require("express").Router();
const authRoutes = require("./authRoutes");
const accountRoutes = require("./accountRoutes");

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);

module.exports = router;