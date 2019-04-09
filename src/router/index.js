const express = require('express');
const userRoutes = require('../modules/User/routes');
<<<<<<< HEAD
const storyRoutes = require('../modules/Story/routes');
=======
const storyRoutes = require('../modules/Story/routes/index');
>>>>>>> 067361c0ba9a1fd218dd728273419736f4cf11f5

const router = express.Router();

router.use('/user', userRoutes);
router.use('/story', storyRoutes);

module.exports = router;
