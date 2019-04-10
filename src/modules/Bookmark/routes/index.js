const express = require('express');
const ctrlBookmark = require('../controllers/index');
const { checkTokenExists, verifyToken } = require('../../../helpers');

const router = express.Router();

// sample request looks like this http://localhost:3000/api/v1/bookmark/5cacd5567bba342dbc4ea002
router.get('/:id', checkTokenExists, verifyToken, ctrlBookmark.getBookmark);
router.post('/add', checkTokenExists, verifyToken, ctrlBookmark.addBookmark);
router.delete('/delete/bookmark_id/:b_id/user_id/:u_id', checkTokenExists, verifyToken, ctrlBookmark.delBookmark);
module.exports = router;
