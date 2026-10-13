const express = require("express");
const router = express.Router();

const splitPaymentController = require("../controllers/splitPaymentController");
const validate = require("../middlewares/validateMiddleware");
const joiValidation = require("../validations/joiValidation");
const authMiddleware = require("../middlewares/authentication");

router.use(authMiddleware());

router.get("/", splitPaymentController.getSplitPayments);
router.post(
    "/",
    validate(joiValidation.createSplitPayment),
    splitPaymentController.createSplitPayment
);
router.delete("/:id", splitPaymentController.deleteSplitPayment);

module.exports = router;
