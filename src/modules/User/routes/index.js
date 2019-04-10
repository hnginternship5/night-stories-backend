const express = require('express');
const expressValidator = require('express-joi-validator');
const ctrlUser = require('../controllers');
const validateUser = require('../policies');
const { catchErrors, verifyToken, checkTokenExists } = require('../../../helpers');


const router = express.Router();

router.post('/register', expressValidator(validateUser.register), catchErrors(ctrlUser.register));
router.put('/edit/:userId', checkTokenExists, verifyToken, expressValidator(validateUser.update), catchErrors(ctrlUser.update));
router.get('/profile/:id', catchErrors(ctrlUser.view_profile));
router.post('/login', expressValidator(validateUser.login), catchErrors(ctrlUser.login));

module.exports = router; 
