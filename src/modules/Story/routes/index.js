const express = require('express');
const ctrlStory = require('../controllers/index');

const router = express.Router();

router.get('/', ctrlStory.viewStories);
router.get('/stories:id', ctrlStory.viewSingleStory);

module.exports = router;
