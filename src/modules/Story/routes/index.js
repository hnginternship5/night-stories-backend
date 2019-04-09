const express = require('express');
const ctrlStory = require('../controllers');


const router = express.Router();

router.put('/:story_id/update', ctrlStory.updateStory)

module.exports = router;