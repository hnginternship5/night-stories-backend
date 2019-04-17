const express = require('express');
const userRoutes = require('../modules/User/routes');
const storyRoutes = require('../modules/Story/routes');
const favRoutes = require('../modules/Bookmark/routes');
const categoryROutes = require('../modules/Category/routes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/story', storyRoutes);
router.use('/favorite', favRoutes);
router.use('/category', categoryROutes);

module.exports = router;
