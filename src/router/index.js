const express = require('express');
const userRoutes = require('../modules/User/routes');
const storyRoutes = require('../modules/Story/routes');
const bookmarkRoutes = require('../modules/Bookmark/routes/index');
const router = express.Router();

router.use('/user', userRoutes);
router.use('/story', storyRoutes);
router.use('/bookmark', bookmarkRoutes);

module.exports = router;
