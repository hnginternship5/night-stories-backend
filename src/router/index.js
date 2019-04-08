const express = require('express');
const userRoutes = require('../modules/User/routes');

const router = express.Router();

router.use('/user', userRoutes);

module.exports = router;
