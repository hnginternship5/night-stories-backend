const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinarystorage = require('multer-storage-cloudinary');
const expressValidator = require('express-joi-validator');
const ctrlStory = require('../controllers');
const validateStory = require('../policies');
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
router.get('/', catchErrors(ctrlStory.viewStories));
router.get('/:id', catchErrors(ctrlStory.viewSingleStory));
router.get('/category/:catId', catchErrors(ctrlStory.viewStoriesByCategory));
router.post('/create', checkTokenExists, verifyToken, parser.single("image"), catchErrors(ctrlStory.create));
router.put('/edit/:storyId', checkTokenExists, verifyToken, parser.single("image"), expressValidator(validateStory.update), catchErrors(ctrlStory.update));
router.get('/like/:storyId', catchErrors(ctrlStory.likeStory));
router.get('/dislike/:storyId', catchErrors(ctrlStory.disLikeStory));
router.delete('/delete/:storyId', checkTokenExists, verifyToken, expressValidator(validateStory.delete), catchErrors(ctrlStory.deleteStory));
router.post('/:storyId/comment', checkTokenExists, verifyToken, catchErrors(ctrlStory.createComment));
router.delete('/:storyId/:commentId/delete', checkTokenExists, verifyToken, expressValidator(validateStory.delete), catchErrors(ctrlStory.deleteComment));

module.exports = router;
