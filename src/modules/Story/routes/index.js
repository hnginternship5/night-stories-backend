const express = require('express');
const multer = require('multer');
const expressValidator = require('express-joi-validator');
const ctrlStory = require('../controllers');
const validateStory = require('../policies');
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
router.get('/', catchErrors(ctrlStory.viewStories));
router.get('/:id', catchErrors(ctrlStory.viewSingleStory));
router.get('/category/:catId', catchErrors(ctrlStory.viewStoriesByCategory));
router.post('/create', checkTokenExists, verifyToken, upload.any(), catchErrors(ctrlStory.create));
router.put('/edit/:storyId', checkTokenExists, verifyToken, expressValidator(validateStory.update), upload.single('image'), catchErrors(ctrlStory.update));
router.get('/like/:storyId', checkTokenExists, verifyToken, catchErrors(ctrlStory.likeStory));
router.get('/dislike/:storyId', checkTokenExists, verifyToken, catchErrors(ctrlStory.disLikeStory));
router.delete('/delete/:storyId', checkTokenExists, verifyToken, expressValidator(validateStory.delete), catchErrors(ctrlStory.deleteStory));

module.exports = router;
