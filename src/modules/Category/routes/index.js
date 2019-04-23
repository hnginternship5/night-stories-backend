const express = require("express");
const expressValidator = require("express-joi-validator");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinarystorage = require("multer-storage-cloudinary");
const ctrlAdmin = require("../Controller");
const validateInput = require("../policies");
const {
  catchErrors,
  verifyToken,
  checkTokenExists,
  checkAdmin
} = require("../../../helpers");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinarystorage({
  cloudinary: cloudinary,
  folder: "upload",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const parser = multer({ storage: storage }).single("image");

const router = express.Router();

router.post(
  "/create",
  checkTokenExists,
  verifyToken,
  checkAdmin,
  parser,
  expressValidator(validateInput.create),
  catchErrors(ctrlAdmin.create)
);
router.get("/all", catchErrors(ctrlAdmin.getAll));
router.put(
  "/edit/:catId",
  checkTokenExists,
  verifyToken,
  checkAdmin,
  parser.single("image"),
  expressValidator(validateInput.update),
  catchErrors(ctrlAdmin.update)
);
router.delete(
  "/delete/:catId",
  checkTokenExists,
  verifyToken,
  checkAdmin,
  catchErrors(ctrlAdmin.delete)
);
router.get("/:id", catchErrors(ctrlAdmin.getSingleCategory));
module.exports = router;
