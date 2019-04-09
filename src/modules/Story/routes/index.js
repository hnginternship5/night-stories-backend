const express = require('express');
const expressValidator = require('express-joi-validator');
const ctrlStory = require('../controllers');
const validateStory = require('../policies');
const { catchErrors, verifyToken, checkTokenExists } = require('../../../helpers');


const router = express.Router();
router.get('/', ctrlStory.viewStories);
router.get('/stories:id', ctrlStory.viewSingleStory);
router.post('/create', expressValidator(validateStory.create), checkTokenExists, verifyToken, catchErrors(ctrlStory.create));


module.exports = router;
