const express = require('express');
const expressValidator = require('express-joi-validator');
const ctrlAdmin = require('../Controller');
const validateInput = require('../policies');
const {
  catchErrors, verifyToken, checkTokenExists, checkAdmin,
} = require('../../../helpers');

const router = express.Router();

router.post('/create', checkTokenExists, verifyToken, checkAdmin, expressValidator(validateInput.create), catchErrors(ctrlAdmin.create));
router.get('/all', catchErrors(ctrlAdmin.getAll));
router.put('/edit/:catId', checkTokenExists, verifyToken, checkAdmin, expressValidator(validateInput.update), catchErrors(ctrlAdmin.update));
router.delete('/delete/:catId', checkTokenExists, verifyToken, checkAdmin, catchErrors(ctrlAdmin.delete));
router.get('/:id', catchErrors(ctrlAdmin.getSingleCategory));
module.exports = router;
