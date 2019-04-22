const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinarystorage = require('multer-storage-cloudinary');
const expressValidator = require('express-joi-validator');
const ctrlUser = require('../controllers');
const validateUser = require('../policies');
const {
  catchErrors, verifyToken, checkTokenExists, checkAdmin,
} = require('../../../helpers');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinarystorage({
  cloudinary: cloudinary,
  folder: "upload",
  allowedFormats: ["jpg", "png"],
});

const parser = multer({storage: storage})

const router = express.Router();

router.post('/register', parser.none(), expressValidator(validateUser.register), catchErrors(ctrlUser.register));
router.put('/edit/:userId', checkTokenExists, verifyToken,parser.single("image"), expressValidator(validateUser.update), catchErrors(ctrlUser.update));
router.get('/profile/:id', catchErrors(ctrlUser.view_profile));
router.post('/login', parser.none(), expressValidator(validateUser.login), catchErrors(ctrlUser.login));
router.get('/all', checkTokenExists, verifyToken, catchErrors(ctrlUser.allUsers));
router.delete('/delete/:userId', checkTokenExists, checkAdmin, catchErrors(ctrlUser.deleteUser));
router.get('/token', checkAdmin, (req, res) => res.status(200).json({
  status: 200,
  method: req.method,
  message: 'Token is valid',
  data: null,
}));

module.exports = router;
