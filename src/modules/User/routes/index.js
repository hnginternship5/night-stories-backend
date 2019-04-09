const express = require('express');
const expressValidator = require('express-joi-validator');
const ctrlUser = require('../controllers');
const validateUser = require('../policies');
const { catchErrors } = require('../../../helpers');


const router = express.Router();

router.post('/register', expressValidator(validateUser.register), catchErrors(ctrlUser.register))
router.get('/profile/:id', catchErrors(ctrlUser.view_profile));



module.exports = router;
