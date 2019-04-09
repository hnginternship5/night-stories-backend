const express = require('express');
const userRoutes = require('../modules/User/routes');
const storyRoutes = require('../modules/Story/routes/index');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/story', storyRoutes);

module.exports = router;
