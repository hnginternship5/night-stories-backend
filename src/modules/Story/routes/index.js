const express = require('express');
const multer = require('multer');
const expressValidator = require('express-joi-validator');
const ctrlStory = require('../controllers');
const validateStory = require('../policies');
const { catchErrors, verifyToken, checkTokenExists } = require('../../../helpers');

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
router.get('/', catchErrors(ctrlStory.viewStories));
router.get('/:id', catchErrors(ctrlStory.viewSingleStory));
router.get('/category/:catId', catchErrors(ctrlStory.viewStoriesByCategory));
router.post('/create', checkTokenExists, verifyToken, expressValidator(validateStory.create), upload.single('image'), catchErrors(ctrlStory.create));
router.put('/edit/:storyId', checkTokenExists, verifyToken, expressValidator(validateStory.update), upload.single('image'), catchErrors(ctrlStory.update));


module.exports = router;
