const express = require('express');
const ctrlFav = require('../controllers/index');
const { checkTokenExists, verifyToken } = require('../../../helpers');

const router = express.Router();

// sample request looks like this http://localhost:3000/api/v1/bookmark/5cacd5567bba342dbc4ea002
router.get('/all', checkTokenExists, verifyToken, ctrlFav.getAllFavorite);
router.get('/story/:storyId', checkTokenExists, verifyToken, ctrlFav.addAndRemoveFavorite);
module.exports = router;
