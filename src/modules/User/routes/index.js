const express = require('express');
const multer = require('multer');
const expressValidator = require('express-joi-validator');
const ctrlUser = require('../controllers');
const validateUser = require('../policies');
const {
  catchErrors, verifyToken, checkTokenExists, checkAdmin,
} = require('../../../helpers');

const storage = multer.diskStorage({
  filename(_req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const imageFilter = (_req, file, cb) => {
  // accept image files in jpg/jpeg/png only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  return cb(null, true);
};
const upload = multer({ storage, fileFilter: imageFilter });

const router = express.Router();

router.post('/register', expressValidator(validateUser.register), catchErrors(ctrlUser.register));
router.put('/edit/:userId', checkTokenExists, verifyToken, expressValidator(validateUser.update), upload.single('image'), catchErrors(ctrlUser.update));
router.get('/profile/:id', catchErrors(ctrlUser.view_profile));
router.post('/login', expressValidator(validateUser.login), catchErrors(ctrlUser.login));
router.get('/all', checkTokenExists, verifyToken, catchErrors(ctrlUser.allUsers));
router.delete('/delete/:userId', checkTokenExists, checkAdmin, catchErrors(ctrlUser.deleteUser));
router.get('/token', checkTokenExists, verifyToken, (req, res) => res.status(200).json({
  status: 200,
  method: req.method,
  message: 'Token is valid',
  data: null,
}));

module.exports = router;
