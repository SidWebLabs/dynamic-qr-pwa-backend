const router = require("express").Router();
const accountController = require("../controllers/accountControlller");
const authMiddleware = require("../middlewares/authentication");
const validate = require("../middlewares/validateMiddleware");
const joiValidation = require("../validations/joiValidation");

router.use(authMiddleware());

router.get("/", accountController.getAccounts);
router.post("/", validate(joiValidation.createAccount), accountController.createAccount);
router.put("/:id", validate(joiValidation.updateAccount), accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);
router.patch("/:id/primary", accountController.setPrimary);

module.exports = router;
