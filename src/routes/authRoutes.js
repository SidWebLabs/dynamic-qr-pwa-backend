const router = require("express").Router();

const authController = require("../controllers/authController");

const validator = require("../middlewares/validation");

const joiValidation = require("../validations/joiValidation");

router.post(
    "/register",
    validator(joiValidation.register),
    authController.register
);

router.post(
    "/login",
    validator(joiValidation.login),
    authController.login
);

module.exports = router;