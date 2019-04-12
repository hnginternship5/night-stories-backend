const express = require("express");
const expressValidator = require("express-joi-validator");
const ctrlAdmin = require("../Controller");
const validateInput = require("../policies");
const {
  catchErrors,
  verifyToken,
  checkTokenExists,
  checkAdmin
} = require("../../../helpers");

const router = express.Router();

router.post(
  "/create",
  checkTokenExists,
  verifyToken,
  checkAdmin,
  expressValidator(validateInput.category),
  catchErrors(ctrlAdmin.create)
);
router.put(
  "/edit/:catId",
  checkTokenExists,
  verifyToken,
  checkAdmin,
  expressValidator(validateInput.category),
  catchErrors(ctrlAdmin.update)
);
module.exports = router;
