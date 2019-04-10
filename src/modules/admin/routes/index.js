const express = require('express');
const expressValidator = require('express-joi-validator');
const ctrlAdmin = require('../controllers');
const validateInput = require('../policies');
const { catchErrors, verifyToken, checkTokenExists } = require('../../../helpers');

const router = express.Router();

router.post('/category/add', checkTokenExists, verifyToken, expressValidator(validateInput.category), catchErrors(ctrlAdmin.category));
module.exports = router;
