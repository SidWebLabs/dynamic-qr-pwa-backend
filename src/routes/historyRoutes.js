const express = require("express");
const router = express.Router();

const historyController = require("../controllers/historyController");
const validate = require("../middlewares/validateMiddleware");
const joiValidation = require("../validations/joiValidation");
const authMiddleware = require("../middlewares/authentication");

router.use(authMiddleware());

router.get("/", historyController.getHistory);
router.post("/", validate(joiValidation.createHistory), historyController.createHistory);
router.delete("/:id", historyController.deleteHistory);

module.exports = router;